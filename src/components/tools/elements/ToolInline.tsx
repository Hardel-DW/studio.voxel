import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { TranslateTextType } from "@/components/tools/Translate";
import Translate from "@/components/tools/Translate";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { cn } from "@/lib/utils";

export type ToolInlineType = BaseInteractiveComponent & {
    title: TranslateTextType;
    description: TranslateTextType;
    image?: string;
};

export default function ToolInline(props: ToolInlineType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolInlineType, boolean>({ component: props });
    if (value === null) return null;
    const index = props.index ?? 0;

    return (
        <RenderGuard condition={props.hide}>
            <button
                type="button"
                className={cn(
                    "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 px-6 py-4 rounded-xl cursor-pointer relative overflow-hidden w-full text-left",
                    { "bg-black/25 ring-1 ring-zinc-600": value },
                    { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
                )}
                onClick={() => handleChange(!value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleChange(!value);
                }}
                disabled={lock.isLocked}>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        {props.image && (
                            <div className="shrink-0">
                                <img src={props.image} alt="" className="w-8 h-8 object-contain pixelated" />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-white line-clamp-1">
                                <Translate content={props.title} />
                            </span>
                            <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                <Translate content={props.description} />
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        {lock.isLocked && (
                            <span className="text-xs text-zinc-400 font-light w-max flex items-center">
                                <Translate content={lock.text} />
                            </span>
                        )}
                        {value && !lock.isLocked && <img src="/icons/check.svg" alt="checkbox" className="w-6 h-6 invert" />}
                        {lock.isLocked && <img src="/icons/tools/lock.svg" alt="checkbox" className="w-6 h-6 invert" />}
                    </div>
                </div>
                <div className="absolute inset-0 -z-10 brightness-25" style={{ transform: `translateX(${index * 75}px)` }}>
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            </button>
        </RenderGuard>
    );
}
