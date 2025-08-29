import { useRef, useState } from "react";

export function useInfiniteScroll<T>(items: T[], itemsPerPage = 50) {
    const [count, setCount] = useState(itemsPerPage);
    const ref = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const visibleItems = items.slice(0, count);
    const hasMore = count < items.length;

    const loadMore = () => {
        if (count >= items.length) return;
        setCount((prev) => Math.min(prev + itemsPerPage, items.length));
    };

    const initializeObserver = () => {
        if (!ref.current) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(([entry]) => entry.isIntersecting && loadMore(), { rootMargin: "100px" });

        observerRef.current.observe(ref.current);
    };

    const setRef = (element: HTMLDivElement | null) => {
        ref.current = element;
        if (element) {
            initializeObserver();
        }
    };

    return {
        setCount,
        visibleItems,
        hasMore,
        ref: setRef
    };
}
