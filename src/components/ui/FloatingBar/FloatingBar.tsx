import { useState } from "react";
import { useFloatingBarStore } from "./FloatingBarStore";
import type { FloatingBarButton } from "./types";

function FloatingBarButtonComponent({ button }: { button: FloatingBarButton }) {
    return (
        <button
            type="button"
            onClick={button.onClick}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={button.disabled}
            title={button.tooltip}
            className="w-10 h-10 select-none user-select-none hover:bg-zinc-800/50 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
            <img src={button.icon} alt="" className="w-5 h-5 invert opacity-75 select-none user-select-none" />
        </button>
    );
}

export function FloatingBar() {
    const { content, isVisible, searchValue, setSearchValue } = useFloatingBarStore();
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [showSnapZone, setShowSnapZone] = useState(false);

    if (!isVisible || !content) {
        return null;
    }

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
        const startX = e.clientX;
        const startY = e.clientY;
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = startX - rect.left;
        const offsetY = startY - rect.top;

        const handleMouseMove = (e: MouseEvent) => {
            const padding = 16;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            x = Math.max(padding, Math.min(x, window.innerWidth - padding - rect.width));
            y = Math.max(padding, Math.min(y, window.innerHeight - padding - rect.height));

            const currentPos = { x, y };
            const nearDefault = isNearDefaultPosition(currentPos);

            setShowSnapZone(nearDefault);
            setPosition(currentPos);
        };

        const handleMouseUp = (e: MouseEvent) => {
            const padding = 16;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            x = Math.max(padding, Math.min(x, window.innerWidth - padding - rect.width));
            y = Math.max(padding, Math.min(y, window.innerHeight - padding - rect.height));

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

    const style = position
        ? {
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "none"
        }
        : {};

    return (
        <>
            {/* Zone d'aimantation */}
            {showSnapZone && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-999" style={{ width: "300px", height: "60px" }}>
                    <div className="w-full h-full border-2 border-dashed border-zinc-400/50 bg-zinc-400/10 rounded-full animate-pulse" />
                </div>
            )}

            <div
                role="toolbar"
                className={`fixed z-1000 animate-fadein cursor-move ${!position ? "bottom-8 left-1/2 transform -translate-x-1/2" : ""}`}
                style={style}
                onMouseDown={handleMouseDown}>
                <div className="bg-zinc-950/50 backdrop-blur-lg border border-zinc-800 rounded-full p-2 shadow-2xl">
                    <div className="flex items-center gap-4">
                        {content.searchConfig && (
                            <div className="flex-1 relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-400">
                                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <input
                                    type="custom"
                                    placeholder={content.searchConfig.placeholder || "Search..."}
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                        content.searchConfig?.onChange(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && content.searchConfig?.onSubmit) {
                                            content.searchConfig.onSubmit(e.currentTarget.value);
                                        }
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="min-w-64 pl-8 pr-4 py-2 select-none user-select-none bg-zinc-800/30 border border-zinc-800 rounded-full text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:bg-zinc-700/20 transition-all"
                                />
                            </div>
                        )}

                        {content.buttons && content.buttons.length > 0 && (
                            <div className="flex items-center gap-2">
                                {content.buttons.map((button) => (
                                    <FloatingBarButtonComponent key={button.id} button={button} />
                                ))}
                            </div>
                        )}

                        {content.customContent && <div className="flex items-center">{content.customContent}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}
