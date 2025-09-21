import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import ItemSelector from "./ItemSelector";

interface MinecraftSlotProps {
    id: string;
    count: number;
    onItemChange?: (itemId: string) => void;
    items?: () => string[];
}

export default function MinecraftSlot({ id, count, onItemChange, items }: MinecraftSlotProps) {
    const { expand } = useDynamicIsland();

    const handleSlotClick = () => {
        if (onItemChange) {
            expand(<ItemSelector currentItem={id} onItemSelect={onItemChange} items={items} />);
        }
    };

    return (
        <button type="button" className="slot w-16 h-16 relative flex items-center justify-center cursor-pointer" onClick={handleSlotClick}>
            {id && <TextureRenderer id={id} className="scale-125" />}
            {count > 1 && <span className="absolute bottom-0 right-0 text-xl text-white font-seven">{count}</span>}
        </button>
    );
}
