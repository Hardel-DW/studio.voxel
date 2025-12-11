import { enUs } from "@/i18n/en-us";
import { frFr } from "@/i18n/fr-fr";

export type Locale = "en-us" | "fr-fr";
export type TranslationKey = keyof typeof enUs;
export type TranslationParams = Record<string, string | number>;
export const supportedLocales: Locale[] = ["en-us", "fr-fr"];
const dictionaries: Record<Locale, Record<string, string>> = { "en-us": enUs, "fr-fr": frFr };
const interpolate = (template: string, params: TranslationParams): string => template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));

export const t = (locale: string) => {
    const dictionary = dictionaries[locale as Locale] ?? dictionaries["en-us"];
    return (key: TranslationKey, params?: TranslationParams): string => {
        const translation = dictionary[key];
        if (!translation) return key;
        return params ? interpolate(translation, params) : translation;
    };
};

