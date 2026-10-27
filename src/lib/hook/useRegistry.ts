import { useQuery } from "@tanstack/react-query";
import { getMinecraftVersion, LATEST_PACK_FORMAT } from "@voxelio/breeze";
import { fetchMcmetaData, MCMETA_PATH } from "@/lib/github/mcmeta";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

export type FetchedRegistry<T> = Record<string, T>;
export type Component<T> = Record<string, T>;

function buildVersionTag(packFormat: number | null, type: keyof typeof MCMETA_PATH): string {
    if (!packFormat) return MCMETA_PATH[type].branch;
    return `${getMinecraftVersion(Math.min(packFormat, LATEST_PACK_FORMAT))}-${MCMETA_PATH[type].branch}`;
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
