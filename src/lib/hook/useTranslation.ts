import { useI18nStore } from "@/lib/i18n/i18nStore";
import type { TranslateTextType } from "@voxelio/breeze/core";

// Hook to get a single translation key and trigger a rerender
export function useTranslateKey(key: string): string {
    return useI18nStore((state) => state.translateKey(key));
}

// Hook to translate a TranslateTextType or string
export function useTranslate(content: TranslateTextType | string | undefined, replace?: string[]): string {
    if (typeof content === "string" || content === undefined) {
        return content || "";
    }

    if (content && typeof content === "object" && content.type === "translate" && typeof content.value === "string") {
        const text = useTranslateKey(content.value);
        const replacements = replace || content.replace;
        if (replacements && replacements.length > 0) {
            return replacements.reduce((acc, rep) => acc.replace("%s", rep), text);
        }
        return text;
    }

    // Unexpected shape
    return "";
}
