import { useEffect, useId, useState } from "react";
import type { MobileMenuState } from "@/components/layout/navbar/mobileMenuStore";
import { useMobileMenuStore } from "@/components/layout/navbar/mobileMenuStore";
import { cn } from "@/lib/utils";

export default function NavbarScrollFade({ children }: { children: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const isMobileMenuOpen = useMobileMenuStore((state: MobileMenuState) => state.isOpen);

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
            id={useId()}
            className={cn(
                "mx-auto w-10/12 md:w-3/4 flex transition-colors duration-150 border-zinc-800 border-t-0 border-l-0 ease-linear justify-between items-center max-w-full h-14 rounded-3xl px-2",
                (isMobileMenuOpen || isScrolled) && "bg-header-translucent border-t border-l backdrop-blur-md"
            )}>
            {children}
        </nav>
    );
}
