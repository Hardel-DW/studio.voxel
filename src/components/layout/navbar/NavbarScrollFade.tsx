"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function NavbarScrollFade({
    children
}: {
    children: React.ReactNode;
}) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
            id="navbar"
            className={cn(
                "flex transition-colors duration-150 ease-linear justify-between items-center max-w-full h-14 rounded-3xl px-2",
                isScrolled && "bg-header-translucent border-t border-l border-zinc-800 backdrop-blur-md"
            )}>
            {children}
        </nav>
    );
}
