import { useState } from "react";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/utils";
import { useClickOutside } from "@/lib/hook/useClickOutside";

interface ItemSelectorProps {
    currentItem: string;
    onItemSelect: (itemId: string) => void;
}

const commonItems = [
    "minecraft:diamond_sword",
    "minecraft:iron_sword",
    "minecraft:netherite_sword",
    "minecraft:golden_sword",
    "minecraft:stone_sword",
    "minecraft:wooden_sword",
    "minecraft:diamond_pickaxe",
    "minecraft:iron_pickaxe",
    "minecraft:netherite_pickaxe",
    "minecraft:diamond_axe",
    "minecraft:iron_axe",
    "minecraft:netherite_axe",
    "minecraft:bow",
    "minecraft:crossbow",
    "minecraft:trident",
    "minecraft:diamond_helmet",
    "minecraft:diamond_chestplate",
    "minecraft:diamond_leggings",
    "minecraft:diamond_boots",
];

export default function ItemSelector({ currentItem, onItemSelect }: ItemSelectorProps) {
    const [selectedItem, setSelectedItem] = useState(currentItem);
    const [searchTerm, setSearchTerm] = useState("");
    const { collapse } = useDynamicIsland();
    const ref = useClickOutside(collapse);

    const filteredItems = commonItems.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleValidate = () => {
        onItemSelect(selectedItem);
        collapse();
    };

    return (
        <div className="flex flex-col h-full" ref={ref}>
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-400">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>
                <input
                    type="custom"
                    placeholder="Rechercher un item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-zinc-800/30 border border-zinc-800 rounded-full text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:bg-zinc-700/20 transition-all"
                />
            </div>

            <div className="grid grid-cols-items grid-rows-items gap-2 overflow-hidden max-h-48 mt-4 flex-1">
                {filteredItems.map((itemId) => (
                    <button
                        key={itemId}
                        type="button"
                        onClick={() => setSelectedItem(itemId)}
                        className={clsx(
                            "w-14 h-14 relative flex items-center justify-center cursor-pointer border-2 rounded transition-colors",
                            selectedItem === itemId ? "border-zinc-600 bg-white/5" : "border-zinc-800 hover:border-zinc-600"
                        )}
                    >
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