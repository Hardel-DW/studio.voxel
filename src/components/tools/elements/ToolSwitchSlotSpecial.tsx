import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import type { InteractiveComponentProps } from "@/components/tools/elements/InteractiveComponent";
import { cn } from "@/lib/utils";
import { type TagType, getTagsFromRegistry } from "@voxelio/breeze";
import type { ToolSwitchSlotSpecialType } from "@voxelio/breeze/core";
import { Identifier, getLabeledIdentifier, isTag } from "@voxelio/breeze/core";
import { useQuery } from "@tanstack/react-query";

type TagRegistry = Record<string, TagType>;

const fetchRegistryById = async (registryId: string): Promise<TagRegistry> => {
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

export default function ToolSwitchSlotSpecial({
    component,
    interactiveProps,
    index = 0
}: InteractiveComponentProps<boolean, ToolSwitchSlotSpecialType>) {
    const { value, lock, handleChange } = interactiveProps;
    const compile = useConfiguratorStore((state) => state.compile);

    const registryQueryKey = ["registry", component.data.registry];
    const {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    } = useQuery<TagRegistry, Error>({
        queryKey: registryQueryKey,
        queryFn: () => fetchRegistryById(component.data.registry)
    });

    const assembleDatapack = compile();
    const tagIdentifier = Identifier.of(component.data.element, component.data.registry);
    const tagData = assembleDatapack.find((element) => new Identifier(getLabeledIdentifier(element)).equals(tagIdentifier));
    const rawData = tagData?.type !== "deleted" ? tagData?.element : undefined;
    const initialValues = rawData && isTag(rawData) ? rawData.data.values.map((v) => (typeof v === "string" ? v : v.id)) : [];

    const identifier = Identifier.of(component.data.element, component.data.registry).resource;
    const data = registryData?.[identifier];
    const originalValues = data ? getTagsFromRegistry(data) : [];
    const combined = new Set([...initialValues, ...originalValues]);

    return (
        <div
            className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 px-6 py-4 rounded-xl cursor-pointer relative  overflow-hidden",
                { "bg-black/25 ring-1 ring-zinc-600": value },
                { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
            )}
            onClick={() => handleChange(!value)}
            onKeyDown={() => handleChange(!value)}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    {component.image && (
                        <div className="shrink-0">
                            <img src={component.image} alt="" className="w-8 h-8 object-contain pixelated" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-white line-clamp-1">
                            <Translate content={component.title} schema={true} />
                        </span>
                        <span className="text-xs text-zinc-400 font-light line-clamp-2">
                            <Translate content={component.description} schema={true} />
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {lock.isLocked && (
                        <span className="text-xs text-zinc-400 font-light w-max flex items-center">
                            <Translate content={lock.text} schema={true} />
                        </span>
                    )}
                    {value && <img src="/icons/check.svg" alt="checkbox" className="w-6 h-6 invert" />}
                    {lock.isLocked && <img src="/icons/tools/lock.svg" alt="checkbox" className="w-6 h-6 invert" />}
                </div>
            </div>

            {isRegistryLoading && <p>Chargement du registre...</p>}
            {isRegistryError && <p>Erreur de chargement du registre.</p>}

            {Array.from(combined).length > 0 && (
                <>
                    <hr className="border-t-2 border-l-2 border-stone-900" />
                    <div className="grid gap-2">
                        {Array.from(combined)
                            .slice(0, 3)
                            .map((value) => (
                                <span
                                    key={value}
                                    className="text-white text-sm px-2 bg-blue-50/5 py-1 rounded-xl border-t-2 border-l-2 border-stone-900">
                                    {Identifier.of(value, component.data.registry).toResourceName()}
                                </span>
                            ))}
                        {Array.from(combined).length > 3 && (
                            <span className="text-zinc-400 text-xs px-2 pt-2 hover:text-zinc-200 cursor-pointer transition-colors">
                                Voir plus ({Array.from(combined).length - 3})
                            </span>
                        )}
                    </div>
                </>
            )}

            <div className="absolute inset-0 -z-10 brightness-25" style={{ transform: `translateX(${index * 75}px)` }}>
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
