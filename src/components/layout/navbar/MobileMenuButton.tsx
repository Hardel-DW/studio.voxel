import { Button } from "@/components/ui/Button";
import { type MobileMenuState, useMobileMenuStore } from "../../../lib/store/MobileMenuStore";

export default function MobileMenuButton() {
    const toggleMobileMenu = useMobileMenuStore((state: MobileMenuState) => state.toggle);

    return (
        <Button size="icon" variant="link" aria-label="Menu" onClick={toggleMobileMenu} className="rounded-full">
            <img src="/icons/menu.svg" alt="Menu" className="w-6 h-6 invert cursor-pointer" />
        </Button>
    );
}
