import type { TranslateTextType } from "@/components/tools/Translate";

export const getKey = (content: TranslateTextType): string => (typeof content === "string" ? content : content.text);
