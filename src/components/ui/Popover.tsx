"use client";

import { useClickOutside } from "@/lib/hook/useClickOutside";
import { usePopoverPosition } from "@/lib/hook/usePopoverPosition";
import { usePopoverVisibility } from "@/lib/hook/usePopoverVisibility";
import { cn } from "@/lib/utils";
import type { ReactElement, ReactNode } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { createDisclosureContext } from "./DisclosureContext";
import { Trigger } from "./Trigger";

const { Provider: PopoverProvider, useDisclosure: usePopover } = createDisclosureContext<HTMLButtonElement>();

export function Popover(props: {
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
}) {
    return (
        <PopoverProvider defaultOpen={props.defaultOpen}>
            <div className={cn("relative inline-block", props.className)}>{props.children}</div>
        </PopoverProvider>
    );
}

export function PopoverTrigger(props: {
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: (e: React.MouseEvent) => void; className?: string }>;
    className?: string;
}) {
    const { setOpen, triggerRef } = usePopover();
    return (
        <Trigger elementRef={triggerRef} onToggle={() => setOpen((prev) => !prev)} className={props.className}>
            {props.children}
        </Trigger>
    );
}

export function PopoverContent(props: {
    children: ReactNode;
    className?: string;
}) {
    const { open, setOpen, triggerRef } = usePopover();
    const contentRef = useRef<HTMLDivElement>(null);
    const { isVisible } = usePopoverVisibility({ open, transitionDuration: 150 });
    const position = usePopoverPosition({ triggerRef, contentRef, open });
    const clickOutsideRef = useClickOutside(() => setOpen(false));
    if (!isVisible && !open) return null;

    return createPortal(
        <div
            ref={(node) => {
                contentRef.current = node;
                if (clickOutsideRef) {
                    clickOutsideRef.current = node;
                }
            }}
            style={{
                position: "absolute",
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
            hidden={!open}
            className={cn(
                "z-100 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-200 shadow-md outline-hidden starting:translate-y-2 starting:scale-95 duration-150 ease-bounce transition-[translate,scale,display,opacity] hidden:translate-y-2 hidden:scale-95 transition-discrete",
                props.className
            )}>
            {props.children}
        </div>,
        document.body
    );
}
