"use client";

import { createDisclosureContext } from "@/components/ui/DisclosureContext";
import { useBoxPosition } from "@/lib/hook/useBoxPosition";
import { usePopoverVisibility } from "@/lib/hook/usePopoverVisibility";
import { cn } from "@/lib/utils";
import { type ReactElement, type ReactNode, useCallback, useRef } from "react";
import React from "react";
import { createPortal } from "react-dom";

const { Provider: BoxHoveredProvider, useDisclosure: useBoxHovered } = createDisclosureContext<HTMLElement>();

export function BoxHovered(props: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <BoxHoveredProvider>
            <div className={cn("relative inline-block", props.className)}>{props.children}</div>
        </BoxHoveredProvider>
    );
}

export function BoxHoveredTrigger(props: {
    children: ReactElement<{
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
        ref?: React.Ref<HTMLElement>;
        className?: string;
    }>;
    className?: string;
}) {
    const { setOpen, triggerRef } = useBoxHovered();
    const { children } = props;

    const handleMouseEnter = useCallback(() => {
        children.props.onMouseEnter?.();
        setOpen(true);
    }, [children.props, setOpen]);

    const handleMouseLeave = useCallback(() => {
        children.props.onMouseLeave?.();
        setOpen(false);
    }, [children.props, setOpen]);

    return (
        <>
            {React.cloneElement(children, {
                ref: triggerRef,
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                className: cn(children.props.className, props.className)
            })}
        </>
    );
}

export function BoxHoveredContent(props: {
    children: ReactNode;
    className?: string;
}) {
    const { open, setOpen, triggerRef } = useBoxHovered();
    const contentRef = useRef<HTMLDivElement>(null);
    const { isVisible, isLeaving } = usePopoverVisibility({ open, transitionDuration: 150 });
    const position = useBoxPosition({ triggerRef, contentRef, open });
    if (!isVisible) return null;

    return createPortal(
        <div
            ref={contentRef}
            style={{
                position: "absolute",
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className={cn(
                "z-40 rounded-2xl border-t border-l border-zinc-800 bg-zinc-950 p-4 text-zinc-200 shadow-2xl shadow-zinc-950",
                "starting:translate-y-0 starting:scale-95",
                "transition-[translate,scale,opacity] duration-150 ease-bounce",
                "hidden:translate-y-0 hidden:scale-95 transition-discrete",
                isLeaving && "opacity-0 scale-95",
                props.className
            )}>
            {props.children}
        </div>,
        document.body
    );
}
