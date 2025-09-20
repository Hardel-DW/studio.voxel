import type { ReactNode } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useFloatingBarPortal } from "./FloatingBarContext";
import { clsx } from "@/lib/utils";

interface ToolbarProps {
    children: ReactNode;
}

export function Toolbar({ children }: ToolbarProps) {
    const { portalRef, dynamicIsland } = useFloatingBarPortal();
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [showSnapZone, setShowSnapZone] = useState(false);

    const getDefaultPosition = () => ({
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight - 80
    });

    const isNearDefaultPosition = (pos: { x: number; y: number }) => {
        const defaultPos = getDefaultPosition();
        const distance = Math.sqrt((pos.x - defaultPos.x) ** 2 + (pos.y - defaultPos.y) ** 2);
        return distance < 100;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (dynamicIsland.isExpanded || dynamicIsland.isAnimating) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = startX - rect.left;
        const offsetY = startY - rect.top;


        const handleMouseMove = (e: MouseEvent) => {
            const padding = 16;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.max(padding, Math.min(x, window.innerWidth - 300 - padding));
            y = Math.max(padding, Math.min(y, window.innerHeight - 60 - padding));
            const currentPos = { x, y };
            const nearDefault = isNearDefaultPosition(currentPos);
            setShowSnapZone(nearDefault);
            setPosition(currentPos);
        };

        const handleMouseUp = (e: MouseEvent) => {
            const padding = 16;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.max(padding, Math.min(x, window.innerWidth - 300 - padding));
            y = Math.max(padding, Math.min(y, window.innerHeight - 60 - padding));

            const finalPos = { x, y };
            if (isNearDefaultPosition(finalPos)) {
                setPosition(null);
            } else {
                setPosition(finalPos);
            }

            setShowSnapZone(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    if (!portalRef.current) return null;

    return createPortal(
        <>
            {showSnapZone && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-999" style={{ width: "300px", height: "60px" }}>
                    <div className="w-full h-full border-2 border-dashed border-zinc-400/50 bg-zinc-400/10 rounded-full animate-pulse" />
                </div>
            )}

            <div
                role="toolbar"
                className={clsx(
                    "fixed z-1000 transition-[width,height,opacity,border-radius,padding] duration-700 ease-[cubic-bezier(0.15,1.25,0.65,1)] bg-zinc-950/50 backdrop-blur-lg border border-zinc-800 shadow-2xl flex flex-col",
                    !position && "bottom-8 left-1/2 -translate-x-1/2",
                    dynamicIsland.isExpanded ? "w-[30vw] h-[35vh] rounded-3xl cursor-default p-6" : "w-fit h-15 rounded-4xl cursor-move p-2 justify-end",
                    dynamicIsland.isAnimating ? "opacity-75" : "opacity-100"
                )}
                style={position ? { left: `${position.x}px`, top: `${position.y}px`, transform: "none" } : {}}
                onMouseDown={handleMouseDown}>
                {dynamicIsland.isExpanded ? (
                    <div className="w-full h-full">
                        {dynamicIsland.content}
                    </div>
                ) : (
                    <div className="flex items-center gap-4 h-full">{children}</div>
                )}
            </div>
        </>,
        portalRef.current
    );
}
