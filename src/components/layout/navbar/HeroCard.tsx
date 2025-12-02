import type React from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    title: string;
    description: string;
    image: string;
}

export default function HeroCard({ title, description, image, className, ...props }: Props) {
    const backgroundStyle: React.CSSProperties = {
        backgroundImage: `url(${image})`,
        maskImage: "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))",
        WebkitMaskImage: "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))" // For Safari/Webkit compatibility
    };

    return (
        <Link
            to={props.href}
            className={cn("h-40 group/picture relative cursor-pointer flex flex-col justify-end select-none gap-1 p-3", className)}
            {...props}>
            <div className="text-xl font-medium text-white leading-none relative z-10">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-zinc-400 relative z-10">{description}</p>

            <span
                className="absolute bg-cover rounded-2xl bg-center bg-no-repeat inset-0 size-full z-0 opacity-100 group-hover/picture:opacity-80 transition-opacity duration-200"
                style={backgroundStyle}
            />
        </Link>
    );
}
