import { useEffect, useState } from "react";
import TextureRenderer from "./TextureRenderer";

interface TagsRendererProps {
    items: string[];
    className?: string;
    intervalMs?: number;
}

export default function TagsRenderer({ items, className, intervalMs = 2000 }: TagsRendererProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [items.length, intervalMs]);

    if (items.length === 0) {
        return (
            <div className="h-10 w-10 relative shrink-0 border-2 border-gray-500 rounded-md flex items-center justify-center">
                <img src="/icons/error.svg" alt="No items" width={24} height={24} />
            </div>
        );
    }

    return <TextureRenderer id={items[currentIndex]} className={`${className} ${items.length > 1 ? "animate-item-pulse" : ""}`} />;
}
