"use client";

import Translate from "@/components/tools/Translate";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { cn } from "@/lib/utils";
import { Identifier } from "@voxelio/breeze";
import type { BaseInteractiveComponent, TranslateTextType } from "../types/component";
import RenderGuard from "./RenderGuard";

export type ToolListOptionType = BaseInteractiveComponent & {
    title: TranslateTextType;
    description: TranslateTextType;
    image?: string;
    values: string[];
    index?: number;
};

export default function ToolListOption(props: ToolListOptionType) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolListOptionType, boolean>({ component: props });
    if (value === null) return null;

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
                                <Translate content={props.title} schema={true} />
                            </span>
                            <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                <Translate content={props.description} schema={true} />
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        {lock.isLocked && (
                            <span className="text-xs text-zinc-400 font-light w-max flex items-center">
                                <Translate content={lock.text} schema={true} />
                            </span>
                        )}
                        {value && !lock.isLocked && <img src="/icons/check.svg" alt="checkbox" className="w-6 h-6 invert" />}
                        {lock.isLocked && <img src="/icons/tools/lock.svg" alt="checkbox" className="w-6 h-6 invert" />}
                    </div>
                </div>

                {props.values.length > 0 && (
                    <>
                        <hr className="border-zinc-700 my-2" />
                        <div className="grid gap-1">
                            {props.values.slice(0, 3).map((val) => (
                                <span
                                    key={val}
                                    className="text-zinc-300 text-xs px-2 bg-zinc-700/50 py-0.5 rounded-md border border-zinc-600">
                                    {Identifier.of(val, "minecraft").toResourceName()}
                                </span>
                            ))}
                            {props.values.length > 3 && (
                                <span className="text-zinc-400 text-xs px-2 pt-1 hover:text-zinc-200 cursor-pointer transition-colors">
                                    Voir plus ({props.values.length - 3})
                                </span>
                            )}
                        </div>
                    </>
                )}

                <div className="absolute inset-0 -z-10 brightness-25" style={{ transform: `translateX(${props.index ?? 0 * 75}px)` }}>
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            </button>
        </RenderGuard>
    );
}
