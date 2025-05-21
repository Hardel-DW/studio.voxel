import { useQuery } from "@tanstack/react-query";
import type { TagRegistry } from "@voxelio/breeze";

export const fetchRegistryById = async (registryId: string): Promise<TagRegistry> => {
    console.log(`useQuery: Fetching registry ${registryId}`);
    const response = await fetch(`/api/registry?registry=${registryId}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok for registry ${registryId}`);
    }
    const data = await response.json();
    if (!data) {
        console.warn(`No data returned for registry ${registryId}, returning empty object.`);
        return {};
    }
    return data as TagRegistry;
};

export const getRegistry = (registryId: string) => {
    const registryQueryKey = ["registry", registryId];
    const {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    } = useQuery<TagRegistry, Error>({
        queryKey: registryQueryKey,
        queryFn: () => fetchRegistryById(registryId)
    });

    return {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    };
};
