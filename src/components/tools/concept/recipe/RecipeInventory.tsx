import { useState } from "react";
import ToolInventory from "@/components/tools/elements/ToolInventory";
import { TextInput } from "@/components/ui/TextInput";

export default function RecipeInventory() {
    const [search, setSearch] = useState("");

    return (
        <div
            className="relative overflow-hidden bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 rounded-xl flex flex-col"
            style={{ height: "calc(100vh - 200px)" }}>
            <div className="flex h-full flex-col">
                <div className="px-6 pt-6 shrink-0">
                    <div className="flex justify-between items-center gap-4">
                        <div className="shrink-0">
                            <h2 className="text-xl font-bold text-white">Inventory</h2>
                            <p className="text-sm text-zinc-400">Select items for your recipe</p>
                        </div>
                        <TextInput
                            className="min-w-64"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <hr className="my-4" />
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                    <ToolInventory search={search} />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 -z-10 brightness-30 rotate-180 hue-rotate-45">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
