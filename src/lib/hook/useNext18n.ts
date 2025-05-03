import type { DictionaryType } from "@/lib/i18n/i18nSercer";
import { createContext, useContext } from "react";

export const DictionaryContext = createContext<DictionaryType | null>(null);

export const useDictionary = (): DictionaryType => {
    const context = useContext(DictionaryContext);
    if (context === null) {
        throw new Error("useDictionary must be used within a DictionaryProvider");
    }
    return context;
};
