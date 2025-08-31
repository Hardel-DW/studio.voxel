import type { TranslateTextType } from "@/components/tools/Translate";
import { useI18nStore } from "@/lib/i18n/i18nStore";

/**
 * Hook to get a single translation key, use it for function
 */
export function useTranslateKey(key: string): string {
    return useI18nStore((state) => state.getTranslation(key));
}

/**
 * Hook to translate a TranslateTextType or string, use it for components
 */
export function useTranslate(content: TranslateTextType | string | undefined, replace?: string[]): string {
    // Always call the hook to respect React's rules of hooks
    const translationKey = typeof content === "string" ? content : "";
    const translatedText = useTranslateKey(translationKey);

    // If content is undefined, return empty string
    if (content === undefined) {
        return "";
    }

    // If content is an object with text property, return the text directly
    if (content && typeof content === "object" && content.text) {
        return content.text;
    }

    // If content is a string, return the translated text
    if (typeof content === "string") {
        if (replace && replace.length > 0) {
            return replace.reduce((acc, rep) => acc.replace("%s", rep), translatedText);
        }
        return translatedText;
    }

    return "";
}
