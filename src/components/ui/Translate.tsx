import { useTranslate } from "@/lib/hook/useTranslation";

export type TranslateTextType = string | { text: string };

export default function Translate({ content, replace }: { content: TranslateTextType | string | undefined; replace?: string[] }) {
    const translated = useTranslate(content, replace);

    if (typeof content === "string" && translated === content && translated.includes(":")) {
        return <span className="inline-block shimmer-zinc-500 transition rounded-md h-4 w-32" />;
    }

    return translated;
}
