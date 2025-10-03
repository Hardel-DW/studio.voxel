import { Link } from "@tanstack/react-router";
import type React from "react";
import { cn } from "@/lib/utils";

const variants = {
    variant: {
        default: "bg-zinc-200 text-zinc-800 border-2 border-zinc-500 hover:bg-zinc-300",
        primary: "bg-pink-700 text-zinc-200 hover:bg-pink-800",
        destructive: "bg-red-700 text-zinc-200 border-2 border-black hover:bg-red-800",
        black: "bg-black text-zinc-200 border-2 border-zinc-500 hover:bg-zinc-900",
        ghost: "bg-transparent text-zinc-200 border-2 border-zinc-500 hover:bg-zinc-200 hover:text-zinc-800",
        ghostlite:
            "bg-transparent text-zinc-200 border-2 border-zinc-900 ring-zinc-900 hover:text-zinc-100 hover:bg-zinc-900/20 hover:border-zinc-800 hover:ring-zinc-800",
        ghost_border:
            "bg-transparent text-zinc-200 border-2 border-zinc-900 ring-zinc-900 hover:text-zinc-100 hover:border-zinc-700 hover:ring-zinc-700",
        transparent: "bg-transparent text-zinc-200 border-2 border-zinc-500 hover:bg-white/10",
        link: "bg-transparent hover:text-white text-zinc-400",
        "primary-shimmer":
            "animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(110deg,#881337,45%,#a83659,55%,#881337)] transition hover:scale-95 hover:bg-pink-700 text-white border-0",
        modrinth:
            "animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(110deg,#1bd96a,45%,#00ff82,55%,#1bd96a)] transition hover:scale-95 hover:bg-green-700 text-black border-0",
        shimmer:
            "animate-shimmer hover:scale-95 rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-slate-400 transition focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        "white-shimmer":
            "animate-shimmer bg-[linear-gradient(110deg,#FFFEFC,45%,#d0d0d0,55%,#FFFEFC)] bg-[length:200%_100%] text-black font-medium border-t border-l border-zinc-900 hover:opacity-75 transition",
        "patreon-shimmer":
            "animate-shimmer bg-[linear-gradient(110deg,#c2410c,45%,#e06040,55%,#c2410c)] bg-[length:200%_100%] text-white hover:scale-95 transition flex items-center gap-4 place-self-end rounded-xl"
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
    },
    rounded: {
        default: "rounded-xl",
        none: "rounded-none",
        full: "rounded-full"
    },
    ring: {
        default: "ring-0",
        white: "ring-2 ring-zinc-200",
        primary: "ring-2 ring-pink-700",
        destructive: "ring-2 ring-red-700"
    },
    defaultVariant: {
        size: "default",
        variant: "default",
        rounded: "default",
        ring: "default"
    }
} as const;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants.variant;
    size?: keyof typeof variants.size;
    rounded?: keyof typeof variants.rounded;
    ring?: keyof typeof variants.ring;
    disabled?: boolean;
}

export function Button({
    variant = variants.defaultVariant.variant,
    size = variants.defaultVariant.size,
    rounded = variants.defaultVariant.rounded,
    ring = variants.defaultVariant.ring,
    className,
    children,
    ...rest
}: Props) {
    return (
        <button
            type="button"
            className={cn([
                "inline-flex items-center justify-center whitespace-nowrap cursor-pointer truncate text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants.variant[variant],
                variants.size[size],
                variants.rounded[rounded],
                variants.ring[ring],
                className
            ])}
            {...rest}>
            {children}
        </button>
    );
}

interface LinkProps extends Props {
    href: string;
    to?: never;
}

interface RouterLinkProps extends Props {
    to: string;
    href?: never;
}

export function LinkButton({
    variant = variants.defaultVariant.variant,
    size = variants.defaultVariant.size,
    rounded = variants.defaultVariant.rounded,
    ring = variants.defaultVariant.ring,
    className,
    href,
    to,
    children,
    ...rest
}: (LinkProps | RouterLinkProps) & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
    const linkUrl = href || to || "/";
    const isExternal = href && (href.startsWith("http") || href.startsWith("mailto:"));

    const linkClassName = cn([
        "inline-flex items-center justify-center whitespace-nowrap cursor-pointer truncate text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants.variant[variant],
        variants.size[size],
        variants.rounded[rounded],
        variants.ring[ring],
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
