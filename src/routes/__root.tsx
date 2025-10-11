import { createRootRoute, Outlet } from "@tanstack/react-router";
import Providers from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/Toast";

export const Route = createRootRoute({
    component: RootComponent
});

function RootComponent() {
    return (
        <Providers>
            <Outlet />
            <Toaster />
        </Providers>
    );
}
