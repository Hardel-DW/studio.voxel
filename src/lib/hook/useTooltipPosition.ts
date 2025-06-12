import { type RefObject, useEffect, useState } from "react";

export function useTooltipPosition(tooltipRef: RefObject<HTMLElement | null>) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!tooltipRef.current) return;

            const positionY = e.clientY - 20;
            let positionX = e.clientX + 10;

            if (positionX + tooltipRef.current.offsetWidth > window.innerWidth - 50) {
                positionX = e.clientX - 10 - tooltipRef.current.offsetWidth;
            }

            setPosition({ x: positionX, y: positionY });
        };

        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [tooltipRef]);

    return position;
}
