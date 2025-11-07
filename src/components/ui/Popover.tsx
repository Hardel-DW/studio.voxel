import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { createDisclosureContext } from "@/components/ui/DisclosureContext";
import Portal from "@/components/ui/Portal";
import { Trigger } from "@/components/ui/Trigger";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { usePopoverPosition } from "@/lib/hook/usePopoverPosition";
import { cn } from "@/lib/utils";

const { Provider, useDisclosure } = createDisclosureContext<HTMLButtonElement>();
const PopoverContext = createContext<{ onOpenChange?: (open: boolean) => void } | null>(null);

export function Popover(props: { children: ReactNode; className?: string; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
    return (
        <PopoverContext.Provider value={{ onOpenChange: props.onOpenChange }}>
            <Provider defaultOpen={props.defaultOpen}>
                <div className={cn("relative inline-block", props.className)}>{props.children}</div>
            </Provider>
        </PopoverContext.Provider>
    );
}

export function PopoverTrigger(props: {
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: () => void; className?: string }>;
    className?: string;
}) {
    const { setOpen, triggerRef } = useDisclosure();
    const context = useContext(PopoverContext);

    return (
        <Trigger
            elementRef={triggerRef}
            onToggle={() => {
                setOpen((prev) => {
                    const newValue = !prev;
                    context?.onOpenChange?.(newValue);
                    return newValue;
                });
            }}
            className={props.className}>
            {props.children}
        </Trigger>
    );
}

export function PopoverContent(props: {
    children: ReactNode;
    className?: string;
    containerRef?: React.RefObject<HTMLElement | null>;
    spacing?: number;
    padding?: number;
}) {
    const { open, setOpen, triggerRef } = useDisclosure();
    const context = useContext(PopoverContext);
    const contentRef = useRef<HTMLDivElement>(null);
    const position = usePopoverPosition({
        triggerRef,
        contentRef,
        containerRef: props.containerRef,
        spacing: props.spacing,
        padding: props.padding,
        open
    });
    const clickOutsideRef = useClickOutside(() => {
        setOpen(false);
        context?.onOpenChange?.(false);
    });

    return (
        <Portal>
            <div
                ref={(node) => {
                    contentRef.current = node;
                    if (clickOutsideRef) clickOutsideRef.current = node;
                    if (node) open ? node.showPopover() : node.hidePopover();
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
                    "rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-200 shadow-md outline-hidden duration-150 ease-bounce",
                    props.className
                )}>
                {props.children}
            </div>
        </Portal>
    );
}
