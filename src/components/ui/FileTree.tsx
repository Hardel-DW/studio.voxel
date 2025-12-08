import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import type { TreeNode } from "@/lib/utils/tree";

interface FileTreeProps {
    tree: TreeNode;
    activePath: string;
    onSelect: (path: string) => void;
    onElementSelect?: (elementId: string) => void;
    elementIcon?: string;
}

export function FileTree({ tree, activePath, onSelect, onElementSelect, elementIcon }: FileTreeProps) {
    return (
        <div className="space-y-1 mt-4">
            <FileTreeNode node={tree} activePath={activePath} onSelect={onSelect} onElementSelect={onElementSelect} elementIcon={elementIcon} isRoot />
        </div>
    );
}

interface FileTreeNodeProps {
    name?: string;
    path?: string;
    node: TreeNode;
    activePath: string;
    onSelect: (path: string) => void;
    onElementSelect?: (elementId: string) => void;
    elementIcon?: string;
    depth?: number;
    isRoot?: boolean;
}

function FileTreeNode({ name, path = "", node, activePath, onSelect, onElementSelect, elementIcon, depth = 0, isRoot = false }: FileTreeNodeProps) {
    const [isCollapsed, setIsCollapsed] = useState(!isRoot);
    const hasChildren = node.children.size > 0;
    const isActive = activePath === path;
    const isElement = !!node.elementId;
    const label = isRoot ? "All" : Identifier.toDisplay(name ?? "All");
    const hue = stringToColor(path || "all");

    const handleClick = () => isElement && node.elementId && onElementSelect ? onElementSelect(node.elementId) : onSelect(path);
    const getIcon = () => {
        if (isRoot) return "/icons/search.svg";
        if (isElement && elementIcon) return elementIcon;
        return "/icons/folder.svg";
    };

    return (
        <div className="w-full select-none">
            <div
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                    isActive ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                    depth > 0 && "mt-0.5"
                )}
                style={{ paddingLeft: isRoot ? 8 : depth * 8 + 8 }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                    setIsCollapsed(!isCollapsed);
                }}
                role="treeitem"
                aria-expanded={isActive}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleClick()}>

                {isActive && (
                    <div
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        style={{ backgroundColor: hueToHsl(hue) }}
                    />
                )}

                {!isRoot && !isElement && (
                    <div className={cn("p-0.5 rounded-md transition-colors -ml-1", hasChildren && "hover:bg-zinc-700/50")}>
                        <img
                            src="/icons/chevron-down.svg"
                            className={cn("size-3 transition-transform invert", isCollapsed && "-rotate-90", !hasChildren && "opacity-20")}
                            alt="Toggle"
                        />
                    </div>
                )}

                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <img
                        src={getIcon()}
                        className={cn(
                            "size-4 object-contain",
                            isElement ? "" : "invert opacity-60",
                            isActive && !isElement && "opacity-100"
                        )}
                        alt={isElement ? "Element" : "Folder"}
                    />
                    <span className="truncate text-sm font-medium">{label}</span>
                </div>

                {!isElement && (
                    <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                        {node.count}
                    </span>
                )}
            </div>

            {hasChildren && !isCollapsed && (
                <div className={cn("flex flex-col border-zinc-800/50 my-1 pl-1 ml-3 border-l", isRoot && "ml-0 border-l-0")}>
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
                                onElementSelect={onElementSelect}
                                elementIcon={elementIcon}
                                depth={isRoot ? 0 : depth + 1}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
