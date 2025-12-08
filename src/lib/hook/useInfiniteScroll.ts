import { useRef, useState } from "react";

export function useInfiniteScroll<T>(items: T[], itemsPerPage = 50) {
    const [count, setCount] = useState(itemsPerPage);
    const ref = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const itemsLengthRef = useRef(items.length);
    itemsLengthRef.current = items.length;

    const visibleItems = items.slice(0, count);
    const hasMore = count < items.length;

    const setRef = (element: HTMLDivElement | null) => {
        ref.current = element;
        if (!element) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setCount((prev) => Math.min(prev + itemsPerPage, itemsLengthRef.current));
                }
            },
            { rootMargin: "100px" }
        );
        observerRef.current.observe(element);
    };

    return { setCount, visibleItems, hasMore, ref: setRef };
}
