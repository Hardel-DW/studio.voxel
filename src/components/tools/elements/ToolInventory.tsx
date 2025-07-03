import useRegistry from "@/lib/hook/useRegistry";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDragAndDrop } from "@/lib/hook/useDragAndDrop";

export default function ToolInventory({ search }: { search: string }) {
    const { data: items, isLoading, isError } = useRegistry<string[]>("item", "registry");
    const { handleDragStart, handleDragEnd, draggedItem } = useDragAndDrop();

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

    if (!items) {
        return null;
    }

    return (
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gridTemplateRows: 'repeat(auto-fill, minmax(56px, 1fr))' }}>
            {items.filter((item) => item !== "air" && item.toLowerCase().includes(search.toLowerCase())).map((item) => {
                const isDragging = draggedItem === item;
                return (
                    <div
                        key={item}
                        className={`relative overflow-hidden bg-zinc-900/20 border border-zinc-800 hover:border-zinc-600 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all hover:bg-zinc-900/40 group ${isDragging ? 'opacity-50' : ''}`}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="w-8 h-8 flex items-center justify-center">
                            <TextureRenderer id={item} />
                        </div>

                        <div className="absolute inset-0 -z-10 brightness-25 opacity-0 group-hover:opacity-100 transition-opacity">
                            <img src="/images/shine.avif" alt="Shine" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}