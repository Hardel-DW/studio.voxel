import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll<T>(items: T[], itemsPerPage = 50) {
    const [count, setCount] = useState(itemsPerPage);
    const ref = useRef<HTMLDivElement>(null);
    const visibleItems = items.slice(0, count);
    const hasMore = count < items.length;

    const loadMore = () => {
        if (!hasMore) return;
        setCount((prev) => Math.min(prev + itemsPerPage, items.length));
    };

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && loadMore(), { rootMargin: "100px" });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [loadMore]);

    return {
        setCount,
        visibleItems,
        hasMore,
        ref
    };
}
