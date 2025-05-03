import Translate from "@/components/tools/Translate";
import Counter from "@/components/ui/Counter";
import type { ToolCounterType } from "@voxelio/breeze/core";
import type { InteractiveComponentProps } from "./InteractiveComponent";

export default function ToolCounter({ component, interactiveProps }: InteractiveComponentProps<number, ToolCounterType>) {
    const { value, lock, handleChange } = interactiveProps;

    return (
        <div className="bg-black/50 backdrop-blur-2xl border-t-2 border-l-2 border-stone-900 ring-0 cursor-pointer ring-zinc-800 relative transition-all hover:ring-1 py-6 px-2 rounded-xl">
            <div className="flex flex-col items-center justify-between gap-4 h-full px-6">
                <div className="flex items-center justify-between w-full gap-4">
                    <img src={component.image} alt="Images" className="h-16 pixelated invert" />

                    <Counter
                        value={value}
                        min={component.min}
                        max={component.max}
                        step={component.step}
                        onChange={handleChange}
                        disabled={!!component.lock}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-1">
                        <Translate content={component.title} schema={true} />
                    </h3>
                    {lock.isLocked ? (
                        <span className="text-xs text-zinc-400 font-light line-clamp-2">
                            <Translate content={lock.text} schema={true} />
                        </span>
                    ) : (
                        component.description && (
                            <p className="text-sm text-zinc-400">
                                <Translate content={component.description} schema={true} />
                            </p>
                        )
                    )}
                </div>

                {component.short && (
                    <p className="text-xs text-zinc-400 pt-4 mt-4 border-t border-zinc-700">
                        <Translate content={component.short} schema={true} />
                    </p>
                )}
            </div>
            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
