import type { ReactElement, ReactNode } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { createDisclosureContext } from "@/components/ui/DisclosureContext";
import { Trigger } from "@/components/ui/Trigger";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { usePopoverPosition } from "@/lib/hook/usePopoverPosition";
import { usePopoverVisibility } from "@/lib/hook/usePopoverVisibility";
import { cn } from "@/lib/utils";

const { Provider: DropdownProvider, useDisclosure: useDropdown } = createDisclosureContext<HTMLButtonElement>();

export function DropdownMenu(props: { children: ReactNode; defaultOpen?: boolean }) {
    return <DropdownProvider defaultOpen={props.defaultOpen}>{props.children}</DropdownProvider>;
}

export function DropdownMenuTrigger(props: {
    children: ReactElement<{ ref?: React.Ref<HTMLButtonElement>; onClick?: (e: React.MouseEvent) => void; className?: string }>;
    className?: string;
}) {
    const { setOpen, triggerRef } = useDropdown();
    return (
        <Trigger elementRef={triggerRef} onToggle={() => setOpen((prev) => !prev)} className={props.className}>
            {props.children}
        </Trigger>
    );
}

export function DropdownMenuContent(props: { children: ReactNode; className?: string }) {
    const { open, setOpen, triggerRef } = useDropdown();
    const contentRef = useRef<HTMLDivElement>(null);
    const { isVisible } = usePopoverVisibility({ open });
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
                "z-50 min-w-[8rem] max-h-[300px] overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 p-1 text-zinc-400 shadow-md outline-hidden",
                "starting:translate-y-2 starting:scale-95 duration-150 ease-bounce transition-[translate,scale,display,opacity]",
                "hidden:translate-y-2 hidden:scale-95 transition-discrete",
                props.className
            )}>
            {props.children}
        </div>,
        document.body
    );
}

// Re-export des composants de Shadcn pour la compatibilité
export function DropdownMenuItem(
    props: {
        children: ReactNode;
        className?: string;
        disabled?: boolean;
        description?: string;
    } & React.HTMLAttributes<HTMLDivElement>
) {
    return (
        <div
            {...props}
            className={cn(
                "relative flex flex-col cursor-pointer select-none items-start justify-start gap-0.5 rounded-xl px-2 py-2.5 text-sm outline-hidden transition-colors hover:bg-zinc-900 hover:text-zinc-200",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                props.disabled && "pointer-events-none opacity-50",
                props.className
            )}
        >
            {props.children}
            {props.description && (
                <span className="text-[10px] leading-tight text-zinc-500 font-extralight tracking-tight">{props.description}</span>
            )}
        </div>
    );
}

export function DropdownMenuLabel(props: { children: ReactNode; className?: string }) {
    return <div className={cn("px-2 py-1.5 text-sm font-semibold", props.className)}>{props.children}</div>;
}

export function DropdownMenuSeparator(props: { className?: string }) {
    return <div className={cn("-mx-1 my-1 h-px bg-zinc-800", props.className)} />;
}

export function DropdownMenuShortcut(props: { children: ReactNode; className?: string }) {
    return <span className={cn("ml-auto text-xs tracking-widest opacity-60", props.className)}>{props.children}</span>;
}

export function DropdownMenuGroup(props: { children: ReactNode; className?: string }) {
    return <div className={props.className}>{props.children}</div>;
}
