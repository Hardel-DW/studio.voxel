import { createContext, useContext } from "react";
import type { DictionaryType } from "@/lib/i18n/i18nServer";

export const DictionaryContext = createContext<DictionaryType | null>(null);

export const useServerDictionary = (): DictionaryType => {
    const context = useContext(DictionaryContext);
    if (context === null) {
        throw new Error("useServerDictionary must be used within a ServerDictionaryProvider");
    }
    return context;
};
