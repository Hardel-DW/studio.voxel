import type React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function NavigationContent({ className, children, ...props }: Props) {
    return (
        <div
            className={cn(
                "left-0 top-2 w-full z-10 bg-zinc-950 border-t border-zinc-800 rounded-3xl md:absolute md:w-auto starting:scale-90 transition-all duration-150", // Note: 'starting:' might be a custom variant or require specific setup in Tailwind
                className
            )}
            {...props}>
            {/* This div might be for background/blur effect, kept for structure */}
            <div className="absolute w-full h-full -z-10 scale-110" />
            {children}
        </div>
    );
}
