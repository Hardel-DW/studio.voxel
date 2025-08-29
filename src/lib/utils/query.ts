import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { defaultShouldDehydrateQuery, isServer, QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Number.POSITIVE_INFINITY,
                gcTime: 1000 * 60 * 60 * 24
            },
            dehydrate: {
                shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending"
            }
        }
    });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
    if (isServer) return makeQueryClient();

    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();

        if (typeof window !== "undefined") {
            const localStoragePersister = createSyncStoragePersister({ storage: window.localStorage });
            persistQueryClient({
                queryClient: browserQueryClient,
                persister: localStoragePersister,
                maxAge: 1000 * 60 * 60 * 24
            });
        }
    }

    return browserQueryClient;
}
