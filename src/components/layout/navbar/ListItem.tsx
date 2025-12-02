import type React from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface Props extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
    title: string;
    image?: string;
    children: React.ReactNode;
}

export default function ListItem({ title, image, className, children, ...props }: Props) {
    return (
        <li>
            <Link
                to={props.href}
                className={cn(
                    "block select-none space-y-1 rounded-3xl px-6 py-4 leading-none no-underline outline-none transition-colors hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white",
                    className
                )}
                {...props}>
                <div className="flex justify-between items-center gap-x-8">
                    <div>
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 mt-1 text-xs leading-snug text-zinc-400">{children}</p>
                    </div>
                    {image && <img src={image} alt={`${title} logo`} className="w-12 h-auto" />}
                </div>
            </Link>
        </li>
    );
}
