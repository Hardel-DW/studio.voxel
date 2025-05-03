"use client";

import { DictionaryContext } from "@/lib/hook/useNext18n";
import type { DictionaryType } from "@/lib/i18n/i18nSercer";
import type React from "react";
import type { ReactNode } from "react";

interface DictionaryProviderProps {
    dictionary: DictionaryType;
    children: ReactNode;
}

// Provider component
export const DictionaryProvider: React.FC<DictionaryProviderProps> = ({ dictionary, children }) => {
    return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>;
};
