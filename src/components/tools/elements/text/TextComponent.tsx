import type { TextComponentType } from "@voxelio/breeze/schema";

export default function TextComponent({
    data
}: {
    data: TextComponentType | string;
}) {
    if (typeof data === "string") {
        return <div className="break-words">{data}</div>;
    }

    if (Array.isArray(data)) {
        return (
            <div className="break-words">
                {data.map((item, index) => (
                    <span key={index.toString()}>{item.toString()}</span>
                ))}
            </div>
        );
    }

    if (typeof data === "object" && data !== null) {
        if ("fallback" in data) {
            return <div className="break-words">{data.fallback}</div>;
        }

        if ("translate" in data) {
            const { translate } = data;
            const word = translate.split(".");
            const last = word[word.length - 1];
            const title = last.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

            return <div className="break-words">{title}</div>;
        }
    }
}
