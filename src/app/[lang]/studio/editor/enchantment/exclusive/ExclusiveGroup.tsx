import React from "react";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import { useConfiguratorStore } from "@/components/tools/Store";
import { collectFromPath, getLabeledIdentifier, getTagsFromRegistry, Identifier, isTag } from "@voxelio/breeze";
import Translate from "@/components/tools/Translate";
import { getRegistry } from "@/lib/utils/registry";
import ToolListOption from "@/components/tools/elements/ToolListOption";

// Vanilla exclusive groups avec seulement les propriétés essentielles
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
    const enchantments = collectFromPath("tags/enchantment", files, "exclusive_set", ["minecraft"]);
    const { data: tags, isLoading: isRegistryLoading, isError: isRegistryError } = getRegistry("tags/enchantment");
    const assembleDatapack = compile();

    const getValues = (identifier: Identifier) => {
        const tagData = assembleDatapack.find((element) => new Identifier(getLabeledIdentifier(element)).equals(identifier));
        const rawData = tagData?.type !== "deleted" ? tagData?.element : undefined;
        const initialValues = rawData && isTag(rawData) ? rawData.data.values.map((v) => (typeof v === "string" ? v : v.id)) : [];

        const data = tags?.[identifier.resource];
        const originalValues = data ? getTagsFromRegistry(data) : [];
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
                            action={{
                                type: "sequential",
                                actions: [
                                    {
                                        type: "remove_value_from_list",
                                        field: "tags",
                                        value: value
                                    },
                                    {
                                        type: "toggle_value",
                                        value: value,
                                        field: "exclusiveSet"
                                    }
                                ]
                            }}
                            renderer={{
                                type: "conditionnal",
                                return_condition: true,
                                term: {
                                    condition: "compare_value_to_field_value",
                                    field: "exclusiveSet",
                                    value: value
                                }
                            }}
                            lock={[
                                {
                                    text: { key: "tools.disabled_because_vanilla" },
                                    condition: {
                                        condition: "object",
                                        field: "identifier",
                                        terms: {
                                            condition: "compare_value_to_field_value",
                                            field: "namespace",
                                            value: "minecraft"
                                        }
                                    }
                                }
                            ]}
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

                    {enchantments.map((enchantment) => (
                        <ToolListOption
                            key={new Identifier(enchantment.identifier).toString()}
                            title={new Identifier(enchantment.identifier).toResourceName()}
                            description={new Identifier(enchantment.identifier).toResourcePath()}
                            image="/icons/logo.svg"
                            values={getValues(new Identifier(enchantment.identifier))}
                            action={{
                                type: "sequential",
                                actions: [
                                    {
                                        type: "remove_value_from_list",
                                        field: "tags",
                                        value: new Identifier(enchantment.identifier).toString()
                                    },
                                    {
                                        type: "toggle_value",
                                        value: new Identifier(enchantment.identifier).toString(),
                                        field: "exclusiveSet"
                                    }
                                ]
                            }}
                            renderer={{
                                type: "conditionnal",
                                return_condition: true,
                                term: {
                                    condition: "compare_value_to_field_value",
                                    field: "exclusiveSet",
                                    value: new Identifier(enchantment.identifier).toString()
                                }
                            }}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>
        </>
    );
}
