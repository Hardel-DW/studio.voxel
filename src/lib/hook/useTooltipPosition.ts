import { type RefObject, useEffect, useState } from "react";
import { throttle } from "../utils";

interface Position {
    x: number;
    y: number;
}

const MOUSE_OFFSET = 10;

export function useTooltipPosition(ref: RefObject<HTMLElement | null>): Position {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

    const updatePosition = (e: MouseEvent) => {
        if (!ref.current) return;

        const { innerWidth, innerHeight } = window;
        const tooltipRect = ref.current.getBoundingClientRect();

        let x = e.clientX + MOUSE_OFFSET;
        let y = e.clientY + MOUSE_OFFSET;

        // Éviter que le tooltip sorte de l'écran
        if (x + tooltipRect.width > innerWidth) {
            x = e.clientX - tooltipRect.width - MOUSE_OFFSET;
        }
        if (y + tooltipRect.height > innerHeight) {
            y = e.clientY - tooltipRect.height - MOUSE_OFFSET;
        }

        setPosition({ x, y });
    };

    // Throttle les updates de position
    const throttledUpdate = throttle(updatePosition, 16); // ~60fps

    useEffect(() => {
        document.addEventListener("mousemove", throttledUpdate, { passive: true });
        return () => document.removeEventListener("mousemove", throttledUpdate);
    }, [throttledUpdate]);

    return position;
}
