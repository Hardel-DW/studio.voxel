import type { ReactNode } from "react";
import { useRef } from "react";
import { useLocalStorage } from "@/lib/hook/useLocalStorage";
import { cn } from "@/lib/utils";

interface BaseDialogProps {
    className?: string;
    children: ReactNode;
}

export function DialogContent(props: {
    children: ReactNode;
    id: string;
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
    reminder?: string;
    defaultOpen?: boolean;
}) {
    const internalRef = useRef<HTMLDivElement>(null);
    const dialogRef = props.ref || internalRef;
    const [hasSeenDialog, setHasSeenDialog] = useLocalStorage(props.reminder || `dialog-${props.id}`, false);

    // Auto-open logic
    if (props.defaultOpen && props.reminder && !hasSeenDialog) {
        setTimeout(() => {
            if (dialogRef && "current" in dialogRef && dialogRef.current) {
                dialogRef.current.showPopover();
                setHasSeenDialog(true);
            }
        }, 100);
    }

    return (
        <div
            ref={dialogRef}
            id={props.id}
            popover="auto"
            className={cn(
                "fixed inset-0 m-auto w-2/5 min-w-[40%] max-w-[40%] h-fit rounded-lg bg-zinc-950 shadow-sm p-6 border border-zinc-800 backdrop:bg-black/50 backdrop:backdrop-blur-sm opacity-0 translate-y-4 scale-95 transition-all duration-200 ease-out transition-discrete starting:open:translate-y-4 starting:open:opacity-0 starting:open:scale-95 open:translate-y-0 open:opacity-100 open:scale-100",
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
    return (
        <div className="flex shrink-0 items-center text-xl font-medium text-zinc-200">
            <h2 className={props.className}>{props.children}</h2>
        </div>
    );
}

export function DialogDescription(props: BaseDialogProps) {
    return (
        <div className="relative border-t border-zinc-800 py-4 leading-normal text-zinc-400 font-light">
            <p className={props.className}>{props.children}</p>
        </div>
    );
}

export function DialogFooter({ children, popoverTarget, className }: { children: ReactNode; popoverTarget: string; className?: string }) {
    return (
        <div className={cn("flex shrink-0 flex-wrap items-center pt-4 justify-end gap-3", className)}>
            <button
                popoverTarget={popoverTarget}
                popoverTargetAction="hide"
                className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-zinc-400 hover:bg-zinc-800 focus:bg-zinc-800 active:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50"
                type="button">
                Cancel
            </button>
            {children}
        </div>
    );
}
