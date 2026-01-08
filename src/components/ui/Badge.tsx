import type { PropsWithChildren } from "react";

export function Badge({ hue, children }: PropsWithChildren<{ hue: number }>) {
    return (
        <span
            className="text-[10px] font-bold uppercase tracking-widest mr-1 px-2 py-0.5 rounded-full border"
            style={{
                color: `hsl(${hue}, 70%, 60%)`,
                backgroundColor: `hsl(${hue}, 70%, 50%, 0.1)`,
                borderColor: `hsl(${hue}, 70%, 50%, 0.2)`
            }}>
            {children}
        </span>
    );
}
