import { useEffect, useState, useMemo } from "react";
import TextureRenderer from "./TextureRenderer";
import useRegistry from "@/lib/hook/useRegistry";
import { DataDrivenRegistryElement, Identifier, isTag, TagRegistry, TagsComparator, TagType } from "@voxelio/breeze";
import Loader from "@/components/ui/Loader";
import ErrorPlaceholder from "../elements/error/Card";
import { useConfiguratorStore } from "../Store";

interface TagsRendererProps {
    items: string[] | string;
    className?: string;
    intervalMs?: number;
}

/**
 * This component is used to render a tag.
 * items can be a string (Tags) or an array of strings (Items).
 * 
 * For Tags, we get vanilla tags with useRegistry, and we get the datapack tags with getRegistry.
 * We then use the TagsComparator to flatten and get only list of items.
 */
export default function TagsRenderer({ items, className, intervalMs = 2000 }: TagsRendererProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data, isLoading, isError } = useRegistry<TagRegistry>("tags/item");
    const { getRegistry } = useConfiguratorStore();

    const itemsArray = useMemo(() => {
        if (typeof items === "string" && items.startsWith("#")) {
            if (!data) return [];

            const identifier = Identifier.of(items, "tags/item");
            const tag = getRegistry<TagType>("tags/item");
            const tagRegistry: DataDrivenRegistryElement<TagType>[] = Object.entries(data).map(([key, value]) => ({
                identifier: Identifier.of(key, "tags/item"),
                data: value
            }));

            return new TagsComparator([...tag, ...tagRegistry]).getRecursiveValues(identifier.get());
        }

        return Array.isArray(items) ? items : [items];
    }, [items, data, getRegistry]);

    useEffect(() => {
        if (itemsArray.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % itemsArray.length);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [itemsArray.length, intervalMs]);

    if (isLoading) return <Loader />;
    if (isError || !data) return <ErrorPlaceholder />;

    if (itemsArray.length === 0) {
        return (
            <div className="h-10 w-10 relative shrink-0 border-2 border-gray-500 rounded-md flex items-center justify-center">
                <img src="/icons/error.svg" alt="No items" width={24} height={24} />
            </div>
        );
    }

    return <TextureRenderer id={itemsArray[currentIndex]} className={`${className} ${itemsArray.length > 1 ? "animate-item-pulse" : ""}`} />;
}
