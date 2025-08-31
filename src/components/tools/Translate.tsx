import { useTranslate } from "@/lib/hook/useTranslation";

export type TranslateTextType = string | { text: string };

export default function Translate({ content }: { content: TranslateTextType | string | undefined }) {
    const translated = useTranslate(content);

    // Show shimmer placeholder only for non-default namespaces that are still loading
    if (typeof content === "string" && translated === content && translated.includes(":")) {
        return (
            <span
                className="inline-block animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(110deg,#71717a60,45%,#52525b60,55%,#71717a60)] transition rounded-md h-4"
                style={{
                    width: "8rem"
                }}
            />
        );
    }

    return <>{translated}</>;
}
