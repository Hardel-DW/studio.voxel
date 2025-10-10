import { useQuery } from "@tanstack/react-query";
import type { MCMETA_PATH } from "@/lib/github";
import { fetchMcmetaData } from "@/lib/github";

export type FetchedRegistry<T> = Record<string, T>;
export type Component<T> = Record<string, T>;

export default function useRegistry<T>(type: keyof typeof MCMETA_PATH, registryId?: string) {
    const registryQueryKey = ["registry", registryId, "1.21.11"];
    const {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    } = useQuery<T, Error>({
        queryKey: registryQueryKey,
        queryFn: () => fetchMcmetaData(type, registryId) as T
    });

    return {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    };
}
