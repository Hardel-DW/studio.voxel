import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import type { TreeNode } from "@/lib/utils/tree";

interface FileTreeProps {
    tree: TreeNode;
    activePath: string;
    activeElementId?: string | null;
    onSelect: (path: string) => void;
    onElementSelect?: (elementId: string) => void;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
}

const sortTreeEntries = (entries: [string, TreeNode][]) =>
    entries.sort(([aName, aNode], [bName, bNode]) => {
        const aIsFolder = !aNode.elementId;
        const bIsFolder = !bNode.elementId;
        if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
        return aName.localeCompare(bName);
    });

export function FileTree({ tree, activePath, activeElementId, onSelect, onElementSelect, elementIcon, folderIcons }: FileTreeProps) {
    return (
        <div className="flex flex-col">
            {sortTreeEntries(Array.from(tree.children.entries())).map(([childName, childNode]) => (
                <FileTreeNode
                    key={childName}
                    name={childName}
                    path={childName}
                    node={childNode}
                    activePath={activePath}
                    activeElementId={activeElementId}
                    onSelect={onSelect}
                    onElementSelect={onElementSelect}
                    elementIcon={elementIcon}
                    folderIcons={folderIcons}
                    depth={0}
                />
            ))}
        </div>
    );
}

interface FileTreeNodeProps {
    name: string;
    path: string;
    node: TreeNode;
    activePath: string;
    activeElementId?: string | null;
    onSelect: (path: string) => void;
    onElementSelect?: (elementId: string) => void;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    depth: number;
}

const hasActiveDescendant = (node: TreeNode, activeId: string | null | undefined): boolean => {
    if (!activeId) return false;
    if (node.elementId === activeId) return true;
    for (const child of node.children.values()) {
        if (hasActiveDescendant(child, activeId)) return true;
    }
    return false;
};

function FileTreeNode(props: FileTreeNodeProps) {
    const { name, path, node, activePath, activeElementId, onSelect, onElementSelect, elementIcon, folderIcons, depth } = props;
    const hasChildren = node.children.size > 0;
    const isElement = !!node.elementId;
    const [isOpen, setIsOpen] = useState(false);
    const label = Identifier.toDisplay(name);
    const hue = stringToColor(path);
    const customFolderIcon = folderIcons?.[name];

    // Auto-expand one-way: only opens, never closes automatically
    const shouldAutoExpand = !isElement && !isOpen && hasActiveDescendant(node, activeElementId);
    if (shouldAutoExpand) {
        setIsOpen(true);
    }

    // Highlight: élément actif OU dossier actif (mais pas les deux)
    const isHighlighted = isElement ? node.elementId === activeElementId : !activeElementId && activePath === path;

    const handleSelect = () => {
        if (isElement && node.elementId && onElementSelect) {
            onElementSelect(node.elementId);
        } else {
            setIsOpen(!isOpen);
            onSelect(path);
        }
    };
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };
    const getIcon = () => {
        if (isElement) return elementIcon ?? "/images/features/item/bundle_open.webp";
        if (customFolderIcon) return customFolderIcon;
        return "/icons/folder.svg";
    };

    return (
        <div className="w-full select-none">
            <button
                type="button"
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                    isHighlighted ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                    depth > 0 && "mt-0.5",
                    node.count === 0 && !isHighlighted && !isElement && "opacity-50"
                )}
                style={{ paddingLeft: depth * 8 + 8 }}
                onClick={handleSelect}>
                {isHighlighted && (
                    <div
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        style={{ backgroundColor: hueToHsl(hue) }}
                    />
                )}

                {!isElement && (
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleToggle}
                        onKeyDown={(e) => e.key === "Enter" && handleToggle(e as unknown as React.MouseEvent)}
                        className={cn("p-0.5 rounded-md transition-colors -ml-1", hasChildren && "hover:bg-zinc-700/50")}>
                        <img
                            src="/icons/chevron-down.svg"
                            className={cn("size-3 transition-transform invert", !isOpen && "-rotate-90", !hasChildren && "opacity-20")}
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
                            isHighlighted && !isElement && !customFolderIcon && "opacity-100"
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

            {hasChildren && isOpen && (
                <div className="flex flex-col border-zinc-800/50 my-1 pl-1 ml-3 border-l">
                    {sortTreeEntries(Array.from(node.children.entries())).map(([childName, childNode]) => (
                        <FileTreeNode
                            key={childName}
                            name={childName}
                            path={path ? `${path}/${childName}` : childName}
                            node={childNode}
                            activePath={activePath}
                            activeElementId={activeElementId}
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
