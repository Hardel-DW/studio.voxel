import { createFileRoute } from "@tanstack/react-router";
import {
    Datapack,
    EnchantmentActionBuilder,
    type EnchantmentProps,
    getLabeledIdentifier,
    Identifier,
    isTag,
    type TagRegistry,
    Tags
} from "@voxelio/breeze";
import type { Enchantment } from "@voxelio/breeze/schema";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import ToolListOption from "@/components/tools/elements/ToolListOption";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate, { type TranslateTextType } from "@/components/tools/Translate";
import Loader from "@/components/ui/Loader";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { isMinecraft } from "@/lib/utils/lock";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/exclusive")({
    validateSearch: (search: Record<string, unknown>) => ({
        mode: search.mode as "group" | "single" | undefined
    }),
    component: EnchantmentExclusivePage
});

const vanillaGroups = [
    { id: "armor", image: "armor", value: "#minecraft:exclusive_set/armor" },
    { id: "bow", image: "bow", value: "#minecraft:exclusive_set/bow" },
    { id: "crossbow", image: "crossbow", value: "#minecraft:exclusive_set/crossbow" },
    { id: "damage", image: "sword", value: "#minecraft:exclusive_set/damage" },
    { id: "riptide", image: "trident", value: "#minecraft:exclusive_set/riptide" },
    { id: "mining", image: "mining_loot", value: "#minecraft:exclusive_set/mining" },
    { id: "boots", image: "foot_armor", value: "#minecraft:exclusive_set/boots" }
];

const elements = [
    {
        id: "group",
        title: "enchantment:toggle.group.title"
    },
    {
        id: "single",
        title: "enchantment:toggle.individual.title"
    }
];

function EnchantmentCategory({ title, identifiers }: { title: TranslateTextType; identifiers: Identifier[] }) {
    return (
        <ToolCategory title={title}>
            <ToolGrid>
                {identifiers.map((identifier) => (
                    <ToolInline
                        key={identifier.toUniqueKey()}
                        title={identifier.toResourceName()}
                        description={identifier.namespace}
                        action={new EnchantmentActionBuilder().toggleEnchantmentToExclusiveSet(identifier.toString()).build()}
                        renderer={(el: EnchantmentProps) =>
                            Array.isArray(el.exclusiveSet)
                                ? el.exclusiveSet.includes(identifier.toString())
                                : el.exclusiveSet === identifier.toString()
                        }
                    />
                ))}
            </ToolGrid>
        </ToolCategory>
    );
}

function ExclusiveGroupSection() {
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
            <ToolCategory title="enchantment:exclusive.vanilla.title">
                <ToolGrid>
                    {vanillaGroups.map(({ id, image, value }) => (
                        <ToolSlot
                            key={id}
                            title={`enchantment:exclusive.set.${id}.title`}
                            description={`enchantment:exclusive.set.${id}.description`}
                            image={`/images/features/item/${image}.webp`}
                            action={new EnchantmentActionBuilder().setExclusiveSetWithTags(value).build()}
                            renderer={(el) => el.exclusiveSet === value}
                            lock={[isMinecraft]}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            <ToolCategory title="enchantment:exclusive.custom.title">
                <div
                    className="grid items-stretch gap-4"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))"
                    }}>
                    {enchantments.length === 0 && (
                        <p className="text-zinc-400 p-4">
                            <Translate content="enchantment:exclusive.custom.fallback" />
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

function ExclusiveSingleSection() {
    const files = useConfiguratorStore((state) => state.files);
    const enchantments = new Datapack(files).getRegistry("enchantment");
    const { data: vanilla, isLoading, isError } = useRegistry<FetchedRegistry<Enchantment>>("enchantment", "summary");

    const identifiers = enchantments.map((enchantment) => new Identifier(enchantment.identifier));
    const vanillaIdentifiers = Object.keys(vanilla ?? {}).map((key) => Identifier.of(`minecraft:${key}`, `enchantment`));

    return (
        <>
            <EnchantmentCategory title="enchantment:exclusive.custom.title" identifiers={identifiers} />
            {isLoading && <Loader />}
            {isError && <ErrorPlaceholder error={new Error("Erreur de chargement du registre.")} />}
            {vanillaIdentifiers.length > 0 && (
                <EnchantmentCategory title="enchantment:exclusive.vanilla.title" identifiers={vanillaIdentifiers} />
            )}
        </>
    );
}

function EnchantmentExclusivePage() {
    const { mode } = Route.useSearch();
    const currentMode = mode || "group";

    return (
        <div className="h-full">
            <div className="flex items flex-col pt-4 h-full">
                <ToolSectionSelector
                    id="exclusive"
                    title="enchantment:section.exclusive.description"
                    elements={elements}
                    searchParam="mode"
                    useUrlSync={true}
                    defaultValue="group">
                    {currentMode === "group" && <ExclusiveGroupSection />}
                    {currentMode === "single" && <ExclusiveSingleSection />}
                </ToolSectionSelector>
            </div>
        </div>
    );
}
