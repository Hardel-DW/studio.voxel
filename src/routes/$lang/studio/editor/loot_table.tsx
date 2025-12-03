import { createFileRoute, Link, Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { Identifier, isVoxel } from "@voxelio/breeze";
import { useLootUiStore } from "@/components/tools/concept/loot/LootUiStore";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { FileTree } from "@/components/ui/FileTree";
import Translate from "@/components/ui/Translate";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import { buildTree } from "@/lib/utils/tree";

export const Route = createFileRoute("/$lang/studio/editor/loot_table")({
    component: LootTableLayout
});

function LootTableLayout() {
    const { lang } = useParams({ from: "/$lang/studio/editor/loot_table" });
    const { selectedPath, setSelectedPath, viewMode, setViewMode } = useLootUiStore();
    const elements = useElementsByType("loot_table");
    const tree = buildTree(elements.map((e) => e.identifier));
    const location = useLocation();
    const navigate = useNavigate();
    const isOverview = location.pathname.endsWith("/overview");
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;
    const displayTitle = selectedPath ? Identifier.toDisplay(selectedPath.split("/").pop() || "") : "All";
    const bgColor = hueToHsl(stringToColor(displayTitle));

    return (
        <div className="flex size-full overflow-hidden relative z-10 isolate">
            <aside className="w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/80 flex flex-col z-20">
                <div className="p-6 pb-2">
                    <Link
                        to="/$lang/studio/editor/loot_table/overview"
                        params={{ lang }}
                        className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-1 hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedPath("")}>
                        <img src="/images/features/item/bundle_close.webp" className="size-5 opacity-80" alt="Logo" />
                        <Translate content="loot:overview.title" />
                    </Link>
                    <p className="text-xs text-zinc-500 pl-7">Explorer</p>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                    <FileTree
                        tree={tree}
                        activePath={selectedPath}
                        onSelect={(path) => {
                            setSelectedPath(path);
                            navigate({ to: "/$lang/studio/editor/loot_table/overview", params: { lang } });
                        }}
                    />
                </div>

                <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/90">
                    <a
                        href="https://discord.gg/8z3tkQhay7"
                        className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/50 flex items-center gap-3 group hover:border-zinc-700/50 transition-colors">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Need Help?</div>
                        </div>
                        <div className="size-8 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                            <img
                                src="/icons/company/discord.svg"
                                className="size-4 invert opacity-30 group-hover:opacity-50 transition-opacity"
                                alt="Documentation"
                            />
                        </div>
                    </a>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 relative bg-zinc-950">
                <header className="relative shrink-0 overflow-hidden border-b border-zinc-800/50 bg-zinc-900/50">
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute inset-0 mix-blend-overlay opacity-40 transition-colors duration-500"
                            style={{ backgroundColor: bgColor }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[20px_20px]" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-end p-8 pb-6">
                        <div className="flex items-end justify-between gap-8 relative z-20">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                                    {!isOverview && (
                                        <button
                                            type="button"
                                            onClick={() => navigate({ to: "/$lang/studio/editor/loot_table/overview", params: { lang } })}
                                            className="cursor-pointer flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors mr-2">
                                            <img
                                                src="/icons/back.svg"
                                                className="size-3.5 invert opacity-50 group-hover:opacity-100"
                                                alt="Back"
                                            />
                                            <span className="text-xs font-medium">Back</span>
                                        </button>
                                    )}
                                    <span className="opacity-50 text-xs uppercase tracking-wider font-medium">Loot Tables</span>
                                    {isOverview ? (
                                        selectedPath?.split("/").map((segment, index, array) => (
                                            <span key={segment} className="flex items-center gap-2">
                                                <span className="opacity-30 text-xs">/</span>
                                                <span
                                                    className={
                                                        index === array.length - 1
                                                            ? "text-zinc-200 font-medium text-xs uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md border border-white/5 backdrop-blur-sm"
                                                            : "opacity-50 font-medium text-xs uppercase tracking-wider"
                                                    }>
                                                    {segment}
                                                </span>
                                            </span>
                                        ))
                                    ) : (
                                        <>
                                            <span className="opacity-30 text-xs">/</span>
                                            <span className="opacity-50 text-xs uppercase tracking-wider font-medium">
                                                {lootTable?.identifier.namespace}
                                            </span>
                                            {lootTable?.identifier.resource.split("/").map((segment, index, array) => (
                                                <span key={segment} className="flex items-center gap-2">
                                                    <span className="opacity-30 text-xs">/</span>
                                                    <span
                                                        className={
                                                            index === array.length - 1
                                                                ? "text-zinc-200 font-medium text-xs uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md border border-white/5 backdrop-blur-sm"
                                                                : "opacity-50 font-medium text-xs uppercase tracking-wider"
                                                        }>
                                                        {segment}
                                                    </span>
                                                </span>
                                            ))}
                                        </>
                                    )}
                                </div>
                                <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-xl font-minecraft">
                                    {isOverview
                                        ? displayTitle
                                        : lootTable?.identifier && new Identifier(lootTable.identifier).toResourceName()}
                                </h1>
                                <div
                                    className="h-px w-24 my-3 transition-colors duration-500"
                                    style={{ background: `linear-gradient(90deg, ${bgColor}, transparent)` }}
                                />
                                <p className="text-zinc-300 max-w-2xl line-clamp-1 drop-shadow-md font-light text-sm opacity-90">
                                    This section is related to Yggdrasil's loot tables, a custom content pack for Minecraft.
                                </p>
                            </div>

                            {isOverview && (
                                <div className="flex items-center gap-3">
                                    <div className="flex bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setViewMode("grid")}
                                            className={cn(
                                                "p-2 rounded-md transition-all",
                                                viewMode === "grid"
                                                    ? "bg-zinc-800 text-white shadow-sm"
                                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                                            )}>
                                            <img src="/icons/tools/overview/grid.svg" className="size-4 invert" alt="Grid" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode("list")}
                                            className={cn(
                                                "p-2 rounded-md transition-all",
                                                viewMode === "list"
                                                    ? "bg-zinc-800 text-white shadow-sm"
                                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                                            )}>
                                            <img src="/icons/tools/overview/list.svg" className="size-4 invert" alt="List" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <Outlet />
            </main>
        </div>
    );
}
