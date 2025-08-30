import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Providers from "@/components/QueryProvider";

export const Route = createRootRoute({
    component: () => (
        <>
            <Providers>
                <Outlet />
            </Providers>
            <TanStackRouterDevtools />
        </>
    )
});
