import type { ReactElement, ReactNode } from "react";
import { createContext, useContext } from "react";
import { Button } from "@/components/ui/Button";
import { createDisclosureContext } from "@/components/ui/DisclosureContext";
import { Trigger } from "@/components/ui/Trigger";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { useLocalStorageImperative } from "@/lib/hook/useLocalStorage";
import { cn } from "@/lib/utils";

const { Provider, useDisclosure } = createDisclosureContext<HTMLButtonElement>();
const DialogIdContext = createContext<string | null>(null);

function useDialogId() {
    const context = useContext(DialogIdContext);
    if (!context) throw new Error("Dialog components must be used within a Dialog");
    return context;
}

interface BaseDialogProps {
    className?: string;
    children: ReactNode;
}

export function Dialog(props: { children: ReactNode; id: string; className?: string; onOpenChange?: (open: boolean) => void }) {
    return (
        <DialogIdContext.Provider value={props.id}>
            <Provider>
                <div className={cn("relative inline-block", props.className)}>{props.children}</div>
            </Provider>
        </DialogIdContext.Provider>
    );
}

export function DialogTrigger(props: {
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: () => void; className?: string }>;
    className?: string;
}) {
    const { setOpen, triggerRef } = useDisclosure();

    return (
        <Trigger elementRef={triggerRef} onToggle={() => setOpen((prev) => !prev)} className={props.className}>
            {props.children}
        </Trigger>
    );
}

export function DialogContent(props: {
    children: ReactNode;
    className?: string;
    reminder?: boolean;
    defaultOpen?: boolean;
    ref?: React.Ref<HTMLDivElement>;
}) {
    const { open, setOpen } = useDisclosure();
    const dialogId = useDialogId();
    const reminderKey = props.reminder ? dialogId : `dialog-${dialogId}`;
    const storage = useLocalStorageImperative(reminderKey, false);
    const clickOutsideRef = useClickOutside(() => setOpen(false));

    const refCallback = (element: HTMLDivElement | null) => {
        if (props.ref) {
            if (typeof props.ref === "function") props.ref(element);
            else props.ref.current = element;
        }

        if (clickOutsideRef) clickOutsideRef.current = element;

        if (element) {
            open ? element.showPopover() : element.hidePopover();
            if (props.defaultOpen && !open && (!props.reminder || !storage.getValue())) {
                setOpen(true);
                props.reminder && storage.setValue(true);
            }
        }
    };

    return (
        <div
            ref={refCallback}
            id={dialogId}
            popover="manual"
            className={cn(
                "fixed inset-0 m-auto w-2/5 min-w-[40%] max-w-[40%] h-fit rounded-xl bg-zinc-950 shadow-lg shadow-neutral-900 p-2 border border-zinc-800 backdrop:bg-black/50 backdrop:backdrop-blur-sm opacity-0 translate-y-4 scale-95 transition-all duration-200 ease-out",
                props.className
            )}>
            {props.children}
        </div>
    );
}

export function DialogHeader(props: BaseDialogProps) {
    return <div className={cn("flex flex-col space-y-1.5 pb-4", props.className)}>{props.children}</div>;
}

export function DialogTitle(props: BaseDialogProps) {
    const { setOpen } = useDisclosure();

    return (
        <div className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200">
            <h2 className={props.className}>{props.children}</h2>
            <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export function DialogHero(props: { image: string; className?: string }) {
    return <img src={props.image} alt="Hero" className={cn("w-full aspect-16/6 object-cover rounded-lg", props.className)} />;
}

export function DialogDescription(props: BaseDialogProps) {
    return (
        <div className={cn("relative border-t border-zinc-800 py-4 leading-normal text-zinc-400 font-light", props.className)}>
            {props.children}
        </div>
    );
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn("flex shrink-0 flex-wrap items-center pt-4 justify-end gap-3", className)}>{children}</div>;
}

export function DialogCloseButton({ children, ...props }: { children?: ReactNode } & React.ComponentProps<typeof Button>) {
    const { setOpen } = useDisclosure();
    const { onClick, ...restProps } = props;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(false);
        if (onClick) onClick(e);
    };

    return (
        <Button type="button" onClick={handleClick} {...restProps}>
            {children}
        </Button>
    );
}
