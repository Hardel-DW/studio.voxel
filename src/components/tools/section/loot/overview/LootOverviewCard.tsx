import { cn } from "@/lib/utils";
import { Actions, Identifier } from "@voxelio/breeze";
import type { LootTableProps } from "@voxelio/breeze/schema";
import ItemRenderer from "@/components/tools/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";

export default function LootOverviewCard(props: {
    element: LootTableProps;
    elementId: string;
}) {
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);

    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 select-none relative transition-all hover:ring-1 ring-zinc-900 rounded-xl p-4",
                "flex flex-col"
            )}>
            {/* Header avec switch */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {props.element.items.length === 0 ? (
                        <div className="w-6 h-6 bg-stone-900 rounded-full animate-pulse flex-shrink-0" />
                    ) : (
                        <div className="flex-shrink-0">
                            <ItemRenderer id={props.element.items[0].name} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1 justify-center">
                        <h3 className="text-sm font-semibold truncate">{new Identifier(props.element.identifier).toResourceName()}</h3>
                        <div className="flex items-center">
                            <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                                <div className="flex items-center gap-1">
                                    <img src="/icons/tools/maxLevel.svg" alt="Max Level" className="invert-70 w-3 h-3" />
                                    <span className="text-xs tracking-wider text-zinc-400 font-medium">
                                        Test {props.element.items.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SimpleSwitch
                    elementId={props.elementId}
                    action={new Actions()
                        .alternative((el) => el.mode === "soft_delete")
                        .ifTrue(new Actions().setValue("mode", "normal").build())
                        .ifFalse(new Actions().setValue("mode", "soft_delete").build())
                        .build()}
                    renderer={(el) => el.mode === "normal"}
                />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                    <button
                        onClick={() => setCurrentElementId(props.elementId)}
                        onKeyDown={() => setCurrentElementId(props.elementId)}
                        type="button"
                        className="w-full cursor-pointer bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors">
                        Configure
                    </button>
                </div>
            </div>

            {/* Background shine */}
            <div className="absolute inset-0 -z-10 brightness-30 rounded-xl overflow-hidden">
                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}
