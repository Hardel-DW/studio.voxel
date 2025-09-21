import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDragAndDrop } from "@/lib/hook/useDragAndDrop";
import useRegistry from "@/lib/hook/useRegistry";
import { useMemo } from "react";

export default function ToolInventory({ search }: { search: string }) {
    const { data: allItems, isLoading, isError } = useRegistry<string[]>("registry", "item");
    const { handleDragStart, handleDragEnd, draggedItem } = useDragAndDrop();

    const filteredItems = useMemo(() => {
        if (!allItems) return [];
        return allItems.filter((item) => item !== "air" && item.toLowerCase().includes(search.toLowerCase())).slice(0, 50);
    }, [allItems, search]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-700 mb-4" />
                <p className="text-sm">Loading items...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <p className="text-sm">Error loading items</p>
            </div>
        );
    }

    return (
        <div
            className="grid gap-2"
            style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
                gridTemplateRows: "repeat(auto-fill, minmax(56px, 1fr))"
            }}>
            {filteredItems.map((item) => {
                const isDragging = draggedItem === item;
                return (
                    <button
                        type="button"
                        key={item}
                        className={`relative overflow-hidden bg-zinc-900/20 border border-zinc-800 hover:border-zinc-600 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all hover:bg-zinc-900/40 group ${isDragging ? "opacity-50" : ""}`}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}>
                        <div className="w-8 h-8 flex items-center justify-center">
                            <TextureRenderer id={item} />
                        </div>

                        <div className="absolute inset-0 -z-10 brightness-25 opacity-0 group-hover:opacity-100 transition-opacity">
                            <img src="/images/shine.avif" alt="Shine" />
                        </div>
                    </button>
                );
            })}

            {filteredItems.length === 0 && search.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center text-zinc-400 p-8">
                    <p className="text-sm">Start typing to search items...</p>
                </div>
            )}
        </div>
    );
}
