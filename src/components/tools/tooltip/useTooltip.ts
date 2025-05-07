import { createContext } from "react";

type TooltipContextData = {
    hoveredItem?: string;
    setHoveredItem: (item?: string) => void;
};

export const TooltipContext = createContext<TooltipContextData>({} as TooltipContextData);
