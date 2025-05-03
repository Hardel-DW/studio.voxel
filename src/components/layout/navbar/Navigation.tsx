import { cn } from "@/lib/utils";
import type React from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    viewportContent?: React.ReactNode;
}

export default function Navigation({ className, children, viewportContent, ...props }: Props) {
    return (
        <nav className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)} {...props}>
            {children}
            {viewportContent && (
                <div className="absolute left-0 top-full flex justify-center w-full">
                    <div className="origin-top-center shadow-zinc-900/40 shadow-2xl relative mt-1.5 overflow-hidden rounded-3xl bg-popover text-popover-foreground">
                        {viewportContent}
                    </div>
                </div>
            )}
        </nav>
    );
}
