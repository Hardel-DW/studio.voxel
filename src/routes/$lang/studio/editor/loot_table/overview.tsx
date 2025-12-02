import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import LootOverviewCard from "@/components/tools/concept/loot/LootOverviewCard";
import Translate from "@/components/ui/Translate";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/overview")({
    component: RouteComponent
});

type LootCategory = "all" | "block" | "entity" | "chest" | "gameplay";
const CATEGORIES = [
    {
        id: "all",
        label: "loot:overview.category.all",
        description: "loot:overview.hero.description",
        icon: "/icons/search.svg",
        accentColor: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
        id: "block",
        label: "loot:overview.category.blocks",
        description: "enchantment:overview.sort.supported.description",
        icon: "/images/features/block/deepslate.webp",
        accentColor: "from-stone-500/20 to-emerald-500/20"
    },
    {
        id: "entity",
        label: "loot:overview.category.entities",
        description: "enchantment:overview.sort.exclusive.description",
        icon: "/images/features/entity/zombie.webp",
        accentColor: "from-red-500/20 to-orange-500/20"
    },
    {
        id: "chest",
        label: "loot:overview.category.chests",
        description: "loot:overview.category.chests",
        icon: "/images/features/block/chest.webp",
        accentColor: "from-amber-500/20 to-yellow-500/20"
    },
    {
        id: "gameplay",
        label: "loot:overview.category.gameplay",
        description: "loot:overview.category.gameplay",
        icon: "/images/features/item/enchanted_book.webp",
        accentColor: "from-blue-500/20 to-cyan-500/20"
    }
] as const;

function RouteComponent() {
    const [activeCategory, setActiveCategory] = useState<LootCategory>("all");
    const [searchValue, setSearchValue] = useState("");
    const lootElements = useElementsByType("loot_table");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // --- Filtering Logic ---
    const filteredElements = lootElements.filter((el) => {
        const id = el.identifier.resource.toLowerCase();
        const path = new Identifier(el.identifier).toString();

        if (searchValue && !id.includes(searchValue.toLowerCase())) return false;

        if (activeCategory === "block") return path.includes("blocks/");
        if (activeCategory === "entity") return path.includes("entities/");
        if (activeCategory === "chest") return path.includes("chests/");
        if (activeCategory === "gameplay")
            return !path.includes("blocks/") && !path.includes("entities/") && !path.includes("chests/");

        return true;
    });

    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredElements, 24);
    const activeCategoryDef = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

    return (
        <div className="flex size-full overflow-hidden relative z-10 isolate">
            {/* --- SIDEBAR NAVIGATION --- */}
            <aside className="w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/80 flex flex-col z-20">
                <div className="p-6 pb-2">
                    <h2 className="text-lg font-minecraft font-bold text-zinc-100 flex items-center gap-2 mb-1">
                        <img src="/images/features/item/bundle_close.webp" className="size-5 opacity-80" alt="Logo" />
                        <Translate content="loot:overview.title" />
                    </h2>
                    <p className="text-xs text-zinc-500 pl-7">Explorer</p>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "w-full cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-zinc-900/80 text-white shadow-inner shadow-black/20 ring-1 ring-white/5"
                                        : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                                )}>
                                {/* Active Indicator */}
                                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}

                                <div
                                    className={cn(
                                        "size-8 rounded-md flex items-center justify-center shrink-0 transition-colors",
                                        isActive ? "bg-zinc-800" : "bg-zinc-900/50 group-hover:bg-zinc-800"
                                    )}>
                                    <img
                                        src={cat.icon}
                                        alt={cat.label}
                                        className={cn(
                                            "size-5 transition-all object-contain pixelated",
                                            isActive ? "scale-110 drop-shadow-md" : "opacity-50 group-hover:opacity-100"
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col items-start text-left">
                                    <span className={cn("transition-colors", isActive ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-300")}>
                                        <Translate content={cat.label} />
                                    </span>
                                    {isActive && (
                                        <span className="text-[10px] text-zinc-500 font-normal">
                                            {filteredElements.length} tables
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Sidebar Stats or Info */}
                <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/90">
                    <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/50 flex items-center justify-between group hover:border-zinc-700/50 transition-colors">
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium mb-0.5">Total Loaded</div>
                            <div className="text-lg font-mono font-bold text-zinc-300 group-hover:text-white transition-colors">{lootElements.length}</div>
                        </div>
                        <div className="size-8 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                            <img src="/icons/tools/overview/list.svg" className="size-4 invert opacity-30 group-hover:opacity-50 transition-opacity" alt="Stats" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col min-w-0 relative bg-zinc-950">
                {/* DYNAMIC HEADER */}
                <header className="relative shrink-0 overflow-hidden border-b border-zinc-800/50 bg-zinc-900/50">
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 z-0">
                        <div className={cn("absolute inset-0 bg-linear-to-r mix-blend-overlay opacity-40", activeCategoryDef.accentColor)} />
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
                                        <Translate content={activeCategoryDef.label} />
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-xl font-minecraft">
                                    <Translate content={activeCategoryDef.label} />
                                </h1>
                                <div className="h-px w-24 bg-linear-to-r from-white/50 to-transparent my-3" />
                                <p className="text-zinc-300 max-w-2xl line-clamp-1 drop-shadow-md font-light text-sm opacity-90">
                                    <Translate content={activeCategoryDef.description} />
                                </p>
                            </div>

                            {/* TOOLBAR IN HEADER */}
                            <div className="flex items-center gap-3">
                                <div className="flex bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("grid")}
                                        className={cn(
                                            "p-2 rounded-md transition-all",
                                            viewMode === "grid" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                                        )}>
                                        <img src="/icons/tools/overview/grid.svg" className="size-4 invert" alt="Grid" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("list")}
                                        className={cn(
                                            "p-2 rounded-md transition-all",
                                            viewMode === "list" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                                        )}>
                                        <img src="/icons/tools/overview/list.svg" className="size-4 invert" alt="List" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SEARCH BAR STICKY */}
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
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        {searchValue && (
                            <button
                                type="button"
                                onClick={() => setSearchValue("")}
                                className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white cursor-pointer p-1">
                                <img src="/icons/close.svg" className="size-3 invert" alt="Clear" />
                            </button>
                        )}
                    </div>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-zinc-950/50">
                    {visibleItems.length > 0 ? (
                        <div
                            className={cn(
                                "grid gap-4 pb-20",
                                viewMode === "grid"
                                    ? "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
                                    : "grid-cols-1"
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

                    {hasMore && (
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
