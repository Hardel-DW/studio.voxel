"use client";

import TextureRenderer from "@/components/tools/texture/TextureRenderer";
import TagsRenderer from "@/components/tools/texture/TagsRenderer";
import { useTooltipStore } from "../tooltip/useTooltip";

interface SmithingTemplateProps {
    slots: Record<string, string[] | string>; // "0" -> template, "1" -> base, "2" -> addition
    result: {
        item: string;
        count?: number;
    };
}

export default function SmithingTemplate({ slots, result }: SmithingTemplateProps) {
    const setHoveredItem = useTooltipStore((state) => state.setHoveredItem);

    return (
        <div className="flex items-center justify-center gap-4 p-4 border border-zinc-700 rounded-lg bg-zinc-900/50 h-full">
            {/* Three input slots */}
            <div className="flex gap-1">
                {[0, 1, 2].map((slotIndex) => {
                    const slot = slots[slotIndex.toString()];
                    return (
                        <div
                            key={slotIndex}
                            className="border border-zinc-600 rounded bg-zinc-800/50 size-12 flex items-center justify-center"
                            onMouseEnter={() => setHoveredItem(Array.isArray(slot) ? slot[0] : slot)}
                            onMouseLeave={() => setHoveredItem(undefined)}
                        >
                            {slot && <TagsRenderer items={slot} />}
                        </div>
                    );
                })}
            </div>

            {/* Arrow */}
            <div className="size-12 flex items-center justify-center">
                <img
                    src="/images/features/gui/progress.png"
                    alt="Arrow"
                    className="object-contain size-8 pixelated"
                />
            </div>

            {/* Result slot */}
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
