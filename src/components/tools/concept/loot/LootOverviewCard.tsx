import { Link, useParams } from "@tanstack/react-router";
import type { FlattenedLootItem } from "@voxelio/breeze";
import { CoreAction, Identifier } from "@voxelio/breeze";
import LootDetailsPopover from "@/components/tools/concept/loot/LootDetailsPopover";
import LootOverviewList from "@/components/tools/concept/loot/LootOverviewList";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";

interface LootOverviewCardProps {
    elementId: string;
    items: FlattenedLootItem[];
    mode?: string;
}

export default function LootOverviewCard({ elementId, items, mode }: LootOverviewCardProps) {
    const { lang } = useParams({ from: "/$lang" });
    const resourceName = Identifier.fromUniqueKey(elementId).toResourceName();

    const handleConfigure = () => useConfiguratorStore.getState().setCurrentElementId(elementId);

    if (mode === "list") {
        return <LootOverviewList elementId={elementId} items={items} resourceName={resourceName} />;
    }

    return (
        <div
            data-element-id={elementId}
            className="overview-card bg-zinc-950/70 border border-zinc-900 select-none relative rounded-xl p-4 flex flex-col transition-transform duration-150 ease-out hover:-translate-y-0.5 isolate">
            <div className="absolute inset-0 -z-10 brightness-10">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>

            <div className="flex items-center justify-between pb-3">
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{resourceName}</h3>
                    <p className="text-[10px] tracking-wider minecraft-font text-zinc-400">{items.length} items</p>
                </div>

                <SimpleSwitch elementId={elementId} action={CoreAction.invertBoolean("disabled")} renderer={(el) => !el.disabled} />
            </div>

            <div className="pb-4">
                <div className="relative w-full flex justify-between items-center cursor-pointer">
                    <div className="flex -space-x-3">
                        {items.slice(0, 5).map((item, index) => (
                            <TextureRenderer key={`${item.name}-${index}`} id={item.name} className="size-10 scale-75 drop-shadow-sm" />
                        ))}
                    </div>
                    <LootDetailsPopover items={items}>
                        <button
                            type="button"
                            className="text-xs bg-zinc-900/60 border border-zinc-800 px-2 py-2 rounded-lg cursor-pointer hover:bg-zinc-800/60 transition-colors">
                            See Details
                        </button>
                    </LootDetailsPopover>
                </div>
            </div>

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
