import TextureRenderer from "@/components/tools/texture/TextureRenderer";
import { BoxHovered, BoxHoveredContent, BoxHoveredTrigger } from "@/components/ui/BoxHovered";
import { cn, ruwsc } from "@/lib/utils";
import { RECIPES } from "@/components/tools/section/recipe/overview/Overview";

export default function CraftHeaderBar(props: {
    recipeType: string;
    setRecipeType: (recipeType: string) => void;
    recipeCounts: { [key: string]: number };
}) {
    return (
        <BoxHovered>
            <BoxHoveredTrigger>
                <div className="border-2 bg-zinc-950 border-zinc-800 rounded-lg flex items-center justify-center size-16 relative">
                    <TextureRenderer id={props.recipeType} />
                    {props.recipeCounts[props.recipeType] > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-600 rounded text-xs px-1 text-zinc-300">
                            {props.recipeCounts[props.recipeType]}
                        </span>
                    )}
                </div>
            </BoxHoveredTrigger>
            <BoxHoveredContent className="relative -translate-y-2 -translate-x-2 w-[300x]">
                <div className="absolute inset-0 z-0 hue-rotate-45 starting:opacity-0 transition-all duration-500 brightness-20">
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
                <div className="absolute inset-0 z-0 hue-rotate-45 rotate-180 starting:opacity-0 transition-all duration-500 brightness-10">
                    <img src="/images/shine.avif" alt="Shine" />
                </div>

                <div className="flex flex-col gap-2 relative z-20">
                    <div className="flex items-center justify-between gap-16">
                        <div className="grid">
                            <p className="text-lg font-bold">Select Recipe</p>
                            <span className="text-xs text-zinc-400">{ruwsc(props.recipeType.replace("minecraft:", ""))}</span>
                        </div>
                        <TextureRenderer id={props.recipeType} />
                    </div>
                    <hr />
                    <div className="grid grid-cols-3 gap-2">
                        {RECIPES.map((recipe) => {
                            const count = props.recipeCounts[recipe.id] || 0;
                            const isDisabled = count === 0;

                            return (
                                <div
                                    onClick={() => !isDisabled && props.setRecipeType(recipe.id)}
                                    key={recipe.id}
                                    className={cn(
                                        "border-2 bg-zinc-950 border-zinc-900 rounded-lg flex items-center justify-center size-16 transition-colors relative",
                                        !isDisabled && "hover:border-zinc-800 hover:bg-zinc-900 cursor-pointer",
                                        isDisabled && "opacity-50 cursor-not-allowed",
                                        props.recipeType === recipe.id && "border-zinc-800 bg-zinc-900"
                                    )}>
                                    <TextureRenderer id={recipe.id} />
                                    {count > 0 && (
                                        <span className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-600 rounded text-xs px-1 text-zinc-300">
                                            {count}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </BoxHoveredContent>
        </BoxHovered>
    );
}
