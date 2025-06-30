import { type RecipeProps } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import CraftingTemplate from "@/components/tools/elements/recipe/CraftingTemplate";
import ErrorPlaceholder from "@/components/tools/elements/error/Card";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SmeltingTemplate from "@/components/tools/elements/recipe/SmeltingTemplate";
import StoneCuttingTemplate from "@/components/tools/elements/recipe/StoneCuttingTemplate";
import SmithingTemplate from "@/components/tools/elements/recipe/SmithingTemplate";

export const SMELTING_TYPES = ['minecraft:smelting', 'minecraft:blasting', 'minecraft:smoking', 'minecraft:campfire_cooking'];
export const STONECUTTING_TYPES = ['minecraft:stonecutting'];
export const SMITHING_TYPES = ['minecraft:smithing_transform', 'minecraft:smithing_trim'];

export default function RecipeOverviewCard(props: {
    element: RecipeProps;
    elementId: string;
}) {
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);

    return (
        <ErrorBoundary fallback={(e) => <ErrorPlaceholder error={e} />}>

            <div
                className="bg-black/50 border-t-2 border-l-2 border-stone-900 select-none relative transition-all hover:ring-1 ring-zinc-900 rounded-xl p-4 flex flex-col">
                <div className="flex-1 flex flex-col">
                    {props.element.type.includes("crafting_") && (
                        <CraftingTemplate
                            slots={props.element.slots}
                            result={props.element.result}
                        />
                    )}
                    {SMELTING_TYPES.includes(props.element.type) && (
                        <SmeltingTemplate
                            slots={props.element.slots}
                            result={props.element.result}
                        />
                    )}
                    {STONECUTTING_TYPES.includes(props.element.type) && (
                        <StoneCuttingTemplate
                            slots={props.element.slots}
                            result={props.element.result}
                        />
                    )}
                    {SMITHING_TYPES.includes(props.element.type) && (
                        <SmithingTemplate
                            slots={props.element.slots}
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
        </ErrorBoundary>
    );
}