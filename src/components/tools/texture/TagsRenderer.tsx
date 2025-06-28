import { useEffect, useState } from "react";
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

export default function TagsRenderer({ items, className, intervalMs = 2000 }: TagsRendererProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data, isLoading, isError } = useRegistry<TagRegistry>("tags/item");
    const { getRegistry } = useConfiguratorStore();

    // Normalize items to always be an array for easier handling
    const itemsArray = Array.isArray(items) ? items : [items];

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

    // Check if it's a tag (string starting with #)
    if (typeof items === 'string' && items.startsWith("#")) {
        const identifier = Identifier.of(items, "tags/item");
        const tag = getRegistry<TagType>("tags/item");
        const tagRegistry: DataDrivenRegistryElement<TagType>[] = Object.entries(data).map(([key, value]) => ({
            identifier: Identifier.of(key, "tags/item"),
            data: value
        }));

        const comparator = new TagsComparator([...tag, ...tagRegistry]);
        const result = comparator.getRecursiveValues(identifier.get());
        console.log(result);

        return <TextureRenderer id={result[currentIndex]} className={`${className} ${result.length > 1 ? "animate-item-pulse" : ""}`} />;
    }

    // Handle items array
    return <TextureRenderer id={itemsArray[currentIndex]} className={`${className} ${itemsArray.length > 1 ? "animate-item-pulse" : ""}`} />;
}
