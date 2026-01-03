import { useRef } from "react";

interface UsePopoverPositionProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    spacing?: number;
}

export const usePopoverPosition = ({ triggerRef, spacing = 8 }: UsePopoverPositionProps) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const resizeObserver = useRef<ResizeObserver | null>(null);

    const applyPosition = (node: HTMLDivElement) => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = node.getBoundingClientRect();
        const container = node.parentElement;
        const containerRect = container?.tagName === "DIALOG" ? container.getBoundingClientRect() : null;

        const offsetTop = containerRect?.top ?? 0;
        const offsetLeft = containerRect?.left ?? 0;

        const topPosition = triggerRect.bottom - offsetTop + spacing;
        const bottomPosition = triggerRect.top - offsetTop - contentRect.height - spacing;
        const viewportBottom = containerRect ? containerRect.bottom : window.innerHeight;
        const wouldOverflowBottom = triggerRect.bottom + contentRect.height + spacing > viewportBottom;
        const top = wouldOverflowBottom ? bottomPosition : topPosition;

        const centeredLeft = triggerRect.left - offsetLeft - (contentRect.width - triggerRect.width) / 2;
        const minLeft = spacing;
        const viewportWidth = containerRect ? containerRect.width : window.innerWidth;
        const maxLeft = viewportWidth - contentRect.width - spacing;
        const left = Math.max(minLeft, Math.min(maxLeft, centeredLeft));

        node.style.position = containerRect ? "absolute" : "fixed";
        node.style.top = `${top}px`;
        node.style.left = `${left}px`;
    };

    const refCallback = (node: HTMLDivElement | null) => {
        if (contentRef.current && !node) {
            resizeObserver.current?.disconnect();
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleResize);
        }

        contentRef.current = node;
        if (node) {
            applyPosition(node);
            resizeObserver.current = new ResizeObserver(() => {
                if (contentRef.current) applyPosition(contentRef.current);
            });
            resizeObserver.current.observe(node);
            window.addEventListener("resize", handleResize);
            window.addEventListener("scroll", handleResize);
        }
    };

    const handleResize = () => {
        if (contentRef.current) applyPosition(contentRef.current);
    };

    return refCallback;
};
