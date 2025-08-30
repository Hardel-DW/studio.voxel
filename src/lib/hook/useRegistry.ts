import { useQuery } from "@tanstack/react-query";
import { fetchMinecraftRegistry, fetchMinecraftSummary } from "@/lib/github";

export type FetchedRegistry<T> = Record<string, T>;

export default function useRegistry<T>(registryId: string, type: "summary" | "registry" = "summary") {
    const registryQueryKey = ["registry", registryId];
    const {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    } = useQuery<T, Error>({
        queryKey: registryQueryKey,
        queryFn: () => fetchRegistryById<T>(registryId, type)
    });

    return {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    };
}

export const fetchRegistryById = async <T>(registryId: string, type: "summary" | "registry" = "summary"): Promise<T> => {
    console.log(`useQuery: Fetching registry ${registryId}`);
    const data = type === "summary"
        ? await fetchMinecraftSummary(registryId)
        : await fetchMinecraftRegistry(registryId);

    if (!data) {
        console.warn(`No data returned for registry ${registryId}, returning empty object.`);
        return {} as T;
    }
    return data as T;
};
