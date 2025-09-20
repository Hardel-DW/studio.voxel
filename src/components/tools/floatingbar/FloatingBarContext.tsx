import { createContext, type ReactNode, useContext, useRef, useState } from "react";

interface DynamicIslandState {
    isExpanded: boolean;
    content: ReactNode | null;
    isAnimating: boolean;
}

interface FloatingBarContextValue {
    portalRef: React.RefObject<HTMLDivElement | null>;
    dynamicIsland: DynamicIslandState;
    expandDynamicIsland: (content: ReactNode) => void;
    collapseDynamicIsland: () => void;
}

const FloatingBarContext = createContext<FloatingBarContextValue | null>(null);

export function FloatingBarProvider({ children }: { children: ReactNode }) {
    const portalRef = useRef<HTMLDivElement>(null);
    const [dynamicIsland, setDynamicIsland] = useState<DynamicIslandState>({
        isExpanded: false,
        content: null,
        isAnimating: false
    });

    const expandDynamicIsland = (content: ReactNode) => {
        setDynamicIsland({ isExpanded: true, content, isAnimating: false });
    };

    const collapseDynamicIsland = () => {
        setDynamicIsland(prev => ({ ...prev, isExpanded: false }));
        setTimeout(() => {
            setDynamicIsland(prev => ({ ...prev, content: null }));
        }, 700);
    };

    return (
        <FloatingBarContext.Provider value={{
            portalRef,
            dynamicIsland,
            expandDynamicIsland,
            collapseDynamicIsland
        }}>
            {children}
            <div ref={portalRef} id="floating-bar-portal" />
        </FloatingBarContext.Provider>
    );
}

export function useFloatingBarPortal() {
    const context = useContext(FloatingBarContext);
    if (!context) {
        throw new Error("useFloatingBarPortal must be used within FloatingBarProvider");
    }
    return context;
}

export function useDynamicIsland() {
    const context = useContext(FloatingBarContext);
    if (!context) {
        throw new Error("useDynamicIsland must be used within FloatingBarProvider");
    }
    return {
        isExpanded: context.dynamicIsland.isExpanded,
        expand: context.expandDynamicIsland,
        collapse: context.collapseDynamicIsland
    };
}
