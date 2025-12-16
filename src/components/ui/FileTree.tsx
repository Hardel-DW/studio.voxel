import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import { hasActiveDescendant, type TreeNodeType } from "@/lib/utils/tree";
import { useTreeNavigation } from "./TreeNavigationContext";

interface FileTreeProps {
    tree: TreeNodeType;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
}

type TreeEntry = [string, TreeNodeType];

const sortedEntries = (children: Map<string, TreeNodeType>): TreeEntry[] =>
    [...children.entries()].toSorted(([aName, aNode], [bName, bNode]) => {
        if (!aNode.elementId !== !bNode.elementId) return aNode.elementId ? 1 : -1;
        return aName.localeCompare(bName);
    });

export function FileTree({ tree, elementIcon, folderIcons }: FileTreeProps) {
    return (
        <div className="flex flex-col">
            {sortedEntries(tree.children).map(([name, node]) => (
                <TreeNode key={name} name={name} path={name} node={node} elementIcon={elementIcon} folderIcons={folderIcons} depth={0} />
            ))}
        </div>
    );
}

interface TreeNodeProps {
    name: string;
    path: string;
    node: TreeNodeType;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    depth: number;
}

function TreeNode({ name, path, node, elementIcon, folderIcons, depth }: TreeNodeProps) {
    const { filterPath, currentElementId, selectFolder, selectElement } = useTreeNavigation();
    const [isOpen, setIsOpen] = useState(false);

    const isElement = !!node.elementId;
    const hasChildren = node.children.size > 0;
    const isHighlighted = isElement ? node.elementId === currentElementId : !currentElementId && filterPath === path;
    const isEmpty = node.count === 0 && !isElement;
    const hue = stringToColor(isElement && node.elementId ? node.elementId : path);

    if (!isElement && !isOpen && hasActiveDescendant(node, currentElementId)) {
        setIsOpen(true);
    }

    const handleClick = () => {
        if (isElement && node.elementId) {
            selectElement(node.elementId);
        } else {
            setIsOpen((prev) => !prev);
            selectFolder(path);
        }
    };

    const handleChevronClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const icon = isElement ? (elementIcon ?? "/images/features/item/bundle_open.webp") : (folderIcons?.[name] ?? "/icons/folder.svg");
    const isDefaultFolderIcon = !isElement && !folderIcons?.[name];

    return (
        <div className="w-full select-none">
            <button
                type="button"
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                    isHighlighted ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                    depth > 0 && "mt-0.5",
                    isEmpty && !isHighlighted && "opacity-50"
                )}
                style={{ paddingLeft: depth * 8 + 8 }}
                onClick={handleClick}>
                {isHighlighted && (
                    <div
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        style={{ backgroundColor: hueToHsl(hue) }}
                    />
                )}

                {!isElement && (
                    <button
                        type="button"
                        onClick={handleChevronClick}
                        className={cn("p-0.5 rounded-md transition-colors -ml-1", hasChildren && "hover:bg-zinc-700/50")}>
                        <img
                            src="/icons/chevron-down.svg"
                            className={cn("size-3 transition-transform invert", !isOpen && "-rotate-90", !hasChildren && "opacity-20")}
                            alt=""
                        />
                    </button>
                )}

                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <img
                        src={icon}
                        className={cn(
                            "size-5 object-contain",
                            isDefaultFolderIcon && "invert opacity-60",
                            isDefaultFolderIcon && isHighlighted && "opacity-100"
                        )}
                        alt=""
                    />
                    <span className="truncate text-sm font-medium">{Identifier.toDisplay(name)}</span>
                </div>

                {!isElement && (
                    <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                        {node.count}
                    </span>
                )}
            </button>

            {hasChildren && isOpen && (
                <div className="flex flex-col border-zinc-800/50 my-1 pl-1 ml-3 border-l">
                    {sortedEntries(node.children).map(([childName, childNode]) => (
                        <TreeNode
                            key={childName}
                            name={childName}
                            path={`${path}/${childName}`}
                            node={childNode}
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
