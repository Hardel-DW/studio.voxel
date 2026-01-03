import { create } from "zustand";
import enUsDefault from "@/i18n/en-us.json";

export type Locale = "en-us" | "fr-fr";
export type TranslationParams = Record<string, string | number>;

interface I18nStore {
    locale: Locale;
    translations: Map<string, string>;
    isLoading: boolean;
    setLocale: (locale: Locale) => Promise<void>;
}

const loadLocaleData = async (locale: Locale): Promise<Record<string, string>> => {
    if (locale === "en-us") return enUsDefault;
    const module = await import(`@/i18n/${locale}.json`);
    return module.default;
};

const initTranslations = (data: Record<string, string>): Map<string, string> => {
    const map = new Map<string, string>();
    for (const [k, v] of Object.entries(data)) {
        map.set(k, v);
    }
    return map;
};

const interpolate = (str: string, params: TranslationParams): string => str.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));

export const useI18n = create<I18nStore>((set, get) => ({
    locale: "en-us",
    translations: initTranslations(enUsDefault),
    isLoading: false,
    setLocale: async (locale: Locale) => {
        const current = get().locale;
        if (current === locale) return;

        set({ isLoading: true });

        try {
            const data = await loadLocaleData(locale);
            set({
                locale,
                translations: initTranslations(data),
                isLoading: false
            });
        } catch (error) {
            console.error(`Failed to load locale ${locale}`, error);
            set({ isLoading: false });
        }
    }
}));

export const t = (key: string | undefined, params?: TranslationParams): string => {
    if (!key) return "";
    const { translations } = useI18n.getState();
    const translation = translations.get(key);
    if (!translation) return key;
    return params ? interpolate(translation, params) : translation;
};
