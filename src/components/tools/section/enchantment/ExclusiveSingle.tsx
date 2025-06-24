import { useConfiguratorStore } from "@/components/tools/Store";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { Datapack, EnchantmentActionBuilder, type EnchantmentProps, Identifier } from "@voxelio/breeze";
import type { Enchantment } from "@voxelio/breeze/schema";
import ToolCategory from "../../elements/ToolCategory";
import Loader from "@/components/ui/Loader";
import ErrorPlaceholder from "../../elements/error/Card";
import type { TranslateTextType } from "@/components/tools/Translate";

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

export default function ExclusiveSingle() {
    const files = useConfiguratorStore((state) => state.files);
    const enchantments = new Datapack(files).getRegistry("enchantment");
    const { data: vanilla, isLoading, isError } = useRegistry<FetchedRegistry<Enchantment>>("enchantment");

    const identifiers = enchantments.map((enchantment) => new Identifier(enchantment.identifier));
    const vanillaIdentifiers = Object.keys(vanilla ?? {}).map((key) => Identifier.of(`minecraft:${key}`, "enchantment"));

    return (
        <>
            <EnchantmentCategory title={{ key: "enchantment:exclusive.custom.title" }} identifiers={identifiers} />
            {isLoading && <Loader />}
            {isError && <ErrorPlaceholder error={new Error("Erreur de chargement du registre.")} />}
            {vanillaIdentifiers.length > 0 && <EnchantmentCategory title={{ key: "enchantment:exclusive.vanilla.title" }} identifiers={vanillaIdentifiers} />}
        </>
    );
}
