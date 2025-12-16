import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import type { TreeNodeType } from "@/lib/utils/tree";
import { FileTree } from "./FileTree";
import { useTreeNavigation } from "./TreeNavigationContext";

interface TreeSidebarProps {
    tree: TreeNodeType;
    modifiedCount: number;
    changesRoute: string;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
}

export function TreeSidebar({ tree, modifiedCount, changesRoute, elementIcon, folderIcons }: TreeSidebarProps) {
    const { lang } = useParams({ from: "/$lang" });
    const { isAllActive, selectAll, clearSelection } = useTreeNavigation();

    return (
        <div className="space-y-1 mt-4">
            <SidebarLink
                to={changesRoute}
                params={{ lang }}
                icon="/icons/pencil.svg"
                count={modifiedCount}
                disabled={modifiedCount === 0}
                onClick={clearSelection}>
                Updated
            </SidebarLink>
            <SidebarButton icon="/icons/search.svg" count={tree.count} isActive={isAllActive} onClick={selectAll}>
                All
            </SidebarButton>
            <FileTree tree={tree} elementIcon={elementIcon} folderIcons={folderIcons} />
        </div>
    );
}

interface SidebarButtonProps {
    icon: string;
    count: number;
    isActive?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: string;
}

function SidebarButton({ icon, count, isActive, disabled, onClick, children }: SidebarButtonProps) {
    const hue = stringToColor(children.toLowerCase());

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                isActive ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                disabled && "opacity-50 cursor-not-allowed"
            )}>
            {isActive && (
                <div
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    style={{ backgroundColor: hueToHsl(hue) }}
                />
            )}
            <img src={icon} className="size-5 invert opacity-60" alt="" />
            <span className="truncate text-sm font-medium flex-1">{children}</span>
            <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                {count}
            </span>
        </button>
    );
}

interface SidebarLinkProps {
    to: string;
    params: Record<string, string>;
    icon: string;
    count: number;
    disabled?: boolean;
    onClick?: () => void;
    children: string;
}

function SidebarLink({ to, params, icon, count, disabled, onClick, children }: SidebarLinkProps) {
    const content = (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                disabled && "opacity-50 pointer-events-none"
            )}>
            <img src={icon} className="size-5 invert opacity-60" alt="" />
            <span className="truncate text-sm font-medium flex-1">{children}</span>
            <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                {count}
            </span>
        </div>
    );

    if (disabled) return content;

    return (
        <Link to={to} params={params} onClick={onClick}>
            {content}
        </Link>
    );
}
