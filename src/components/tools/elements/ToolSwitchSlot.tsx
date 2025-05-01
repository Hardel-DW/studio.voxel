import { cn } from "@/lib/utils";
import type { ToolSwitchSlotType } from "@voxelio/breeze/core";
import type { InteractiveComponentProps } from "./InteractiveComponent";
import Translate from "../Translate";

export default function ToolSwitchSlot({
    component,
    interactiveProps,
    index = 0
}: InteractiveComponentProps<boolean, ToolSwitchSlotType> & { index?: number }) {
    const { value, lock, handleChange } = interactiveProps;
    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 px-6 py-4 rounded-xl cursor-pointer relative  overflow-hidden",
                { "bg-black/25 ring-1 ring-zinc-600": value },
                { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
            )}
            onClick={() => handleChange(!value)}
            onKeyDown={() => handleChange(!value)}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    {component.image && (
                        <div className="shrink-0">
                            <img src={component.image} alt="" className="w-8 h-8 object-contain pixelated" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-white line-clamp-1">
                            <Translate content={component.title} schema={true} />
                        </span>
                        <span className="text-xs text-zinc-400 font-light line-clamp-2">
                            <Translate content={component.description} schema={true} />
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {lock.isLocked && (
                        <span className="text-xs text-zinc-400 font-light w-max flex items-center">
                            <Translate content={lock.text} schema={true} />
                        </span>
                    )}
                    {value && <img src="/icons/check.svg" alt="checkbox" className="w-6 h-6 invert" />}
                    {lock.isLocked && <img src="/icons/tools/lock.svg" alt="checkbox" className="w-6 h-6 invert" />}
                </div>
            </div>
            <div className="absolute inset-0 -z-10 brightness-25" style={{ transform: `translateX(${index * 75}px)` }}>
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
