import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolListOption from "@/components/tools/elements/ToolListOption";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import Loader from "@/components/ui/Loader";
import useRegistry from "@/lib/hook/useRegistry";
import { isMinecraft } from "@/lib/utils/lock";
import { Datapack, Identifier, type TagRegistry, getLabeledIdentifier, Tags, isTag, EnchantmentActionBuilder } from "@voxelio/breeze";

const vanillaGroups = [
    { id: "armor", image: "armor", value: "#minecraft:exclusive_set/armor" },
    { id: "bow", image: "bow", value: "#minecraft:exclusive_set/bow" },
    { id: "crossbow", image: "crossbow", value: "#minecraft:exclusive_set/crossbow" },
    { id: "damage", image: "sword", value: "#minecraft:exclusive_set/damage" },
    { id: "riptide", image: "trident", value: "#minecraft:exclusive_set/riptide" },
    { id: "mining", image: "mining_loot", value: "#minecraft:exclusive_set/mining" },
    { id: "boots", image: "foot_armor", value: "#minecraft:exclusive_set/boots" }
];

export default function ExclusiveGroup() {
    const files = useConfiguratorStore((state) => state.files);
    const enchantments = new Datapack(files).getRegistry("tags/enchantment", "exclusive_set", ["minecraft"]);
    const compile = useConfiguratorStore((state) => state.compile);
    const { data: tags, isLoading: isRegistryLoading, isError: isRegistryError } = useRegistry<TagRegistry>("tags/enchantment", "summary");
    const assembleDatapack = compile();

    const getValues = (identifier: Identifier) => {
        const tagData = assembleDatapack.find((element) => new Identifier(getLabeledIdentifier(element)).equals(identifier));
        const rawData = tagData?.type !== "deleted" ? tagData?.element : undefined;
        const initialValues = rawData && isTag(rawData.data) ? new Tags(rawData.data).fromRegistry() : [];

        const data = tags?.[identifier.resource];
        const originalValues = data ? new Tags(data).fromRegistry() : [];
        const combined = new Set([...initialValues, ...originalValues]);
        return Array.from(combined);
    };

    return (
        <>
            <ToolCategory title={{ key: "enchantment:exclusive.vanilla.title" }}>
                <ToolGrid>
                    {vanillaGroups.map(({ id, image, value }) => (
                        <ToolSlot
                            key={id}
                            title={{ key: `enchantment:exclusive.set.${id}.title` }}
                            description={{ key: `enchantment:exclusive.set.${id}.description` }}
                            image={`/images/features/item/${image}.webp`}
                            action={new EnchantmentActionBuilder().setExclusiveSetWithTags(value).build()}
                            renderer={(el) => el.exclusiveSet === value}
                            lock={[isMinecraft]}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            <ToolCategory title={{ key: "enchantment:exclusive.custom.title" }}>
                <div
                    className="grid items-stretch gap-4"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))"
                    }}>
                    {enchantments.length === 0 && (
                        <p className="text-zinc-400 p-4">
                            <Translate content={{ key: "enchantment:exclusive.custom.fallback" }} />
                        </p>
                    )}

                    {isRegistryLoading && <Loader />}
                    {isRegistryError && <ErrorPlaceholder error={new Error("Erreur de chargement du registre.")} />}

                    {enchantments.map((enchantment) => {
                        const identifierString = new Identifier(enchantment.identifier).toString();
                        return (
                            <ToolListOption
                                key={identifierString}
                                title={new Identifier(enchantment.identifier).toResourceName()}
                                description={new Identifier(enchantment.identifier).toResourcePath()}
                                image="/icons/logo.svg"
                                values={getValues(new Identifier(enchantment.identifier))}
                                action={new EnchantmentActionBuilder().setExclusiveSetWithTags(identifierString).build()}
                                renderer={(el) => el.exclusiveSet === identifierString}
                            />
                        );
                    })}
                </div>
            </ToolCategory>
        </>
    );
}
