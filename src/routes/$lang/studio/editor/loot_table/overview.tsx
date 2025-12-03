import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import LootOverviewCard from "@/components/tools/concept/loot/LootOverviewCard";
import { FileTree } from "@/components/ui/FileTree";
import Translate from "@/components/ui/Translate";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import { buildTree, matchesPath } from "@/lib/utils/tree";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/overview")({
    component: RouteComponent
});

function RouteComponent() {
    const [selectedPath, setSelectedPath] = useState("");
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [forceShow, setForceShow] = useState(false);
    const elements = useElementsByType("loot_table");
    const tree = buildTree(elements.map((e) => e.identifier));
    const filtered = elements.filter((el) => {
        if (!matchesPath(el.identifier, selectedPath)) return false;
        if (search && !el.identifier.resource.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const { visibleItems, hasMore, ref } = useInfiniteScroll(filtered, 24);
    const bgColor = filtered[0] ? hueToHsl(stringToColor(selectedPath || "all")) : hueToHsl(stringToColor("all"));

    const isBroadScope = selectedPath === "" || !selectedPath.includes("/");
    const isTooManyItems = !forceShow && isBroadScope && filtered.length > 50 && !search;

    return (
        <div className="flex size-full overflow-hidden relative z-10 isolate">
            <aside className="w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/80 flex flex-col z-20">
                <div className="p-6 pb-2">
                    <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-1">
                        <img src="/images/features/item/bundle_close.webp" className="size-5 opacity-80" alt="Logo" />
                        <Translate content="loot:overview.title" />
                    </h2>
                    <p className="text-xs text-zinc-500 pl-7">Explorer</p>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                    <FileTree
                        tree={tree}
                        activePath={selectedPath}
                        onSelect={(path) => {
                            setSelectedPath(path);
                            setForceShow(false);
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
                                    <span className="opacity-50 text-xs uppercase tracking-wider font-medium">Library</span>
                                    <span className="opacity-30 text-xs">/</span>
                                    <span className="text-zinc-200 font-medium text-xs uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md border border-white/5 backdrop-blur-sm">
                                        {selectedPath ? Identifier.toDisplay(selectedPath.split("/").pop() || "") : "All"}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-xl font-minecraft">
                                    {selectedPath ? Identifier.toDisplay(selectedPath.split("/").pop() || "") : "All"}
                                </h1>
                                <div
                                    className="h-px w-24 my-3 transition-colors duration-500"
                                    style={{ background: `linear-gradient(90deg, ${bgColor}, transparent)` }}
                                />
                                <p className="text-zinc-300 max-w-2xl line-clamp-1 drop-shadow-md font-light text-sm opacity-90">
                                    This section is related to Yggdrasil's loot tables, a custom content pack for Minecraft.
                                </p>
                            </div>

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
                        </div>
                    </div>
                </header>

                <div className="sticky top-0 z-30 px-8 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-xl group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <img
                                src="/icons/search.svg"
                                className="size-4 opacity-50 invert group-focus-within:opacity-100 transition-opacity"
                                alt="Search"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter tables..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm focus:ring-1 focus:ring-zinc-700 focus:bg-zinc-900 outline-none transition-all text-zinc-200 placeholder:text-zinc-600 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white cursor-pointer p-1">
                                <img src="/icons/close.svg" className="size-3 invert" alt="Clear" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-zinc-950/50">
                    {isTooManyItems ? (
                        <div className="h-full flex flex-col items-center justify-center pb-20 opacity-60">
                            <div className="size-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                                <img src="/icons/tools/overview/grid.svg" className="size-10 opacity-20 invert" alt="Too many items" />
                            </div>
                            <h3 className="text-xl font-medium text-zinc-300 mb-2">
                                Too many items to display
                            </h3>
                            <p className="text-zinc-500 max-w-sm text-center mb-6">
                                Please use the search bar or select a specific category to view items.
                            </p>
                            <button
                                type="button"
                                onClick={() => setForceShow(true)}
                                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 rounded-lg text-sm transition-colors cursor-pointer"
                            >
                                Show anyway
                            </button>
                        </div>
                    ) : visibleItems.length > 0 ? (
                        <div
                            className={cn(
                                "grid gap-4 pb-20",
                                viewMode === "grid" ? "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" : "grid-cols-1"
                            )}>
                            {visibleItems.map((element) => (
                                <LootOverviewCard
                                    key={element.identifier.resource}
                                    element={element}
                                    elementId={new Identifier(element.identifier).toUniqueKey()}
                                    mode={viewMode}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center pb-20 opacity-60">
                            <div className="size-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                                <img src="/icons/search.svg" className="size-10 opacity-20 invert" alt="No results" />
                            </div>
                            <h3 className="text-xl font-medium text-zinc-300 mb-2">
                                <Translate content="loot:overview.empty.title" />
                            </h3>
                            <p className="text-zinc-500 max-w-sm text-center">
                                <Translate content="loot:overview.empty.description" />
                            </p>
                        </div>
                    )}

                    {!isTooManyItems && hasMore && (
                        <div ref={ref} className="flex justify-center items-center py-8">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
