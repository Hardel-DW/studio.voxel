import { createRootRoute, Outlet } from "@tanstack/react-router";
import Providers from "@/components/QueryProvider";

export const Route = createRootRoute({
    component: RootComponent
});

function RootComponent() {
    return (
        <Providers>
            <Outlet />
        </Providers>
    );
}
