import { useState } from "react";
import ToolInventory from "@/components/tools/elements/ToolInventory";

export default function RecipeInventory() {
    const [search, setSearch] = useState("");

    return (
        <div
            className="relative overflow-hidden bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 rounded-xl flex flex-col"
            style={{ height: "calc(100vh - 200px)" }}>
            <div className="flex h-full flex-col">
                <div className="px-6 pt-6 flex-shrink-0">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex-shrink-0">
                            <h2 className="text-xl font-bold text-white">Inventory</h2>
                            <p className="text-sm text-zinc-400">Select items for your recipe</p>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-400">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <input
                                type="custom"
                                className="min-w-64 pl-8 pr-4 py-2 select-none user-select-none bg-zinc-800/30 border border-zinc-800 rounded-full text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:bg-zinc-700/20 transition-all"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <hr className="my-4" />
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                    <ToolInventory search={search} />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 -z-10 brightness-30 rotate-180 hue-rotate-45">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
