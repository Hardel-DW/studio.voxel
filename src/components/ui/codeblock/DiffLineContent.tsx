import { cn } from "@/lib/utils";
import type { DiffLineType } from "@/lib/utils/diff";
import { getTokenColor, processTokensIntoLines, tokenizeJSON } from "@/lib/utils/json-tokenizer";

export default function DiffLineContent({ content, type }: { content: string; type: DiffLineType }) {
    const tokens = tokenizeJSON(content);
    const lineTokens = processTokensIntoLines(tokens)[0] ?? [];

    return (
        <code className="flex-1 whitespace-pre">
            {lineTokens.map((token, idx) => (
                <span
                    key={`${idx}-${token.value}`}
                    style={{
                        color: type === "unchanged" ? getTokenColor(token.type) : undefined
                    }}
                    className={cn(type === "added" && "text-green-300", type === "removed" && "text-red-300")}>
                    {token.value}
                </span>
            ))}
            {lineTokens.length === 0 && <span>&nbsp;</span>}
        </code>
    );
}
