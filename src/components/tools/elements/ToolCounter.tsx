"use client";

import Translate from "@/components/tools/Translate";
import CounterUI from "@/components/ui/Counter";
import type { BaseInteractiveComponent, TranslateTextType } from "@/components/tools/types/component";
import RenderGuard from "./RenderGuard";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";

export type ToolCounterProps = BaseInteractiveComponent & {
    title: TranslateTextType;
    short?: TranslateTextType;
    description?: TranslateTextType;
    image: string;
    min: number;
    max: number;
    step: number;
    index?: number;
};

export default function ToolCounter(props: ToolCounterProps) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolCounterProps, number>({ component: props });
    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <div className="bg-black/50 backdrop-blur-2xl border-t-2 border-l-2 border-stone-900 ring-0 cursor-pointer ring-zinc-800 relative transition-all hover:ring-1 py-6 px-2 rounded-xl">
                <div className="flex flex-col items-center justify-between gap-4 h-full px-6">
                    <div className="flex items-center justify-between w-full gap-4">
                        <img src={props.image} alt="Images" className="h-16 pixelated invert" />

                        <CounterUI
                            value={value}
                            min={props.min}
                            max={props.max}
                            step={props.step}
                            onChange={handleChange}
                            disabled={lock.isLocked || !!props.lock}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-1">
                            <Translate content={props.title} schema={true} />
                        </h3>
                        {lock.isLocked ? (
                            <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                <Translate content={lock.text} schema={true} />
                            </span>
                        ) : (
                            props.description && (
                                <p className="text-sm text-zinc-400">
                                    <Translate content={props.description} schema={true} />
                                </p>
                            )
                        )}
                    </div>

                    {props.short && (
                        <p className="text-xs text-zinc-400 pt-4 mt-4 border-t border-zinc-700">
                            <Translate content={props.short} schema={true} />
                        </p>
                    )}
                </div>
                <div className="absolute inset-0 -z-10 brightness-30">
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            </div>
        </RenderGuard>
    );
}
