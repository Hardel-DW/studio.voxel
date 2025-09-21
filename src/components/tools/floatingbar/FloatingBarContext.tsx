import { createContext, type ReactNode, useContext, useRef, useState } from "react";

type FloatingBarState =
    | { type: "COLLAPSED" }
    | { type: "EXPANDING"; content: ReactNode }
    | { type: "EXPANDED"; content: ReactNode }
    | { type: "COLLAPSING"; content: ReactNode };

interface FloatingBarContextValue {
    portalRef: React.RefObject<HTMLDivElement | null>;
    state: FloatingBarState;
    expand: (content: ReactNode) => void;
    collapse: () => void;
}

const FloatingBarContext = createContext<FloatingBarContextValue | null>(null);

export function FloatingBarProvider({ children }: { children: ReactNode }) {
    const portalRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<FloatingBarState>({ type: "COLLAPSED" });

    const expand = (content: ReactNode) => {
        if (state.type !== "COLLAPSED") return;

        setState({ type: "EXPANDING", content });

        requestAnimationFrame(() => {
            setState({ type: "EXPANDED", content });
        });
    };

    const collapse = () => {
        if (state.type !== "EXPANDED") return;

        setState(prev => ({ type: "COLLAPSING", content: prev.type === "EXPANDED" ? prev.content : null }));

        setTimeout(() => {
            setState({ type: "COLLAPSED" });
        }, 700);
    };

    return (
        <FloatingBarContext.Provider value={{
            portalRef,
            state,
            expand,
            collapse
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
        isExpanded: context.state.type === "EXPANDED" || context.state.type === "EXPANDING",
        expand: context.expand,
        collapse: context.collapse
    };
}
