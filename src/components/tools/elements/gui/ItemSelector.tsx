import { useState } from "react";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { Button } from "@/components/ui/Button";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { clsx } from "@/lib/utils";
import { TextInput } from "@/components/ui/TextInput";

interface ItemSelectorProps {
    currentItem: string;
    onItemSelect: (itemId: string) => void;
    items?: () => string[];
}

export default function ItemSelector({ currentItem, onItemSelect, items }: ItemSelectorProps) {
    const [selectedItem, setSelectedItem] = useState(currentItem);
    const [searchTerm, setSearchTerm] = useState("");
    const { collapse } = useDynamicIsland();
    const ref = useClickOutside(collapse);

    const availableItems = items ? items() : [];
    const filteredItems = availableItems.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleValidate = () => {
        onItemSelect(selectedItem);
        collapse();
    };

    return (
        <div className="flex flex-col h-full" ref={ref}>
            <TextInput placeholder="Rechercher un item..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            <div className="grid grid-cols-items grid-rows-items gap-2 overflow-y-auto overflow-x-hidden max-h-64 mt-4 flex-1 -mr-1 pr-1">
                {filteredItems.map((itemId) => (
                    <button
                        key={itemId}
                        type="button"
                        onClick={() => setSelectedItem(itemId)}
                        className={clsx(
                            "w-14 h-14 relative flex items-center justify-center cursor-pointer border-2 rounded transition-colors",
                            selectedItem === itemId ? "border-zinc-600 bg-white/5" : "border-zinc-800 hover:border-zinc-600"
                        )}>
                        <TextureRenderer id={itemId} />
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-end mt-auto pt-4">
                <h3 className="text-xs font-medium text-zinc-400">Sélectionner un item</h3>
                <div className="flex gap-2">
                    <Button onClick={collapse} variant="ghost_border" size="sm">
                        Annuler
                    </Button>
                    <Button onClick={handleValidate} size="sm">
                        Valider
                    </Button>
                </div>
            </div>
        </div>
    );
}
