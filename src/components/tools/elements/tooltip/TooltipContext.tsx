"use client";

import React, { useRef } from "react";
import { TooltipContext } from "./useTooltip";

export default function TooltipContextProvider({ children }: { children: React.ReactNode }) {
    const [hoveredItem, setHoveredItemState] = React.useState<string>();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setHoveredItem = (item?: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (item) return setHoveredItemState(item);
        timeoutRef.current = setTimeout(() => setHoveredItemState(undefined), 50);
    };

    const clearHoveredItem = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHoveredItemState(undefined);
    };

    return (
        <TooltipContext.Provider value={{ hoveredItem, setHoveredItem, clearHoveredItem }}>
            {children}
        </TooltipContext.Provider>
    );
}
