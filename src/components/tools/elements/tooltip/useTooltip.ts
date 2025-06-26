"use client";

import { createContext } from "react";

type TooltipContextData = {
    hoveredItem?: string;
    setHoveredItem: (item?: string) => void;
    clearHoveredItem: () => void;
};

export const TooltipContext = createContext<TooltipContextData>({} as TooltipContextData);
