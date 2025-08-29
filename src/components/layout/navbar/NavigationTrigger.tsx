import type React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export default function NavigationTrigger({ className, children, ...props }: Props) {
    return (
        <button
            className={cn(
                "group px-4 py-2 text-[16px] tracking-wide transition rounded-2xl text-zinc-400 hover:text-white inline-flex h-10 w-max items-center justify-center bg-transparent hover:bg-zinc-900 focus:bg-zinc-700 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50", // Replaced focus:outline-hidden with focus:outline-none
                className
            )}
            {...props}>
            {children}
            <img
                src="/icons/chevron-down.svg"
                alt="Open menu"
                className="relative invert top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" // Changed class to className
                aria-hidden="true"
            />
        </button>
    );
}
