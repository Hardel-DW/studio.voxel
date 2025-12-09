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
    folderIcons?: Record<string, string>;
}

export function FileTree({ tree, activePath, onSelect, onElementSelect, elementIcon, folderIcons }: FileTreeProps) {
    const isAllActive = activePath === "";
    const hue = stringToColor("all");

    return (
        <div className="space-y-1 mt-4">
            <button
                type="button"
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                    isAllActive ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                )}
                onClick={() => onSelect("")}>
                {isAllActive && (
                    <div
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        style={{ backgroundColor: hueToHsl(hue) }}
                    />
                )}
                <img src="/icons/search.svg" className="size-5 invert opacity-60" alt="Search" />
                <span className="truncate text-sm font-medium flex-1">All</span>
                <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                    {tree.count}
                </span>
            </button>

            <div className="flex flex-col">
                {Array.from(tree.children.entries())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([childName, childNode]) => (
                        <FileTreeNode
                            key={childName}
                            name={childName}
                            path={childName}
                            node={childNode}
                            activePath={activePath}
                            onSelect={onSelect}
                            onElementSelect={onElementSelect}
                            elementIcon={elementIcon}
                            folderIcons={folderIcons}
                            depth={0}
                        />
                    ))}
            </div>
        </div>
    );
}

interface FileTreeNodeProps {
    name: string;
    path: string;
    node: TreeNode;
    activePath: string;
    onSelect: (path: string) => void;
    onElementSelect?: (elementId: string) => void;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    depth: number;
}

function FileTreeNode({ name, path, node, activePath, onSelect, onElementSelect, elementIcon, folderIcons, depth }: FileTreeNodeProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const hasChildren = node.children.size > 0;
    const isActive = activePath === path;
    const isElement = !!node.elementId;
    const label = Identifier.toDisplay(name);
    const hue = stringToColor(path);
    const customFolderIcon = folderIcons?.[name];

    const handleClick = () => (isElement && node.elementId && onElementSelect ? onElementSelect(node.elementId) : onSelect(path));
    const getIcon = () => {
        if (isElement && elementIcon) return elementIcon;
        if (customFolderIcon) return customFolderIcon;
        return "/icons/folder.svg";
    };

    return (
        <div className="w-full select-none">
            <button
                type="button"
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                    isActive ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                    depth > 0 && "mt-0.5",
                    node.count === 0 && !isActive && "opacity-50"
                )}
                style={{ paddingLeft: depth * 8 + 8 }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                    setIsCollapsed(!isCollapsed);
                }}>
                {isActive && (
                    <div
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        style={{ backgroundColor: hueToHsl(hue) }}
                    />
                )}

                {!isElement && (
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
                            "size-5 object-contain",
                            !isElement && !customFolderIcon && "invert opacity-60",
                            isActive && !isElement && !customFolderIcon && "opacity-100"
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
            </button>

            {hasChildren && !isCollapsed && (
                <div className="flex flex-col border-zinc-800/50 my-1 pl-1 ml-3 border-l">
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
                                folderIcons={folderIcons}
                                depth={depth + 1}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
