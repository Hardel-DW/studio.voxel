import { useRouter, type NavigateOptions } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Simple hook to preload a route
 */
export function usePreloadRoute(options: NavigateOptions) {
    const router = useRouter();

    useEffect(() => {
        router.preloadRoute(options);
    }, [router, options]);
}

/**
 * Hook to preload multiple routes
 */
export function usePreloadRoutes(routes: NavigateOptions[]) {
    const router = useRouter();

    useEffect(() => {
        Promise.all(routes.map(route => router.preloadRoute(route)));
    }, [router, routes]);
}