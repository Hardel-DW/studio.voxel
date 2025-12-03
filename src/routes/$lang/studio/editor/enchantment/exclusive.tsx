import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SimpleStudio from "@/components/layout/SimpleStudio";
import { ExclusiveGroupSection } from "@/components/tools/concept/enchantment/ExclusiveGroupSection";
import { ExclusiveSingleSection } from "@/components/tools/concept/enchantment/ExclusiveSingleSection";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/exclusive")({
    component: EnchantmentExclusivePage
});

const elements = [
    { id: "group", title: "enchantment:toggle.group.title" },
    { id: "single", title: "enchantment:toggle.individual.title" }
];

function EnchantmentExclusivePage() {
    const [mode, setMode] = useState<string>(elements[0].id);

    return (
        <SimpleStudio>
            <div className="flex items flex-col pt-4 h-full">
                <ToolSectionSelector
                    id="exclusive"
                    title="enchantment:section.exclusive.description"
                    elements={elements}
                    value={mode}
                    setValue={(value) => setMode(value)}>
                    {mode === "group" && <ExclusiveGroupSection />}
                    {mode === "single" && <ExclusiveSingleSection />}
                </ToolSectionSelector>
            </div>
        </SimpleStudio>
    );
}
