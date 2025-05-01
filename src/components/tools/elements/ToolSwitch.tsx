import type { ToolSwitchType } from "@voxelio/breeze/core";
import type { InteractiveComponentProps } from "./InteractiveComponent";
import Translate from "@/components/tools/Translate";

export default function ToolSwitch({
    component,
    interactiveProps,
    index = 0
}: InteractiveComponentProps<boolean, ToolSwitchType> & { index?: number }) {
    const { value, lock, handleChange } = interactiveProps;
    return (
        <div className="bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-800 transition-all hover:ring-1 p-6 rounded-xl relative overflow-hidden">
            <label className="flex items-center justify-between w-full">
                <div className="flex flex-col w-3/4">
                    <span className="text-white line-clamp-1">
                        <Translate content={component.title} schema={true} />
                    </span>
                    <span className="text-xs text-zinc-400 font-light line-clamp-2">
                        {lock.isLocked ? (
                            <span className="text-xs text-zinc-400 font-light w-max">
                                <Translate content={lock.text} schema={true} />
                            </span>
                        ) : (
                            <Translate content={component.description} schema={true} />
                        )}
                    </span>
                </div>
                <div className="flex gap-4">
                    <input
                        type="checkbox"
                        disabled={lock.isLocked}
                        checked={value || lock.isLocked}
                        onChange={(e) => handleChange(e.target.checked)}
                    />
                </div>
            </label>
            <div className="absolute inset-0 -z-10 brightness-25" style={{ transform: `translateX(${index * 75}px)` }}>
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
