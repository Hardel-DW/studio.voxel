"use client";

import Translate from "@/components/tools/Translate";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import type { TranslateTextType } from "@/components/tools/Translate";
import RenderGuard from "./RenderGuard";

export type ToolSwitchType = BaseInteractiveComponent & {
    title: TranslateTextType;
    description: TranslateTextType;
};

export default function ToolSwitch(props: ToolSwitchType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolSwitchType, boolean>({ component: props });
    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <div className="bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-800 transition-all hover:ring-1 p-6 rounded-xl relative overflow-hidden">
                <label className="flex items-center justify-between w-full cursor-pointer">
                    <div className="flex flex-col w-3/4">
                        <span className="text-white line-clamp-1">
                            <Translate content={props.title} schema={true} />
                        </span>
                        <span className="text-xs text-zinc-400 font-light line-clamp-2">
                            {lock.isLocked ? (
                                <span className="text-xs text-zinc-400 font-light w-max">
                                    <Translate content={lock.text} schema={true} />
                                </span>
                            ) : (
                                <Translate content={props.description} schema={true} />
                            )}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <input type="checkbox" disabled={lock.isLocked} checked={value} onChange={(e) => handleChange(e.target.checked)} />
                    </div>
                </label>
                <div className="absolute inset-0 -z-10 brightness-25" style={{ transform: `translateX(${props.index ?? 0 * 75}px)` }}>
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            </div>
        </RenderGuard>
    );
}
