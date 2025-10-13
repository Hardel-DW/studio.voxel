import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import { useState } from "react";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { useConfiguratorStore } from "@/components/tools/Store";
import { enchantableEntries } from "@/lib/data/tags";
import { VOXEL_TAGS } from "@/lib/data/voxel";

const elements = [
    { id: "supportedItems", title: "enchantment:toggle.supported.title" },
    { id: "primaryItems", title: "enchantment:toggle.primary.title" }
];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/items")({
    component: EnchantmentItemsPage
});

function EnchantmentItemsPage() {
    const [section, setSection] = useState<string>(elements[0].id);
    const addFile = useConfiguratorStore((state) => state.addFile);

    const addTagIfExists = (identifier: { toFilePath: () => string }) => {
        const tagData = VOXEL_TAGS.get(identifier.toFilePath());
        if (tagData) addFile(identifier.toFilePath(), tagData);
    };

    return (
        <ToolSectionSelector
            id="slots"
            title="enchantment:section.supported.description"
            elements={elements}
            value={section}
            setValue={setSection}>
            <ToolGrid>
                {enchantableEntries.map(([key, identifier]) => {
                    const tag = identifier.toString();
                    return (
                        <ToolSlot
                            key={key}
                            title={`enchantment:supported.${key}.title`}
                            image={`/images/features/item/${key}.webp`}
                            action={CoreAction.setValue(section, tag)}
                            renderer={(el: EnchantmentProps) => el[section] === tag}
                            onBeforeChange={() => addTagIfExists(identifier)}
                        />
                    );
                })}

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
