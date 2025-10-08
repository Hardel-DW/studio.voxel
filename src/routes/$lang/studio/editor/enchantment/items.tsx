import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import { useState } from "react";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { enchantableItems } from "@/lib/data/tags";

const elements = [
    { id: "supportedItems", title: "enchantment:toggle.supported.title" },
    { id: "primaryItems", title: "enchantment:toggle.primary.title" }
];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/items")({
    component: EnchantmentItemsPage
});

function EnchantmentItemsPage() {
    const [section, setSection] = useState<string>(elements[0].id);

    return (
        <ToolSectionSelector
            id="slots"
            title="enchantment:section.supported.description"
            elements={elements}
            value={section}
            setValue={setSection}>
            <ToolGrid>
                {Object.keys(enchantableItems).map((item) => (
                    <ToolSlot
                        key={item}
                        title={`enchantment:supported.${item}.title`}
                        image={`/images/features/item/${item}.webp`}
                        action={CoreAction.setValue(section, enchantableItems[item as keyof typeof enchantableItems])}
                        renderer={(el: EnchantmentProps) => el[section] === enchantableItems[item as keyof typeof enchantableItems]}
                    />
                ))}

                {section === "primaryItems" && (
                    <ToolSlot
                        title="enchantment:supported.none.title"
                        image="/images/tools/cross.webp"
                        action={CoreAction.setUndefined("primaryItems")}
                        renderer={(el: EnchantmentProps) => el.primaryItems === undefined}
                    />
                )}
            </ToolGrid>
        </ToolSectionSelector>
    );
}
