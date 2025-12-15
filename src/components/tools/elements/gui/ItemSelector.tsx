import { useState } from "react";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { clsx } from "@/lib/utils";

interface ItemSelectorProps {
    currentItem: string;
    onItemSelect?: (itemId: string) => void;
    items?: string[];
}

export default function ItemSelector({ currentItem, onItemSelect, items }: ItemSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const { collapse } = useDynamicIsland();
    const ref = useClickOutside(collapse);
    const filteredItems = items?.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleValidate = (itemId: string) => onItemSelect?.(itemId);

    return (
        <div className="flex flex-col h-full" ref={ref}>
            <TextInput placeholder="Rechercher un item..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            <div className="grid grid-cols-items gap-2 mt-4 flex-1 overflow-y-auto -mr-1 pr-1 content-start">
                {filteredItems?.map((itemId) => (
                    <button
                        key={itemId}
                        type="button"
                        onClick={() => handleValidate(itemId)}
                        className={clsx(
                            "size-14 relative flex items-center justify-center cursor-pointer border-2 rounded transition-colors",
                            currentItem === itemId ? "border-zinc-600 bg-white/5" : "border-zinc-800 hover:border-zinc-600"
                        )}>
                        <TextureRenderer id={itemId} />
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-end mt-auto pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-medium text-zinc-400">Sélectionner un item</h3>
                <Button onClick={collapse} variant="ghost_border" size="sm">
                    Annuler
                </Button>
            </div>
        </div>
    );
}
