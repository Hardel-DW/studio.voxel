import "server-only";
import type enDictionary from "../../i18n/en.json";

export type DictionaryType = typeof enDictionary;

const dictionaries = {
    "en-us": () => import("../../i18n/en.json").then((module): DictionaryType => module.default),
    "fr-fr": () => import("../../i18n/fr.json").then((module): DictionaryType => module.default)
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale): Promise<DictionaryType> => {
    const validLocale = dictionaries[locale] ? locale : "en-us";
    return dictionaries[validLocale]();
};

export type KeyDictionary = DictionaryType;
