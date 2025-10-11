import { useEffect, useEffectEvent, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export const TOAST = {
    DEFAULT: "default",
    SUCCESS: "success",
    ERROR: "error",
    INFO: "info",
    WARNING: "warning"
} as const;

const variantStyles: Record<typeof TOAST[keyof typeof TOAST], string> = {
    default: "border-zinc-200 bg-white text-zinc-900",
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900"
};

const variantIcons: Record<typeof TOAST[keyof typeof TOAST], string | null> = {
    default: null,
    success: "/icons/toast/success.svg",
    error: "/icons/toast/error.svg",
    info: "/icons/toast/info.svg",
    warning: "/icons/toast/warning.svg"
};

interface Toast {
    id: string;
    message: string;
    description?: string;
    variant: typeof TOAST[keyof typeof TOAST];
    removing?: boolean;
}

interface ToastEvent {
    message: string;
    variant: typeof TOAST[keyof typeof TOAST];
    description?: string;
}

const MAX_TOASTS = 5;
const DURATION = 4000;
const TRANSITION_DURATION = 200;
const QUEUE_DELAY = 800;

class ToastEventEmitter {
    private listeners: Set<(event: ToastEvent) => void> = new Set();

    subscribe(listener: (event: ToastEvent) => void) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    emit(event: ToastEvent) {
        for (const listener of this.listeners) {
            listener(event);
        }
    }
}

const emitter = new ToastEventEmitter();

export function toast(message: string, variant: typeof TOAST[keyof typeof TOAST] = TOAST.DEFAULT, description?: string) {
    emitter.emit({ message, variant, description });
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const asset = variantIcons[toast.variant];

    return (
        <div
            role="alert"
            hidden={toast.removing}
            className={cn(
                "flex select-none items-center gap-2 rounded-xl border px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] min-w-64 starting:translate-y-full starting:opacity-0 hidden:opacity-0 hidden:scale-95 hidden:-translate-y-full discrete",
                variantStyles[toast.variant]
            )}>
            {typeof asset === "string" && <img src={asset} alt="Icon" className="size-5 shrink-0" />}
            <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
                {toast.description && <p className="text-xs opacity-80 mt-1">{toast.description}</p>}
            </div>
            <button
                type="button"
                onClick={() => onRemove(toast.id)}
                className="shrink-0 rounded-md p-1 transition-colors hover:bg-current/10 cursor-pointer"
                aria-label="Close">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [queue, setQueue] = useState<ToastEvent[]>([]);
    const [heights, setHeights] = useState(new Map<string, number>());

    const processQueue = () => {
        if (queue.length > 0) {
            setTimeout(() => {
                setQueue((current) => {
                    const [next, ...remaining] = current;
                    if (next) {
                        setToasts((currentToasts) => {
                            if (currentToasts.length < MAX_TOASTS) {
                                addToastInternal(next);
                            }
                            return currentToasts;
                        });
                    }
                    return remaining;
                });
            }, QUEUE_DELAY);
        }
    };

    const removeToast = (id: string) => {
        setToasts((current) => current.map((t) => (t.id === id ? { ...t, removing: true } : t)));
        setTimeout(() => {
            setToasts((current) => current.filter((t) => t.id !== id));
            processQueue();
        }, TRANSITION_DURATION);
    };

    const addToastInternal = (event: ToastEvent) => {
        setToasts((current) => {
            if (current.length >= MAX_TOASTS) {
                setQueue((q) => [...q, event]);
                return current;
            }

            const id = Math.random().toString(36).substring(2, 11);
            const newToast: Toast = {
                id,
                message: event.message,
                variant: event.variant,
                description: event.description
            };

            setTimeout(() => removeToast(id), DURATION);

            return [...current, newToast];
        });
    };

    const unsubscribeEvent = useEffectEvent(() => emitter.subscribe(addToastInternal));
    // biome-ignore lint/correctness/useExhaustiveDependencies: We need to wait the next version of biome. useEffectEvent look like useRef. https://github.com/biomejs/biome/pull/7669
    useEffect(() => unsubscribeEvent(), []);

    if (toasts.length === 0) return null;

    const getOffset = (stackIndex: number) =>
        toasts.slice(0, stackIndex).reduce((sum, t) => sum + (heights.get(t.id) || 64) + 8, 0);

    return createPortal(
        <div className="group pointer-events-none fixed right-0 bottom-0 z-50 p-4">
            <div className="pointer-events-auto relative flex flex-col items-end">
                {toasts.map((toast, index) => {
                    const stackIndex = toasts.length - 1 - index;
                    return (
                        <div
                            key={toast.id}
                            ref={(el) => {
                                if (el && !heights.has(toast.id)) {
                                    setHeights(new Map(heights.set(toast.id, el.offsetHeight)));
                                }
                            }}
                            style={{
                                "--translateY": `${stackIndex * -8}px`,
                                "--hoverTranslateY": `${-getOffset(stackIndex)}px`,
                                "--scale": `${1 - stackIndex * 0.03}`,
                                zIndex: index + 1
                            } as React.CSSProperties}
                            className="absolute right-0 bottom-0 transition-all duration-600 ease-[cubic-bezier(0.32,0.72,0,1)] translate-y-(--translateY) scale-(--scale) group-hover:translate-y-(--hoverTranslateY) group-hover:scale-100 before:absolute before:inset-0 before:-inset-y-4 before:content-[''] before:-z-10">
                            <ToastItem toast={toast} onRemove={removeToast} />
                        </div>
                    );
                })}
            </div>
        </div>,
        document.body
    );
}
