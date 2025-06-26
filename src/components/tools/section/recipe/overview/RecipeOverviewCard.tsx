import { cn } from "@/lib/utils";
import { type RecipeProps } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import CraftingTemplate from "@/components/tools/elements/recipe/CraftingTemplate";

export const CRAFTING_TYPES = ['minecraft:crafting_shaped', 'minecraft:crafting_shapeless', 'minecraft:crafting_transmute'];

export default function RecipeOverviewCard(props: {
    element: RecipeProps;
    elementId: string;
}) {
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);

    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 select-none relative transition-all hover:ring-1 ring-zinc-900 rounded-xl p-4",
                "flex flex-col"
            )}>

            <div className="flex-1 flex flex-col">
                {CRAFTING_TYPES.includes(props.element.type) && (
                    <CraftingTemplate
                        items={props.element.slots}
                        result={props.element.result}
                    />
                )}

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