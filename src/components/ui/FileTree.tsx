import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import type { TreeFolder } from "@/lib/utils/tree";

interface FileTreeProps {
    tree: TreeFolder;
    activePath: string;
    onSelect: (path: string) => void;
}

export function FileTree({ tree, activePath, onSelect }: FileTreeProps) {
    return (
        <div className="space-y-1">
            <FileTreeNode name="All" path="" node={tree} activePath={activePath} onSelect={onSelect} isRoot />
        </div>
    );
}

interface FileTreeNodeProps {
    name: string;
    path: string;
    node: TreeFolder;
    activePath: string;
    onSelect: (path: string) => void;
    depth?: number;
    isRoot?: boolean;
}

function FileTreeNode({ name, path, node, activePath, onSelect, depth = 0, isRoot = false }: FileTreeNodeProps) {
    const [isCollapsed, setIsCollapsed] = useState(!isRoot);
    const hasChildren = node.children.size > 0;
    const isActive = activePath === path;
    const label = isRoot ? "All" : Identifier.toDisplay(name);
    const hue = stringToColor(path || "all");

    return (
        <div className="w-full select-none">
            <div
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                    isActive ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                    depth > 0 && "mt-0.5"
                )}
                style={{ paddingLeft: isRoot ? "12px" : `${depth * 12 + 12}px` }}
                onClick={() => onSelect(path)}
                role="treeitem"
                aria-expanded={isActive}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        onSelect(path);
                    }
                }}>
                {isActive && (
                    <div
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        style={{ backgroundColor: hueToHsl(hue) }}
                    />
                )}

                {!isRoot && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (hasChildren) setIsCollapsed(!isCollapsed);
                        }}
                        className={cn("p-0.5 rounded-md transition-colors -ml-1", hasChildren && "hover:bg-zinc-700/50")}
                        disabled={!hasChildren}>
                        <img
                            src="/icons/chevron-down.svg"
                            className={cn("size-3 transition-transform invert", isCollapsed && "-rotate-90", !hasChildren && "opacity-20")}
                            alt="Toggle"
                        />
                    </button>
                )}

                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <img
                        src={isRoot ? "/icons/search.svg" : "/icons/folder.svg"}
                        className={cn("size-4 object-contain invert opacity-60", isActive && "opacity-100")}
                        alt="Folder"
                    />
                    <span className="truncate text-sm font-medium">{label}</span>
                </div>

                <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                    {node.count}
                </span>
            </div>

            {hasChildren && !isCollapsed && (
                <div
                    className={cn(
                        "flex flex-col border-zinc-800/50 my-1 pl-1",
                        isRoot ? "ml-0 border-l-0" : "ml-[calc(1rem+7px)] border-l"
                    )}>
                    {Array.from(node.children.entries())
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([childName, childNode]) => (
                            <FileTreeNode
                                key={childName}
                                name={childName}
                                path={path ? `${path}/${childName}` : childName}
                                node={childNode}
                                activePath={activePath}
                                onSelect={onSelect}
                                depth={isRoot ? 0 : depth + 1}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
