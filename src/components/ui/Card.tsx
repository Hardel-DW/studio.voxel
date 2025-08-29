import type * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = {
    ref?: React.Ref<HTMLDivElement>;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({ ref, className, ...props }: CardProps) {
    return <div ref={ref} className={cn("rounded-3xl border border-zinc-900 bg-zinc-950 text-zinc-200 shadow-md", className)} {...props} />;
}

export function CardHeader({ ref, className, ...props }: CardProps) {
    return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 border-0 border-transparent", className)} {...props} />;
}

export function CardTitle({ ref, className, ...props }: CardProps) {
    return <div ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ ref, className, ...props }: CardProps) {
    return <div ref={ref} className={cn("text-sm text-zinc-400", className)} {...props} />;
}

export function CardContent({ ref, className, ...props }: CardProps) {
    return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ ref, className, ...props }: CardProps) {
    return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
