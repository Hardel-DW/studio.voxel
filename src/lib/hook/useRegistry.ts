import { useQuery } from "@tanstack/react-query";
import { getMinecraftVersion } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { MCMETA_PATH, fetchMcmetaData } from "@/lib/github/mcmeta";

export type FetchedRegistry<T> = Record<string, T>;
export type Component<T> = Record<string, T>;

function buildVersionTag(packFormat: number | null, type: keyof typeof MCMETA_PATH): string {
    if (!packFormat) return MCMETA_PATH[type].branch;
    return `${getMinecraftVersion(packFormat)}-${MCMETA_PATH[type].branch}`;
}

export default function useRegistry<T>(type: keyof typeof MCMETA_PATH, registryId?: string) {
    const packFormat = useConfiguratorStore((state) => state.version);
    const versionTag = buildVersionTag(packFormat, type);
    const registryQueryKey = ["registry", registryId, versionTag];
    const {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    } = useQuery<T, Error>({
        queryKey: registryQueryKey,
        queryFn: () => fetchMcmetaData(type, versionTag, registryId) as T
    });

    return {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    };
}
