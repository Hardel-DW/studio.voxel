import { Link, useParams } from "@tanstack/react-router";
import { CoreAction, type FlattenedLootItem, Identifier } from "@voxelio/breeze";
import LootDetailsPopover from "@/components/tools/concept/loot/LootDetailsPopover";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";

interface LootOverviewListProps {
    elementId: string;
    items: FlattenedLootItem[];
    resourceName: string;
}

export default function LootOverviewList({ elementId, items, resourceName }: LootOverviewListProps) {
    const { lang } = useParams({ from: "/$lang" });
    const handleConfigure = () => useConfiguratorStore.getState().setCurrentElementId(elementId);
    const fullIdentifier = Identifier.fromUniqueKey(elementId).toString();

    return (
        <div
            data-element-id={elementId}
            className="group flex items-center justify-between bg-zinc-950/30 hover:bg-zinc-900/60 border-b p-3 transition-colors first:border-t border-zinc-800/30">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <LootDetailsPopover items={items}>
                    <div className="flex -space-x-2 relative group/preview shrink-0 items-center h-full cursor-pointer">
                        {items.slice(0, 1).map((item, index) => (
                            <div
                                key={`${item.name}-${index}`}
                                className="transition-transform hover:scale-110 hover:z-10 flex items-center justify-center">
                                <TextureRenderer id={item.name} className="size-8 drop-shadow-md" />
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="size-8 rounded-md bg-zinc-800/50 flex items-center justify-center border border-white/5">
                                <span className="text-zinc-600 text-[10px]">0</span>
                            </div>
                        )}
                    </div>
                </LootDetailsPopover>

                <div className="flex flex-col justify-center min-w-0">
                    <h3 className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">{resourceName}</h3>
                    <p className="text-xs text-zinc-500 truncate flex items-center gap-2">
                        <span className="font-mono text-[10px] opacity-60">{fullIdentifier}</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <SimpleSwitch elementId={elementId} action={CoreAction.invertBoolean("disabled")} renderer={(el) => !el.disabled} />

                <div className="h-4 w-px bg-zinc-800/50 mx-2" />

                <Link
                    to="/$lang/studio/editor/loot_table/main"
                    params={{ lang }}
                    onClick={handleConfigure}
                    className="text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-1.5 transition-all text-center min-w-[80px]">
                    Configure
                </Link>
            </div>
        </div>
    );
}
