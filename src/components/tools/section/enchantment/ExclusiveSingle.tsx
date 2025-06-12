import { useConfiguratorStore } from "@/components/tools/Store";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";
import { Datapack, Identifier } from "@voxelio/breeze";
import type { Action, ValueRenderer } from "@voxelio/breeze/core";

const generateAction = (identifier: Identifier): Action => {
    return {
        type: "sequential",
        actions: [
            {
                type: "remove_value_from_list",
                field: "tags",
                value: {
                    type: "get_value_from_field",
                    field: "exclusiveSet"
                },
                mode: ["if_type_string"]
            },
            {
                type: "toggle_value_in_list",
                field: "exclusiveSet",
                mode: ["remove_if_empty", "override"],
                value: new Identifier(identifier).toString()
            }
        ]
    };
};

const generateRenderer = (identifier: Identifier): ValueRenderer => {
    return {
        type: "conditionnal",
        return_condition: true,
        term: {
            condition: "contains",
            field: "exclusiveSet",
            values: [new Identifier(identifier).toString()]
        }
    };
};

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
                    action={generateAction(new Identifier(enchantment.identifier))}
                    renderer={generateRenderer(new Identifier(enchantment.identifier))}
                />
            ))}
        </ToolGrid>
    );
}
