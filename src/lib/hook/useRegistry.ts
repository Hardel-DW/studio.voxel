import { useQuery } from "@tanstack/react-query";

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
    const response = await fetch(`/api/${type}?registry=${registryId}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok for registry ${registryId}`);
    }
    const data = await response.json();
    if (!data) {
        console.warn(`No data returned for registry ${registryId}, returning empty object.`);
        return {} as T;
    }
    return data as T;
};
