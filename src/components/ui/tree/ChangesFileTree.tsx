import { Link, useParams } from "@tanstack/react-router";
import type { FileStatus } from "@voxelio/breeze";
import { useState } from "react";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { buildFileTree, type FileTreeNode } from "@/lib/utils/tree";

interface ChangesFileTreeProps {
    diff: Map<string, FileStatus>;
    selectedFile?: string;
}

export function ChangesFileTree({ diff, selectedFile }: ChangesFileTreeProps) {
    const t = useTranslate();
    const tree = buildFileTree(diff);

    if (diff.size === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-2">
                <img src="/icons/check.svg" className="size-6 opacity-20 invert" alt="No changes detected" />
                <span className="text-xs">{t("git.no_changes")}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {sortedEntries(tree.children).map(([name, node]) => (
                <ChangesTreeNode key={name} name={name} node={node} depth={0} selectedFile={selectedFile} />
            ))}
        </div>
    );
}

const sortedEntries = (children: Map<string, FileTreeNode>): [string, FileTreeNode][] =>
    [...children.entries()].toSorted(([, a], [, b]) => {
        if (!a.filePath !== !b.filePath) return a.filePath ? 1 : -1;
        return 0;
    });

function ChangesTreeNode({ name, node, depth, selectedFile }: { name: string; node: FileTreeNode; depth: number; selectedFile?: string }) {
    const [isOpen, setIsOpen] = useState(depth < 2);
    const { lang } = useParams({ from: "/$lang" });
    const isFile = !!node.filePath;
    const hasChildren = node.children.size > 0;
    const isSelected = isFile && node.filePath === selectedFile;

    const handleChevronClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const statusColor = node.status === "added" ? "text-green-500" : node.status === "updated" ? "text-yellow-500" : "text-red-500";
    const statusLabel = node.status === "added" ? "A" : node.status === "updated" ? "M" : "D";

    const content = (
        <div
            className={cn(
                "flex items-center gap-1.5 rounded-lg transition-colors relative group w-full",
                isSelected ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                depth > 0 && "mt-0.5"
            )}
            style={{ paddingLeft: depth * 12 + 8 }}>
            {isSelected && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}

            {!isFile && (
                <button
                    type="button"
                    onClick={handleChevronClick}
                    className={cn("p-0.5 rounded-md transition-colors cursor-pointer", hasChildren && "hover:bg-zinc-700/50")}>
                    <img
                        src="/icons/chevron-down.svg"
                        className={cn("size-3 transition-transform invert", !isOpen && "-rotate-90", !hasChildren && "opacity-20")}
                        alt="Chevron down"
                    />
                </button>
            )}

            <div className="flex items-center gap-2 flex-1 min-w-0 px-2 py-1.5">
                {isFile ? (
                    <span className={cn("text-[10px] font-bold w-3 text-center shrink-0", statusColor)}>{statusLabel}</span>
                ) : (
                    <img src="/icons/folder.svg" className="size-4 invert opacity-60 shrink-0" alt="Folder" />
                )}
                <span className="truncate text-xs font-mono">{name}</span>
            </div>

            {!isFile && (
                <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 mr-2">
                    {node.count}
                </span>
            )}
        </div>
    );

    return (
        <div className="w-full select-none">
            {node.filePath ? (
                <Link to="/$lang/studio/editor/changes/diff" params={{ lang }} search={{ file: node.filePath }}>
                    {content}
                </Link>
            ) : (
                <button type="button" onClick={() => setIsOpen((prev) => !prev)} className="w-full text-left">
                    {content}
                </button>
            )}

            {hasChildren && isOpen && (
                <div className="flex flex-col border-zinc-800/50 my-0.5 pl-1 ml-3 border-l">
                    {sortedEntries(node.children).map(([childName, childNode]) => (
                        <ChangesTreeNode key={childName} name={childName} node={childNode} depth={depth + 1} selectedFile={selectedFile} />
                    ))}
                </div>
            )}
        </div>
    );
}
