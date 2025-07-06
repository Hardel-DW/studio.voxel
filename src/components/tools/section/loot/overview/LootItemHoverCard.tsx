import { LootItem } from "@voxelio/breeze";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { ruwsc } from "@/lib/utils";

export default function LootItemHoverCard({ item }: { item: LootItem }) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded p-2 flex items-center gap-2">
            <div className="flex-shrink-0 scale-75 size-10">
                <TextureRenderer id={item.name} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">{ruwsc(item.name)}</div>
                <div className="text-xs text-zinc-400 truncate">{item.name}</div>
                {item.weight && (
                    <div className="text-xs text-zinc-500">Weight: {item.weight}</div>
                )}
            </div>
        </div>
    );
}
