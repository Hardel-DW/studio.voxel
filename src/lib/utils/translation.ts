import type { TranslateTextType } from "@/components/tools/Translate";

export const getKey = (text: TranslateTextType): string => (typeof text === "string" ? text : text.key);
