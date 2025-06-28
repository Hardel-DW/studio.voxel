"use client";

import TextureRenderer from "@/components/tools/texture/TextureRenderer";
import TagsRenderer from "@/components/tools/texture/TagsRenderer";
import { useContext } from "react";
import { TooltipContext } from "../tooltip/useTooltip";

interface SmeltingTemplateProps {
    slots: Record<string, string[] | string>; // "0" -> ["minecraft:diamond"] or "#minecraft:logs"
    result: {
        item: string;
        count?: number;
    };
}

export default function SmeltingTemplate({ slots, result }: SmeltingTemplateProps) {
    const { setHoveredItem } = useContext(TooltipContext);
    const inputSlot = slots["0"];

    return (
        <div className="flex items-center justify-center gap-4 p-4 border border-zinc-700 rounded-lg bg-zinc-900/50 h-full">
            <div className="flex flex-col gap-1">
                <div
                    className="border border-zinc-600 rounded bg-zinc-800/50 size-12 flex items-center justify-center"
                    onMouseEnter={() => setHoveredItem(Array.isArray(inputSlot) ? inputSlot[0] : inputSlot)}
                    onMouseLeave={() => setHoveredItem(undefined)}
                >
                    {inputSlot && <TagsRenderer items={inputSlot} />}
                </div>
                <div className="size-12 flex items-center justify-center">
                    <img
                        src="/images/features/gui/burn_progres.png"
                        alt="Flame"
                        className="object-contain size-8 pixelated"
                    />
                </div>
                <div className="border border-zinc-600 rounded bg-zinc-800/50 size-12 flex items-center justify-center" />
            </div>

            <div className="size-12 flex items-center justify-center">
                <img
                    src="/images/features/gui/progress.png"
                    alt="Arrow"
                    className="object-contain size-8 pixelated"
                />
            </div>

            <div className="relative">
                <div
                    className="border border-zinc-600 rounded bg-zinc-800/50 size-12 flex items-center justify-center"
                    onMouseEnter={() => setHoveredItem(result.item)}
                    onMouseLeave={() => setHoveredItem(undefined)}
                >
                    {result.item && <TextureRenderer id={result.item} />}
                </div>
                {result.count && result.count > 1 && (
                    <span className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-600 rounded text-xs px-1 text-zinc-300">
                        {result.count}
                    </span>
                )}
            </div>
        </div>
    );
} 