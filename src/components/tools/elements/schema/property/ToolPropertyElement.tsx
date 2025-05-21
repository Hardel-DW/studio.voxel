"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { useElementCondition } from "@/lib/hook/useBreezeElement";
import type { Condition } from "@voxelio/breeze";
import { Identifier } from "@voxelio/breeze/core";

interface ToolPropertyElementProps {
    name: string;
    condition: Condition;
    onChange: () => void;
}

export function ToolPropertyElement({ name, condition, onChange }: ToolPropertyElementProps) {
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);
    const isChecked = useElementCondition(condition, currentElementId, name);

    return (
        <div className="bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-800 transition-all hover:ring-1 p-6 rounded-xl relative overflow-hidden">
            <label htmlFor={name} className="flex items-center justify-between w-full">
                <div className="flex flex-col w-3/4">
                    <span className="text-white line-clamp-1">{Identifier.toDisplay(name)}</span>
                    <span className="text-xs text-zinc-400 font-light line-clamp-2">
                        <Translate content={`tools.effects.${name}`} />
                    </span>
                </div>
                <input id={name} name={name} type="checkbox" checked={!isChecked} onChange={onChange} />
            </label>
            <div className="absolute inset-0 -z-10 brightness-15">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
