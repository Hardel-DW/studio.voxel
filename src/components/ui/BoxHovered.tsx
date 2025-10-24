import React, { type ReactElement, type ReactNode, useCallback, useRef } from "react";
import { createDisclosureContext } from "@/components/ui/DisclosureContext";
import Portal from "@/components/ui/Portal";
import { useBoxPosition } from "@/lib/hook/useBoxPosition";
import { cn } from "@/lib/utils";

const { Provider: BoxHoveredProvider, useDisclosure: useBoxHovered } = createDisclosureContext<HTMLElement>();

export function BoxHovered(props: { children: ReactNode; className?: string }) {
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

export function BoxHoveredContent(props: { children: ReactNode; className?: string }) {
    const { open, setOpen, triggerRef } = useBoxHovered();
    const contentRef = useRef<HTMLDivElement>(null);
    const position = useBoxPosition({ triggerRef, contentRef, open });
    const hasValidPosition = position.top > 0 && position.left > 0;

    return (
        <Portal>
            <div
                ref={(node) => {
                    contentRef.current = node;
                    if (node) open ? node.showPopover() : node.hidePopover();
                }}
                popover="manual"
                role="tooltip"
                style={{
                    position: "absolute",
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    visibility: hasValidPosition ? "visible" : "hidden",
                    margin: 0,
                    inset: "unset"
                }}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className={cn(
                    "rounded-2xl border-t border-l border-zinc-800 bg-zinc-950 p-4 text-zinc-200 shadow-2xl shadow-zinc-950 duration-150 ease-bounce",
                    props.className
                )}>
                {props.children}
            </div>
        </Portal>
    );
}
