import type { TranslateTextType } from "@/components/ui/Translate";
import { useI18nStore } from "@/lib/i18n/i18nStore";

/**
 * Hook to translate a TranslateTextType or string, use it for components
 */
export function useTranslate(content: TranslateTextType | string | undefined, replace?: string[]): string {
    const translatedText = useI18nStore((state) => state.getTranslation(typeof content === "string" ? content : ""));

    if (content === undefined) {
        return "";
    }

    if (content && typeof content === "object" && content.text) {
        return content.text;
    }

    if (typeof content === "string") {
        if (replace && replace.length > 0) {
            return replace.reduce((acc, rep) => acc.replace("%s", rep), translatedText);
        }
        return translatedText;
    }

    return "";
}
