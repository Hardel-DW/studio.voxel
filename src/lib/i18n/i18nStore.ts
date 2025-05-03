"use client";

import { create } from "zustand";

// Define debounce timer variable outside the store creator function
// to persist across store updates but reset on module reload.
let debounceTimeout: number | null = null;
const DEBOUNCE_DELAY = 10; // ms

interface I18nState {
    translations: Map<string, string>;
    language: string;
    pendingKeys: Set<string>;
    setLanguage: (lang: string) => void;
    addTranslations: (translations: Record<string, string>) => void;
    getTranslation: (key: string) => string | undefined;
    registerKeys: (keys: string[]) => Promise<void>;
    translateKey: (key: string) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
    translations: new Map(),
    language: "en-us",
    pendingKeys: new Set(),

    setLanguage: (lang) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
            debounceTimeout = null;
        }
        set({ language: lang, translations: new Map(), pendingKeys: new Set() });
    },

    addTranslations: (translations) => {
        set((state) => {
            const newTranslations = new Map(state.translations);
            const newPendingKeys = new Set(state.pendingKeys);

            for (const [key, value] of Object.entries(translations)) {
                newTranslations.set(key, value);
                newPendingKeys.delete(key);

                if (value === null) {
                    // Log only if you need to know about missing keys server-side
                    // console.warn(`Translation for key "${key}" not found or returned null.`);
                }
            }

            return {
                translations: newTranslations,
                pendingKeys: newPendingKeys
            };
        });
    },

    getTranslation: (key) => {
        const state = get();
        const fullKey = `${state.language}@${key}`;
        return state.translations.get(fullKey);
    },

    // This function now schedules keys for fetching rather than fetching immediately.
    registerKeys: async (keys) => {
        const state = get();
        const keysToSchedule: string[] = [];
        const fullKeysToSchedule = new Set<string>();

        // Identify keys that are not already translated and not already pending/scheduled
        for (const key of keys) {
            const fullKey = `${state.language}@${key}`;
            if (!state.translations.has(fullKey) && !state.pendingKeys.has(fullKey)) {
                keysToSchedule.push(key);
                fullKeysToSchedule.add(fullKey);
            }
        }

        if (keysToSchedule.length === 0) return;

        // Immediately mark these keys as pending to prevent duplicate scheduling
        set((state) => ({
            pendingKeys: new Set([...state.pendingKeys, ...fullKeysToSchedule])
        }));

        // Clear existing timer if it exists
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // if window is undefined, we are in the server
        if (typeof window === "undefined") {
            return;
        }

        // Set a new timer to execute the fetch after the delay
        debounceTimeout = window.setTimeout(() => {
            debounceTimeout = null; // Clear the timer ID after execution
            _executeFetch(); // Call the actual fetch function
        }, DEBOUNCE_DELAY);
    },

    translateKey: (key) => {
        const translationResult = get().getTranslation(key);
        if (translationResult === undefined) {
            get().registerKeys([key]);
            return key;
        }

        if (translationResult === null) {
            return key;
        }

        return translationResult;
    }
}));

// Internal function to perform the batched fetch
async function _executeFetch() {
    const state = useI18nStore.getState();
    // Get a snapshot of keys that are currently marked as pending
    const keysToFetchNow = Array.from(state.pendingKeys);

    if (keysToFetchNow.length === 0) {
        console.log("Debounced fetch triggered, but no keys pending.");
        return; // Nothing to fetch
    }

    console.log(`Debounced fetch: Requesting ${keysToFetchNow.length} keys:`, keysToFetchNow);

    try {
        const response = await fetch("/api/i18n", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys: keysToFetchNow })
        });

        if (!response.ok) {
            // Log detailed error and throw to be caught below
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const translations = await response.json();
        // Add fetched translations to the store. This will also remove them from pendingKeys.
        useI18nStore.getState().addTranslations(translations);
        console.log(`Debounced fetch: Successfully fetched ${Object.keys(translations).length} translations.`);
    } catch (error) {
        console.error("Failed to fetch translations in debounced call:", error);

        // If fetch fails, remove the keys we *attempted* to fetch from pendingKeys
        // so they can be retried later if `registerKeys` is called again for them.
        useI18nStore.setState((currentState) => {
            const newPendingKeys = new Set(currentState.pendingKeys);
            for (const key of keysToFetchNow) {
                newPendingKeys.delete(key);
            }
            return { pendingKeys: newPendingKeys };
        });
    }
}
