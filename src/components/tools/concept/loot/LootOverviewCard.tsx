import { Link, useParams } from "@tanstack/react-router";
import type { LootTableProps } from "@voxelio/breeze";
import { CoreAction, Identifier } from "@voxelio/breeze";
import LootDetailsPopover, { getRollsInfo } from "@/components/tools/concept/loot/LootDetailsPopover";
import LootOverviewList from "@/components/tools/concept/loot/LootOverviewList";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useFlattenedLootItems } from "@/lib/hook/useFlattenedLootItems";

export default function LootOverviewCard(props: { element: LootTableProps; elementId: string; mode?: "grid" | "list" }) {
    const { lang } = useParams({ from: "/$lang" });
    const { items } = useFlattenedLootItems(props.element);
    const itemsCount = items.length;

    const handleConfigure = () => useConfiguratorStore.getState().setCurrentElementId(props.elementId);

    if (props.mode === "list") {
        return <LootOverviewList element={props.element} elementId={props.elementId} />;
    }

    return (
        <div
            data-element-id={props.elementId}
            className="overview-card bg-zinc-950/70 border border-zinc-900 select-none relative rounded-xl p-4 shadow-sm flex flex-col outline-hidden transition-[box-shadow,transform] duration-150 ease-out hover:shadow-lg hover:-translate-y-0.5">
            {/* Première ligne : Titre/Badge/Switch */}
            <div className="flex items-center justify-between pb-3">
                <div className="flex flex-col gap-1 justify-center flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{new Identifier(props.element.identifier).toResourceName()}</h3>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                            <div className="flex items-center gap-1">
                                <span className="text-xs">🎲</span>
                                <span className="text-xs tracking-wider text-zinc-400 font-medium">{getRollsInfo(props.element)}</span>
                            </div>
                        </div>

                        {/* Badge Items */}
                        <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                            <div className="flex items-center gap-1">
                                <span className="text-xs">📦</span>
                                <span className="text-xs tracking-wider text-zinc-400 font-medium">{itemsCount} items</span>
                            </div>
                        </div>
                    </div>
                </div>

                <SimpleSwitch elementId={props.elementId} action={CoreAction.invertBoolean("disabled")} renderer={(el) => !el.disabled} />
            </div>

            {/* Deuxième ligne : Items empilés */}
            <div className="pb-4">
                <div className="relative w-full flex justify-between items-center cursor-pointer">
                    <div className="flex -space-x-3">
                        {items.slice(0, 5).map((item, index) => (
                            <TextureRenderer key={`${item.name}-${index}`} id={item.name} className="size-10 scale-75 drop-shadow-sm" />
                        ))}
                    </div>
                    <LootDetailsPopover
                        element={props.element}
                        trigger={
                            <span className="text-xs bg-zinc-900/60 border border-zinc-800 px-2 py-2 rounded-lg cursor-pointer hover:bg-zinc-800/60 transition-colors">
                                {itemsCount > 5 ? `+${itemsCount - 5} more` : "See Details"}
                            </span>
                        }
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                <Link
                    to="/$lang/studio/editor/loot_table/main"
                    params={{ lang }}
                    onClick={handleConfigure}
                    className="w-full cursor-pointer bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/40 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-[background-color] duration-150 block text-center">
                    Configure
                </Link>
            </div>
        </div>
    );
}
