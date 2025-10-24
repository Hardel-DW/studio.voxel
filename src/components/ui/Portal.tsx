import { ClientOnly } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

function PortalContent({ children, container }: { children: ReactNode; container?: HTMLElement }) {
    return createPortal(children, container ?? document.body);
}

export default function Portal({ children, container }: { children: ReactNode; container?: HTMLElement }) {
    return (
        <ClientOnly>
            <PortalContent container={container}>{children}</PortalContent>
        </ClientOnly>
    );
}
