import type { ReactNode } from "react";
import { useState } from "react";
import Portal from "@/components/ui/Portal";
import { clsx } from "@/lib/utils";
import { useFloatingBarPortal } from "./FloatingBarContext";

interface ToolbarProps {
    children: ReactNode;
}

export function Toolbar({ children }: ToolbarProps) {
    const { portalRef, state } = useFloatingBarPortal();
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
        if (state.type !== "COLLAPSED") return;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const handleMouseMove = (e: MouseEvent) => {
            const padding = 16;
            const x = Math.max(padding, Math.min(e.clientX - offsetX, window.innerWidth - 300 - padding));
            const y = Math.max(padding, Math.min(e.clientY - offsetY, window.innerHeight - 60 - padding));
            setShowSnapZone(isNearDefaultPosition({ x, y }));
            setPosition({ x, y });
        };

        const handleMouseUp = (e: MouseEvent) => {
            const padding = 16;
            const x = Math.max(padding, Math.min(e.clientX - offsetX, window.innerWidth - 300 - padding));
            const y = Math.max(padding, Math.min(e.clientY - offsetY, window.innerHeight - 60 - padding));
            setPosition(isNearDefaultPosition({ x, y }) ? null : { x, y });
            setShowSnapZone(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    if (!portalRef.current) return null;

    const isExpanded = state.type === "EXPANDED";
    const size = isExpanded ? state.size : null;

    return (
        <Portal container={portalRef.current}>
            {showSnapZone && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-999 w-[300px] h-[60px]">
                    <div className="size-full border-2 border-dashed border-zinc-400/50 bg-zinc-400/10 rounded-full animate-pulse" />
                </div>
            )}

            <div
                role="toolbar"
                data-expanded={isExpanded}
                data-size={size}
                className={clsx(
                    "dynamic-island fixed z-1000 bg-zinc-950/50 backdrop-blur-lg border border-zinc-800 shadow-2xl flex flex-col",
                    !position && "bottom-8 left-1/2 -translate-x-1/2",
                    isExpanded && "rounded-3xl p-6",
                    !isExpanded && "rounded-4xl p-2 justify-end cursor-move"
                )}
                style={position ? { left: `${position.x}px`, top: `${position.y}px`, transform: "none" } : undefined}
                onMouseDown={handleMouseDown}>
                {isExpanded ? (
                    <div className="dynamic-island-content">{state.content}</div>
                ) : (
                    <div className="flex items-center gap-4 h-full">{children}</div>
                )}
            </div>
        </Portal>
    );
}
