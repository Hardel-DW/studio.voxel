import { cn } from "@/lib/utils";
import { computeLineDiff } from "@/lib/utils/diff";
import DiffLineContent from "@/components/ui/codeblock/DiffLineContent";

export default function CodeDiff(props: { original: string; modified: string; }) {
    const diffLines = computeLineDiff(props.original, props.modified);

    return (
        <div className="relative w-full h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto ">
                <pre className="font-[Consolas] text-sm leading-6">
                    {diffLines.map((line, idx) => (
                        <div
                            key={`${idx}-${line.content}`}
                            className={cn("flex", line.type === "added" && "bg-green-500/10", line.type === "removed" && "bg-red-500/10")}>
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
