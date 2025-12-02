import type enDictionary from "../../i18n/en.json";
export type DictionaryType = typeof enDictionary;

const dictionaryLoaders = {
    "en-us": () => import("../../i18n/en.json").then((module): DictionaryType => module.default),
    "fr-fr": () => import("../../i18n/fr.json").then((module): DictionaryType => module.default)
};

export type Locale = keyof typeof dictionaryLoaders;
const cache = new Map<Locale, DictionaryType>();

export const getDictionary = async (locale: Locale): Promise<DictionaryType> => {
    const validLocale = dictionaryLoaders[locale] ? locale : "en-us";
    const cached = cache.get(validLocale);
    if (cached) {
        return cached;
    }

    const dictionary = await dictionaryLoaders[validLocale]();
    cache.set(validLocale, dictionary);
    return dictionary;
};

export type KeyDictionary = DictionaryType;
