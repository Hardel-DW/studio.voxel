import { createContext, type ReactNode, useContext, useRef } from "react";

interface FloatingBarContextValue {
    portalRef: React.RefObject<HTMLDivElement | null>;
}

const FloatingBarContext = createContext<FloatingBarContextValue | null>(null);

export function FloatingBarProvider({ children }: { children: ReactNode }) {
    const portalRef = useRef<HTMLDivElement>(null);

    return (
        <FloatingBarContext.Provider value={{ portalRef }}>
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
