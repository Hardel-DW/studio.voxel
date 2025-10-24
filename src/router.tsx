import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import Loader from "@/components/ui/Loader";

export function getRouter() {
    const router = createRouter({
        routeTree,
        defaultPendingMinMs: 0,
        defaultPendingComponent: Loader,
        defaultPreload: "viewport",
        defaultStaleTime: 1000 * 60 * 5 // 3 minutes
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
