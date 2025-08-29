import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createDisclosureContext } from "@/components/ui/DisclosureContext";
import { Trigger } from "@/components/ui/Trigger";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { usePopoverVisibility } from "@/lib/hook/usePopoverVisibility";
import { cn } from "@/lib/utils";

const { Provider: BaseDialogProvider, useDisclosure: useDialog } = createDisclosureContext<HTMLButtonElement>();

const DialogContext = createContext<{
    onOpenChange?: (open: boolean) => void;
    isControlled: boolean;
}>({ isControlled: false });

function DialogProvider({
    children,
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange
}: {
    children: ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [uncontrolledOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    return (
        <BaseDialogProvider defaultOpen={open}>
            <DialogContext.Provider value={{ onOpenChange, isControlled }}>{children}</DialogContext.Provider>
        </BaseDialogProvider>
    );
}

export function Dialog(props: {
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
}) {
    return (
        <DialogProvider defaultOpen={props.defaultOpen} open={props.open} onOpenChange={props.onOpenChange}>
            {props.children}
        </DialogProvider>
    );
}

export function DialogTrigger(props: {
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: (e: React.MouseEvent) => void; className?: string }>;
    className?: string;
}) {
    const { open, setOpen, triggerRef } = useDialog();
    const { onOpenChange, isControlled } = useContext(DialogContext);

    const handleToggle = () => {
        const nextOpen = !open;
        if (!isControlled) {
            setOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    };

    return (
        <Trigger elementRef={triggerRef} onToggle={handleToggle} className={props.className}>
            {props.children}
        </Trigger>
    );
}

export function DialogContent(props: { children: ReactNode; className?: string }) {
    const { open, setOpen } = useDialog();
    const contentRef = useRef<HTMLDivElement>(null);
    const { isVisible } = usePopoverVisibility({ open, transitionDuration: 150 });
    const clickOutsideRef = useClickOutside(() => setOpen(false));

    if (!isVisible && !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div
                        ref={(node) => {
                            contentRef.current = node;
                            if (clickOutsideRef) {
                                clickOutsideRef.current = node;
                            }
                        }}
                        hidden={!open}
                        className={cn(
                            "w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-200 shadow-lg outline-hidden starting:translate-y-4 starting:scale-95 duration-150 ease-bounce transition-[translate,scale,display,opacity] hidden:translate-y-4 hidden:scale-95 transition-discrete",
                            props.className
                        )}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

interface BaseDialogProps {
    className?: string;
    children: ReactNode;
}

export function DialogHeader(props: BaseDialogProps) {
    return (
        <div className={cn("flex flex-col space-y-1.5", props.className)} {...props}>
            {props.children}
        </div>
    );
}

export function DialogTitle(props: BaseDialogProps) {
    return (
        <div className="mb-4">
            <h2 className={cn("text-lg font-semibold leading-none", props.className)} {...props}>
                {props.children}
            </h2>
        </div>
    );
}

export function DialogDescription(props: BaseDialogProps) {
    return (
        <p className={cn("text-sm text-zinc-400", props.className)} {...props}>
            {props.children}
        </p>
    );
}

export function DialogFooter(props: BaseDialogProps) {
    return (
        <>
            <hr className="w-full block" />
            <div className={cn("flex justify-end gap-3 mt-6", props.className)} {...props}>
                {props.children}
            </div>
        </>
    );
}
