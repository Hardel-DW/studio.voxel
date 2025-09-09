import { RecipeActionBuilder } from "@voxelio/breeze";
import TagsRenderer from "@/components/tools/elements/texture/TagsRenderer";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useDragAndDrop } from "@/lib/hook/useDragAndDrop";
import { useTooltipStore } from "@/lib/hook/useTooltip";

interface RecipeSlotProps {
    slotIndex?: string;
    item?: string[] | string;
    count?: number;
    isEmpty?: boolean;
    isResult?: boolean;
    interactive?: boolean;
}

export default function RecipeSlot({ slotIndex, item, count, isEmpty = false, isResult = false, interactive = false }: RecipeSlotProps) {
    const setHoveredItem = useTooltipStore((state) => state.setHoveredItem);
    const handleChange = useConfiguratorStore((state) => state.handleChange);

    const { handleDragOver, handleDrop, handleSlotClear } = useDragAndDrop({
        onDrop: (droppedItem, slot) => {
            if (!interactive || !slot) return;
            handleChange(new RecipeActionBuilder().addIngredient(slot).items(droppedItem).build());
        },
        onSlotClear: (slot) => {
            if (!interactive || !slot) return;
            handleChange(new RecipeActionBuilder().clearSlot(slot).build());
        }
    });

    const displayItem = Array.isArray(item) ? item[0] : item;

    return (
        <div className="relative">
            <button
                type="button"
                className="border border-zinc-600 rounded bg-zinc-800/50 size-12 flex items-center justify-center hover:border-zinc-500 transition-colors"
                onMouseEnter={() => displayItem && setHoveredItem(displayItem)}
                onMouseLeave={() => setHoveredItem(undefined)}
                onDragOver={interactive ? handleDragOver : undefined}
                onDrop={interactive && slotIndex ? (e) => handleDrop(e, slotIndex) : undefined}
                onContextMenu={interactive && slotIndex ? () => handleSlotClear(slotIndex) : undefined}>
                {!isEmpty && item && displayItem && (isResult ? <TextureRenderer id={displayItem} /> : <TagsRenderer items={item} />)}
            </button>
            {count && count > 1 && (
                <span className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-600 rounded text-xs px-1 text-zinc-300">
                    {count}
                </span>
            )}
        </div>
    );
}
