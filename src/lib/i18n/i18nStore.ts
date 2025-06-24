"use client";

import { create } from "zustand";

interface I18nState {
    language: string;
    translations: Map<string, string>; // en-us@tools:foo.bar
    namespaceStatus: Map<string, 'loading' | 'loaded' | 'error'>; // en-us@tools
    isHydrated: boolean;
    setLanguage: (lang: string) => Promise<void>;
    getTranslation: (key: string) => string;
    loadNamespace: (namespace: string) => Promise<void>;
}

export const useI18nStore = create<I18nState>((set, get) => ({
    language: "en-us",
    translations: new Map(),
    namespaceStatus: new Map(),
    isHydrated: false,

    setLanguage: async (lang: string) => {
        set({ language: lang });
        await get().loadNamespace("default");
    },

    getTranslation: (key: string) => {
        const state = get();

        // During hydration, return key to avoid mismatch
        if (typeof window !== "undefined" && !state.isHydrated) {
            return key;
        }

        const namespace = key.includes(":") ? key.split(":")[0] : "default";
        const nsKey = `${state.language}@${namespace}`;

        if (state.namespaceStatus.get(nsKey) !== 'loaded' && state.namespaceStatus.get(nsKey) !== 'loading') {
            state.loadNamespace(namespace);
            return key;
        }

        return state.translations.get(`${state.language}@${key}`) ?? key;
    },

    loadNamespace: async (namespace: string) => {
        const state = get();
        const nsKey = `${state.language}@${namespace}`;

        if (state.namespaceStatus.get(nsKey) === 'loaded' || state.namespaceStatus.get(nsKey) === 'loading') return;

        // Marquer comme en cours de chargement
        set(current => ({
            namespaceStatus: new Map(current.namespaceStatus).set(nsKey, 'loading')
        }));

        try {
            let module: any;
            if (namespace === "default") {
                switch (state.language) {
                    case "en-us":
                        module = await import("@/i18n/studio/en-us.json");
                        break;
                    case "fr-fr":
                        module = await import("@/i18n/studio/fr-fr.json");
                        break;
                    default:
                        module = await import("@/i18n/studio/en-us.json");
                }
            } else {
                switch (state.language) {
                    case "en-us":
                        module = await import(`@/i18n/studio/en-us/${namespace}.json`);
                        break;
                    case "fr-fr":
                        module = await import(`@/i18n/studio/fr-fr/${namespace}.json`);
                        break;
                    default:
                        module = await import(`@/i18n/studio/en-us/${namespace}.json`);
                }
            }

            set(current => {
                const newTranslations = new Map(current.translations);
                const newNamespaceStatus = new Map(current.namespaceStatus);

                for (const [k, v] of Object.entries(module.default)) {
                    if (typeof v === "string") {
                        const fullKey = namespace === "default" ? k : `${namespace}:${k}`;
                        newTranslations.set(`${state.language}@${fullKey}`, v);
                    }
                }
                newNamespaceStatus.set(nsKey, 'loaded');

                return {
                    translations: newTranslations,
                    namespaceStatus: newNamespaceStatus,
                    isHydrated: true
                };
            });
        } catch {
            console.warn(`Namespace ${namespace} not found`);
            set(current => ({
                namespaceStatus: new Map(current.namespaceStatus).set(nsKey, 'error')
            }));
        }
    }
}));

// Auto-load default namespace
useI18nStore.getState().loadNamespace("default");