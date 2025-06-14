import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolListOption from "@/components/tools/elements/ToolListOption";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import useRegistry from "@/lib/hook/useRegistry";
import { isMinecraft } from "@/lib/utils/lock";
import { Datapack, Identifier, type TagRegistry, getLabeledIdentifier, Tags, isTag, EnchantmentActionBuilder } from "@voxelio/breeze";
import React from "react";

const vanillaGroups = [
    { id: "armor", image: "armor", value: "#minecraft:exclusive_set/armor" },
    { id: "bow", image: "bow", value: "#minecraft:exclusive_set/bow" },
    { id: "crossbow", image: "crossbow", value: "#minecraft:exclusive_set/crossbow" },
    { id: "damage", image: "sword", value: "#minecraft:exclusive_set/damage" },
    { id: "riptide", image: "trident", value: "#minecraft:exclusive_set/riptide" },
    { id: "mining", image: "mining", value: "#minecraft:exclusive_set/mining" },
    { id: "boots", image: "boots", value: "#minecraft:exclusive_set/boots" }
];

export default function ExclusiveGroup() {
    const files = useConfiguratorStore((state) => state.files);
    const compile = useConfiguratorStore((state) => state.compile);
    const enchantments = new Datapack(files).getRegistry("tags/enchantment", "exclusive_set", ["minecraft"]);
    const { data: tags, isLoading: isRegistryLoading, isError: isRegistryError } = useRegistry<TagRegistry>("tags/enchantment");
    const assembleDatapack = compile();

    const getValues = (identifier: Identifier) => {
        const tagData = assembleDatapack.find((element) => new Identifier(getLabeledIdentifier(element)).equals(identifier));
        const rawData = tagData?.type !== "deleted" ? tagData?.element : undefined;
        const initialValues = rawData && isTag(rawData) ? new Tags(rawData).fromRegistry() : [];

        const data = tags?.[identifier.resource];
        const originalValues = data ? new Tags(data).fromRegistry() : [];
        const combined = new Set([...initialValues, ...originalValues]);
        return Array.from(combined);
    };

    return (
        <>
            <ToolCategory title={{ key: "tools.enchantments.section.exclusive.vanilla.title" }}>
                <ToolGrid>
                    {vanillaGroups.map(({ id, image, value }) => (
                        <ToolSlot
                            key={id}
                            title={{ key: `tools.enchantments.section.exclusive.set.${id}.title` }}
                            description={{ key: `tools.enchantments.section.exclusive.set.${id}.description` }}
                            image={`/images/features/item/${image}.webp`}
                            action={new EnchantmentActionBuilder().setExclusiveSetWithTags(value).build()}
                            renderer={(el) => el.exclusiveSet === value}
                            lock={[isMinecraft]}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            <ToolCategory title={{ key: "tools.enchantments.section.exclusive.custom.title" }}>
                <ToolGrid>
                    {enchantments.length === 0 && (
                        <p className="text-zinc-400 p-4">
                            <Translate content={{ key: "tools.enchantments.section.exclusive.custom.fallback" }} />
                        </p>
                    )}

                    {isRegistryLoading && <p className="text-xs text-zinc-400 py-2">Chargement du registre...</p>}
                    {isRegistryError && <p className="text-xs text-red-400 py-2">Erreur de chargement du registre.</p>}

                    {enchantments.map((enchantment) => {
                        const identifierString = new Identifier(enchantment.identifier).toString();
                        return (
                            <ToolListOption
                                key={identifierString}
                                title={new Identifier(enchantment.identifier).toResourceName()}
                                description={new Identifier(enchantment.identifier).toResourcePath()}
                                image="/icons/logo.svg"
                                values={getValues(new Identifier(enchantment.identifier))}
                                action={new EnchantmentActionBuilder().toggleEnchantmentToExclusiveSet(identifierString).build()}
                                renderer={(el) => el.exclusiveSet === identifierString}
                            />
                        );
                    })}
                </ToolGrid>
            </ToolCategory>
        </>
    );
}
