import { Link } from "@tanstack/react-router";
import type React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    title: string;
    description: string;
    image: string;
    to?: string;
    href?: string;
    params?: Record<string, string>;
}

export default function HeroCard({ title, description, image, className, to, href, params, ...props }: Props) {
    const backgroundStyle: React.CSSProperties = {
        backgroundImage: `url(${image})`,
        maskImage: "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))",
        WebkitMaskImage: "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))"
    };

    const sharedClassName = cn("h-40 group/picture relative cursor-pointer flex flex-col justify-end select-none gap-1 p-3", className);

    const content = (
        <>
            <div className="text-xl font-medium text-white leading-none relative z-10">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-zinc-400 relative z-10">{description}</p>

            <span
                className="absolute bg-cover rounded-2xl bg-center bg-no-repeat inset-0 size-full z-0 opacity-100 group-hover/picture:opacity-80 transition-opacity duration-200"
                style={backgroundStyle}
            />
        </>
    );

    if (to && params) {
        return (
            <Link to={to} params={params} className={sharedClassName} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <a href={href} className={sharedClassName} {...props}>
            {content}
        </a>
    );
}
