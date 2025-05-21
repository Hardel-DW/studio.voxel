"use client";
import { Button } from "@/components/ui/Button";
import { type MobileMenuState, useMobileMenuStore } from "./mobileMenuStore";

export default function MobileMenuButton() {
    const toggleMobileMenu = useMobileMenuStore((state: MobileMenuState) => state.toggle);

    return (
        <Button size="icon" variant="link" rounded="full" aria-label="Menu" id="menu" onClick={toggleMobileMenu}>
            <img src="/icons/menu.svg" alt="" className="w-6 h-6 invert cursor-pointer" />
        </Button>
    );
}
