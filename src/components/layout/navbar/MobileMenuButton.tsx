import { useId } from "react";
import { Button } from "@/components/ui/Button";
import { type MobileMenuState, useMobileMenuStore } from "./mobileMenuStore";

export default function MobileMenuButton() {
    const toggleMobileMenu = useMobileMenuStore((state: MobileMenuState) => state.toggle);

    return (
        <Button size="icon" variant="link" aria-label="Menu" id={useId()} onClick={toggleMobileMenu} className="rounded-full">
            <img src="/icons/menu.svg" alt="" className="w-6 h-6 invert cursor-pointer" />
        </Button>
    );
}
