import { useTranslate } from "@/lib/hook/useTranslation";

export type TranslateTextType = string | { text: string };

export default function Translate({ content }: { content: TranslateTextType | string | undefined }) {
    const translated = useTranslate(content);

    if (typeof content === "string" && translated === content && translated.includes(":")) {
        return <span className="inline-block shimmer-zinc-500 transition rounded-md h-4 w-32" />;
    }

    return translated;
}
