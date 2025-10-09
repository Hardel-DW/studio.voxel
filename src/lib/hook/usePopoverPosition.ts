import { useCallback, useEffect, useState } from "react";

interface Position {
    top: number;
    left: number;
    width?: number;
}

interface UsePopoverPositionProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    contentRef: React.RefObject<HTMLElement | null>;
    containerRef?: React.RefObject<HTMLElement | null>;
    spacing?: number;
    padding?: number;
    open: boolean;
}

export const usePopoverPosition = ({ triggerRef, contentRef, containerRef, spacing = 8, padding = 0, open }: UsePopoverPositionProps) => {
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
        if (!triggerRef.current || !contentRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const topPosition = triggerRect.bottom + window.scrollY + spacing;
        const bottomPosition = triggerRect.top + window.scrollY - contentRect.height - spacing;
        const wouldOverflowBottom = triggerRect.bottom + contentRect.height + spacing > viewportHeight;
        const top = wouldOverflowBottom ? bottomPosition : topPosition;

        const containerRect = containerRef?.current?.getBoundingClientRect();
        const width = containerRect ? containerRect.width - padding : undefined;
        const centeredLeft = triggerRect.left + window.scrollX - (contentRect.width - triggerRect.width) / 2;
        const minLeft = window.scrollX + spacing;
        const maxLeft = window.scrollX + window.innerWidth - contentRect.width - spacing;
        const left = containerRect ? containerRect.left + window.scrollX : Math.max(minLeft, Math.min(maxLeft, centeredLeft));

        setPosition({ top, left, width });
    }, [triggerRef, contentRef, containerRef, spacing, padding]);

    useEffect(() => {
        if (open) {
            queueMicrotask(updatePosition);

            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition);

            return () => {
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition);
            };
        }
    }, [open, updatePosition]);

    return position;
};
