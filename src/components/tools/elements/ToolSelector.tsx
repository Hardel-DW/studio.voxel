"use client";

import Translate from "@/components/tools/Translate";
import Tabs from "@/components/ui/Tabs";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import type { TranslateTextType } from "@/components/tools/Translate";
import RenderGuard from "./RenderGuard";

export type ToolSelectorType = BaseInteractiveComponent & {
    title: TranslateTextType;
    description: TranslateTextType;
    options: { label: TranslateTextType; value: string }[];
};

export default function ToolSelector(props: ToolSelectorType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolSelectorType, string>({ component: props });
    if (value === null) return null;

    const list = props.options.map((option) => ({
        label: <Translate content={option.label} />,
        value: option.value
    }));

    return (
        <RenderGuard condition={props.hide}>
            <div className="bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-800 hover:ring-1 backdrop-blur-2xl cursor-pointer relative overflow-hidden transition-all  p-6 rounded-xl">
                <div className="flex flex-col gap-4 h-full px-6">
                    <div className="flex justify-between items-center w-full gap-4">
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-white line-clamp-1">
                                    <Translate content={props.title} schema={true} />
                                </span>
                            </div>
                            {lock.isLocked ? (
                                <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                    <Translate content={lock.text} schema={true} />
                                </span>
                            ) : (
                                <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                    <Translate content={props.description} schema={true} />
                                </span>
                            )}
                        </div>

                        <Tabs tabs={list} defaultTab={value} onChange={handleChange} disabled={lock.isLocked} />
                    </div>
                </div>
                <div className="absolute inset-0 -z-10 brightness-15">
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            </div>
        </RenderGuard>
    );
}
