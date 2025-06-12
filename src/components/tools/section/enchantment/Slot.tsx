import Translate from "@/components/tools/Translate";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import type { Action, ValueRenderer } from "@voxelio/breeze/core";
import React from "react";

const generateAction = (slot: string): Action => {
    return {
        type: "set_computed_slot",
        field: "slots",
        value: slot
    };
};

const generateRenderer = (slot: string[]): ValueRenderer => {
    return {
        type: "conditionnal",
        return_condition: true,
        term: {
            condition: "contains",
            field: "slots",
            values: slot
        }
    };
};

export default function EnchantSlotsSection() {
    return (
        <ToolSection id="slots" title={{ key: "tools.enchantments.section.slots.description" }}>
            <ToolGrid>
                <ToolSlot
                    title={{ key: "tools.enchantments.section.slots.mainhand.title" }}
                    image="/images/features/slots/mainhand.webp"
                    action={generateAction("mainhand")}
                    renderer={generateRenderer(["mainhand", "any", "hand"])}
                />
                <ToolSlot
                    title={{ key: "tools.enchantments.section.slots.offhand.title" }}
                    image="/images/features/slots/offhand.webp"
                    action={generateAction("offhand")}
                    renderer={generateRenderer(["offhand", "any", "hand"])}
                />
            </ToolGrid>
            <ToolGrid>
                <ToolSlot
                    title={{ key: "tools.enchantments.section.slots.body.title" }}
                    image="/images/features/slots/body.webp"
                    action={generateAction("body")}
                    renderer={generateRenderer(["body", "any"])}
                />
                <ToolSlot
                    title={{ key: "tools.enchantments.section.slots.saddle.title" }}
                    image="/images/features/slots/saddle.webp"
                    action={generateAction("saddle")}
                    renderer={generateRenderer(["saddle", "any"])}
                />
            </ToolGrid>
            <ToolGrid>
                <ToolSlot
                    title={{ key: "tools.enchantments.section.slots.head.title" }}
                    image="/images/features/slots/head.webp"
                    action={generateAction("head")}
                    renderer={generateRenderer(["head", "any", "armor"])}
                />
                <ToolSlot
                    title={{ key: "tools.enchantments.section.slots.chest.title" }}
                    image="/images/features/slots/chest.webp"
                    action={generateAction("chest")}
                    renderer={generateRenderer(["chest", "any", "armor"])}
                />
                <ToolSlot
                    title={{ key: "tools.enchantments.section.slots.legs.title" }}
                    image="/images/features/slots/legs.webp"
                    action={generateAction("legs")}
                    renderer={generateRenderer(["legs", "any", "armor"])}
                />
                <ToolSlot
                    title={{ key: "tools.enchantments.section.slots.feet.title" }}
                    image="/images/features/slots/feet.webp"
                    action={generateAction("feet")}
                    renderer={generateRenderer(["feet", "any", "armor"])}
                />
            </ToolGrid>

            <div className="flex flex-col gap-4 p-4">
                <div>
                    <p className="text-zinc-300">
                        <Translate content={{ key: "tools.enchantments.section.slots.explanation.title" }} />
                    </p>
                </div>
                <div>
                    <ul className="list-disc list-inside space-y-2">
                        <li className="text-zinc-400">
                            <Translate content={{ key: "tools.enchantments.section.slots.explanation.list.1" }} />
                        </li>
                        <li className="text-zinc-400">
                            <Translate content={{ key: "tools.enchantments.section.slots.explanation.list.2" }} />
                        </li>
                    </ul>
                </div>
            </div>
        </ToolSection>
    );
}
