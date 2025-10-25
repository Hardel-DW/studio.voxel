import { type FlattenedLootItem, Identifier } from "@voxelio/breeze";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";

export default function LootItemHoverCard({ item }: { item: FlattenedLootItem }) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded p-2 flex items-center gap-2">
            <div className="shrink-0 scale-75 size-10">
                <TextureRenderer id={item.name} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">{Identifier.of(item.name, "not_a_registry").toResourceName()}</div>
                <div className="text-xs text-zinc-400 truncate">{item.name}</div>
                {item.weight && <div className="text-xs text-zinc-500">Weight: {item.weight.toFixed(2)}</div>}
                {item.path.length > 1 && <div className="text-[10px] text-zinc-500 truncate">{item.path.join(" → ")}</div>}
                {item.unresolved && <div className="text-xs text-amber-400">Unresolved reference</div>}
                {item.cycle && <div className="text-xs text-red-400">Cyclic reference</div>}
            </div>
        </div>
    );
}
