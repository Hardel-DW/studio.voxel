import { useConfiguratorStore } from "@/components/tools/Store";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import { Datapack, EnchantmentActionBuilder, type EnchantmentProps, Identifier } from "@voxelio/breeze";

export default function ExclusiveSingle() {
    const files = useConfiguratorStore((state) => state.files);
    const enchantments = new Datapack(files).getRegistry("enchantment");

    return (
        <ToolGrid>
            {enchantments.map((enchantment) => (
                <ToolInline
                    key={enchantment.identifier.registry}
                    title={new Identifier(enchantment.identifier).toResourceName()}
                    description={enchantment.identifier.namespace}
                    action={new EnchantmentActionBuilder()
                        .toggleEnchantmentToExclusiveSet(new Identifier(enchantment.identifier).toString())
                        .build()}
                    renderer={(el: EnchantmentProps) => el.exclusiveSet === new Identifier(enchantment.identifier).toString()}
                />
            ))}
        </ToolGrid>
    );
}
