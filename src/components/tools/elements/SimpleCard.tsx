import type React from "react";
import { cn } from "@/lib/utils";

interface SimpleCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function SimpleCard({ children, className, ...props }: SimpleCardProps) {
    return (
        <div
            className={cn(
                "bg-black/50 backdrop-blur-2xl border-t-2 border-l-2 border-stone-900 ring-0 cursor-pointer ring-zinc-800 relative transition-all hover:ring-1 py-6 px-8 rounded-xl",
                className
            )}
            {...props}>
            {children}
            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
