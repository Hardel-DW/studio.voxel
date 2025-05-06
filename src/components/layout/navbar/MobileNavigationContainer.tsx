"use client";
import type { PropsWithChildren } from "react";
import { type MobileMenuState, useMobileMenuStore } from "./mobileMenuStore";

export default function MobileNavigationContainer({ children }: PropsWithChildren) {
    const isMobileMenuOpen = useMobileMenuStore((state: MobileMenuState) => state.isOpen);

    if (!isMobileMenuOpen) {
        return null;
    }

    return (
        <nav className="flex md:hidden mt-2 shadow-zinc-800/20 shadow-2xl border-zinc-800 border-t border-l bg-header-translucent flex-col gap-2 rounded-3xl backdrop-blur-md p-2 mx-auto w-10/12 md:w-3/4">
            {children}
        </nav>
    );
}
