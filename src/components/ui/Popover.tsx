import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useId, useRef } from "react";
import { create } from "zustand";
import Portal from "@/components/ui/Portal";
import { Trigger } from "@/components/ui/Trigger";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { usePopoverPosition } from "@/lib/hook/usePopoverPosition";
import { cn } from "@/lib/utils";

interface PopoverState {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

export const usePopoverStore = create<PopoverState>((set) => ({
    activeId: null,
    setActiveId: (id) => set({ activeId: id })
}));

const PopoverContext = createContext<{ id: string; triggerRef: React.RefObject<HTMLElement | null> } | null>(null);

export function Popover({
    children,
    className
}: {
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const id = useId();
    const triggerRef = useRef<HTMLElement>(null);

    return (
        <PopoverContext.Provider value={{ id, triggerRef }}>
            <div className={cn("relative inline-block", className)}>{children}</div>
        </PopoverContext.Provider>
    );
}

export function PopoverTrigger({
    children,
    className
}: {
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: () => void; className?: string }>;
    className?: string;
}) {
    const context = useContext(PopoverContext);
    if (!context) throw new Error("PopoverTrigger must be used within a Popover");

    const { activeId, setActiveId } = usePopoverStore();
    const isActive = activeId === context.id;

    return (
        <Trigger elementRef={context.triggerRef} onToggle={() => setActiveId(isActive ? null : context.id)} className={className}>
            {children}
        </Trigger>
    );
}

export function PopoverContent({
    children,
    className,
    containerRef,
    spacing,
    padding
}: {
    children: ReactNode;
    className?: string;
    containerRef?: React.RefObject<HTMLElement | null>;
    spacing?: number;
    padding?: number;
}) {
    const context = useContext(PopoverContext);
    if (!context) throw new Error("PopoverContent must be used within a Popover");
    const { activeId, setActiveId } = usePopoverStore();
    const isOpen = activeId === context.id;
    const contentRef = useRef<HTMLDivElement>(null);
    const position = usePopoverPosition({ triggerRef: context.triggerRef, contentRef, containerRef, spacing, padding, open: isOpen });
    const clickOutsideRef = useClickOutside(() => {
        if (isOpen) setActiveId(null);
    });

    if (!isOpen) return null;

    return (
        <Portal>
            <div
                ref={(node) => {
                    contentRef.current = node;
                    if (clickOutsideRef) clickOutsideRef.current = node;
                    if (node && typeof node.showPopover === "function") {
                        node.showPopover();
                    }
                }}
                popover="auto"
                style={{
                    position: "absolute",
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    width: position.width ? `${position.width}px` : undefined,
                    margin: 0,
                    inset: "unset"
                }}
                className={cn(
                    "rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-200 shadow-md outline-hidden duration-150 ease-bounce z-50",
                    className
                )}>
                {children}
            </div>
        </Portal>
    );
}
