import React from "react";
import { TooltipContext } from "./useTooltip";

export default function TooltipContextProvider({ children }: { children: React.ReactNode }) {
    const [hoveredItem, setHoveredItem] = React.useState<string>();

    return <TooltipContext.Provider value={{ hoveredItem, setHoveredItem }}>{children}</TooltipContext.Provider>;
}
