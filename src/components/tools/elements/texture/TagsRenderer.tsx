import type { DataDrivenRegistryElement, TagType } from "@voxelio/breeze";
import { Identifier, TagsProcessor } from "@voxelio/breeze";
import { useEffect, useState } from "react";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import LoadingSlot from "../gui/LoadingSlot";

interface TagsRendererProps {
    items: string[] | string;
    className?: string;
    intervalMs?: number;
}

/**
 * This component is used to render a tag.
 * items can be a string (Tags) or an array of strings (Items).
 */
export default function TagsRenderer({ items, className, intervalMs = 2000 }: TagsRendererProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data, isLoading, isError } = useRegistry<FetchedRegistry<TagType>>("summary", "tags/item");
    const getRegistry = useConfiguratorStore((state) => state.getRegistry);

    const isTag = typeof items === "string" && items.startsWith("#");
    const hasData = Boolean(data);
    const identifier = isTag ? Identifier.of(items, "tags/item") : null;
    const tag = isTag ? getRegistry<TagType>("tags/item") : [];
    const isCorrectTag = isTag && hasData;
    const tagRegistry: DataDrivenRegistryElement<TagType>[] = isCorrectTag && data ? Object.entries(data).map(([key, value]) => ({ identifier: Identifier.of(key, "tags/item"), data: value })) : [];
    const processedItems = isCorrectTag && identifier ? new TagsProcessor([...tag, ...tagRegistry]).getRecursiveValues(identifier.get()) : [];
    const itemsArray = isTag ? processedItems : Array.isArray(items) ? items : [items];

    useEffect(() => {
        if (itemsArray.length <= 1) return;
        const interval = setInterval(() => setCurrentIndex((prevIndex) => (prevIndex + 1) % itemsArray.length), intervalMs);
        return () => clearInterval(interval);
    }, [itemsArray.length, intervalMs]);

    if (isLoading) return <LoadingSlot />;
    if (itemsArray.length === 0 || isError || !data) {
        return (
            <div className="size-10 relative shrink-0 border-2 border-red-900 rounded-md flex items-center justify-center">
                <img src="/icons/error.svg" alt="No items" width={24} height={24} />
            </div>
        );
    }

    return (
        <TextureRenderer id={itemsArray[currentIndex]} className={`${className} ${itemsArray.length > 1 ? "animate-item-pulse" : ""}`} />
    );
}
