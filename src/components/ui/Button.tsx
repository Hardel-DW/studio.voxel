import { Link } from "@tanstack/react-router";
import type React from "react";
import { cn } from "@/lib/utils";

const variants = {
    variant: {
        default: "bg-zinc-200 text-zinc-800 border-2 border-zinc-500 hover:bg-zinc-300",
        primary: "bg-pink-700 text-zinc-200 hover:bg-pink-800",
        black: "bg-black text-zinc-200 border-2 border-zinc-500 hover:bg-zinc-900",
        ghost: "bg-transparent text-zinc-200 border-2 border-zinc-500 hover:bg-zinc-200 hover:text-zinc-800",
        ghost_border:
            "bg-transparent text-zinc-200 border-2 border-zinc-900 ring-zinc-900 hover:text-zinc-100 hover:border-zinc-700 hover:ring-zinc-700",
        transparent: "bg-transparent text-zinc-200 border-2 border-zinc-500 hover:bg-white/10",
        link: "bg-transparent hover:text-white text-zinc-400",
        shimmer: "shimmer-white text-black font-medium border-t border-l border-zinc-900 hover:opacity-75 transition",
        patreon: "shimmer-orange-700 text-white hover:scale-95 transition flex items-center gap-4 place-self-end rounded-xl"
    },
    size: {
        square: "h-10 p-2",
        default: "h-10 px-4 py-2",
        xs: "h-6 rounded px-3 py-2",
        sm: "h-9 rounded-md px-3",
        md: "h-10 rounded-md px-4",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10",
        "2xl": "h-12 rounded-md px-16",
        "3xl": "h-12 rounded-md px-20",
        icon: "h-12 w-12 p-2"
    }
} as const;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants.variant;
    size?: keyof typeof variants.size;
}

export function Button({ variant = "default", size = "default", className, children, ...rest }: Props) {
    return (
        <button
            type="button"
            className={cn([
                "rounded-xl inline-flex items-center justify-center whitespace-nowrap cursor-pointer truncate text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants.variant[variant],
                variants.size[size],
                className
            ])}
            {...rest}>
            {children}
        </button>
    );
}

interface RouterLinkProps extends Props {
    href?: string;
    to?: string;
}

export function LinkButton({
    variant = "default",
    size = "default",
    className,
    href,
    to,
    children,
    ...rest
}: RouterLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
    const linkUrl = href || to || "/";
    const isExternal = href && (href.startsWith("http") || href.startsWith("mailto:"));

    const linkClassName = cn([
        "inline-flex rounded-xl items-center justify-center whitespace-nowrap cursor-pointer truncate text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants.variant[variant],
        variants.size[size],
        className
    ]);

    if (isExternal) {
        return (
            <a href={linkUrl} className={linkClassName} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <Link to={linkUrl} className={linkClassName} {...rest}>
            {children}
        </Link>
    );
}
