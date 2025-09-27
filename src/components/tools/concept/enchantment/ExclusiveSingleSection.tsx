import { Identifier, type Enchantment } from "@voxelio/breeze";
import Loader from "@/components/ui/Loader";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import { useConfiguratorStore } from "@/components/tools/Store";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { EnchantmentCategory } from "@/components/tools/concept/enchantment/EnchantmentCategory";

export function ExclusiveSingleSection() {
    const enchantments = useConfiguratorStore((state) => state.getRegistry<Enchantment>("enchantment"));
    const { data, isLoading, isError } = useRegistry<FetchedRegistry<Enchantment>>("summary", "enchantment");

    const identifiers = enchantments.map((enchantment) => new Identifier(enchantment.identifier));
    const vanillaIdentifiers = Object.keys(data ?? {}).map((key) => Identifier.of("minecraft:" + key, "enchantment"));

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
