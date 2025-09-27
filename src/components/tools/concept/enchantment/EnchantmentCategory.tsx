import { EnchantmentActionBuilder, type EnchantmentProps, Identifier } from "@voxelio/breeze";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import type { TranslateTextType } from "@/components/tools/Translate";

interface EnchantmentCategoryProps {
    title: TranslateTextType;
    identifiers: Identifier[];
}

export function EnchantmentCategory({ title, identifiers }: EnchantmentCategoryProps) {
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
