"use client";

import TextureRenderer from "@/components/tools/texture/TextureRenderer";
import TagsRenderer from "@/components/tools/texture/TagsRenderer";
import { useTooltipStore } from "../tooltip/useTooltip";

// Items ARE ALWAYS an array. And Tags ARE ALWAYS a string. A tags can't be in an array. !!!
interface CraftingTemplateProps {
    slots: Record<string, string[] | string>; // "0" -> ["minecraft:diamond"], "1" -> "#minecraft:logs"
    result: {
        item: string;
        count?: number;
    };
}

export default function CraftingTemplate({ slots, result }: CraftingTemplateProps) {
    const setHoveredItem = useTooltipStore((state) => state.setHoveredItem);

    return (
        <div className="flex items-center justify-center gap-4 p-4 border border-zinc-700 rounded-lg bg-zinc-900/50 h-full">
            <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }, (_, index) => {
                    const item = slots[index.toString()];
                    return (
                        <div
                            key={index}
                            className="border border-zinc-600 rounded bg-zinc-800/50 size-12 flex items-center justify-center"
                            onMouseEnter={() => setHoveredItem(Array.isArray(item) ? item[0] : item)}
                            onMouseLeave={() => setHoveredItem(undefined)}
                        >
                            {item && item.length > 0 && <TagsRenderer items={item} />}
                        </div>
                    );
                })}
            </div>

            {/* Flèche */}
            <div className="size-12 flex items-center justify-center">
                <img
                    src="/images/features/gui/progress.png"
                    alt="Arrow"
                    className="object-contain size-8 pixelated"
                />
            </div>

            {/* Slot résultat */}
            <div className="relative">
                <div className="border border-zinc-600 rounded  bg-zinc-800/50 size-12 flex items-center justify-center"
                    onMouseEnter={() => setHoveredItem(result.item)}
                    onMouseLeave={() => setHoveredItem(undefined)}
                >
                    <TextureRenderer id={result.item} />
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
