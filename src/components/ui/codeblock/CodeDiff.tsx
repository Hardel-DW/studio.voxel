import { getTokenColor, processTokensIntoLines, tokenizeJSON } from "@/lib/utils/json-tokenizer";
import { cn } from "@/lib/utils";

type DiffLineType = "unchanged" | "added" | "removed";

interface DiffLine {
    type: DiffLineType;
    content: string;
}

interface CodeDiffProps {
    original: string;
    modified: string;
}

function computeLineDiff(original: string, modified: string): DiffLine[] {
    const originalLines = original.split("\n");
    const modifiedLines = modified.split("\n");
    const result: DiffLine[] = [];

    let i = 0;
    let j = 0;

    while (i < originalLines.length || j < modifiedLines.length) {
        if (i >= originalLines.length) {
            result.push({ type: "added", content: modifiedLines[j] });
            j++;
        } else if (j >= modifiedLines.length) {
            result.push({ type: "removed", content: originalLines[i] });
            i++;
        } else if (originalLines[i] === modifiedLines[j]) {
            result.push({ type: "unchanged", content: originalLines[i] });
            i++;
            j++;
        } else {
            const lookAheadOriginal = originalLines.slice(i, i + 5).indexOf(modifiedLines[j]);
            const lookAheadModified = modifiedLines.slice(j, j + 5).indexOf(originalLines[i]);

            if (lookAheadOriginal !== -1 && (lookAheadModified === -1 || lookAheadOriginal <= lookAheadModified)) {
                for (let k = 0; k < lookAheadOriginal; k++) {
                    result.push({ type: "removed", content: originalLines[i + k] });
                }
                i += lookAheadOriginal;
            } else if (lookAheadModified !== -1) {
                for (let k = 0; k < lookAheadModified; k++) {
                    result.push({ type: "added", content: modifiedLines[j + k] });
                }
                j += lookAheadModified;
            } else {
                result.push({ type: "removed", content: originalLines[i] });
                result.push({ type: "added", content: modifiedLines[j] });
                i++;
                j++;
            }
        }
    }

    return result;
}

function DiffLineContent({ content, type }: { content: string; type: DiffLineType }) {
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

export default function CodeDiff({ original, modified }: CodeDiffProps) {
    const diffLines = computeLineDiff(original, modified);
    const addedCount = diffLines.filter((l) => l.type === "added").length;
    const removedCount = diffLines.filter((l) => l.type === "removed").length;

    return (
        <div className="relative w-full h-full overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-red-500" />
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <div className="size-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-3 ml-4 text-xs font-mono">
                    {addedCount > 0 && <span className="text-green-400">+{addedCount}</span>}
                    {removedCount > 0 && <span className="text-red-400">-{removedCount}</span>}
                    {addedCount === 0 && removedCount === 0 && <span className="text-zinc-500">No changes</span>}
                </div>
            </div>

            <div className="flex-1 overflow-auto ">
                <pre className="font-[Consolas] text-sm leading-6">
                    {diffLines.map((line, idx) => (
                        <div
                            key={`${idx}-${line.content}`}
                            className={cn(
                                "flex",
                                line.type === "added" && "bg-green-500/10",
                                line.type === "removed" && "bg-red-500/10"
                            )}>
                            <span
                                className={cn(
                                    "w-12 shrink-0 select-none text-right pr-4 border-r border-zinc-800/50",
                                    line.type === "added" && "text-green-500 bg-green-500/5",
                                    line.type === "removed" && "text-red-500 bg-red-500/5",
                                    line.type === "unchanged" && "text-zinc-600"
                                )}>
                                {line.type === "added" ? "+" : line.type === "removed" ? "-" : idx + 1}
                            </span>
                            <div className="flex-1 px-4">
                                <DiffLineContent content={line.content} type={line.type} />
                            </div>
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );
}
