import { createFileRoute } from "@tanstack/react-router";
import { Datapack, EnchantmentActionBuilder, type EnchantmentProps, Identifier } from "@voxelio/breeze";
import type { Enchantment } from "@voxelio/breeze/schema";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import { useConfiguratorStore } from "@/components/tools/Store";
import type { TranslateTextType } from "@/components/tools/Translate";
import Loader from "@/components/ui/Loader";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/exclusive/single")({
    component: Page
});

function Page() {
    const files = useConfiguratorStore((state) => state.files);
    const enchantments = new Datapack(files).getRegistry("enchantment");
    const { data: vanilla, isLoading, isError } = useRegistry<FetchedRegistry<Enchantment>>("enchantment", "summary");

    const identifiers = enchantments.map((enchantment) => new Identifier(enchantment.identifier));
    const vanillaIdentifiers = Object.keys(vanilla ?? {}).map((key) => Identifier.of(`minecraft:${key}`, "enchantment"));

    return (
        <>
            <EnchantmentCategory title={{ key: "enchantment:exclusive.custom.title" }} identifiers={identifiers} />
            {isLoading && <Loader />}
            {isError && <ErrorPlaceholder error={new Error("Erreur de chargement du registre.")} />}
            {vanillaIdentifiers.length > 0 && (
                <EnchantmentCategory title={{ key: "enchantment:exclusive.vanilla.title" }} identifiers={vanillaIdentifiers} />
            )}
        </>
    );
}

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
