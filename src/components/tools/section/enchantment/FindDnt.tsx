import React from "react";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import ToolCard from "@/components/tools/elements/ToolCard";
import type { Action, ValueRenderer } from "@voxelio/breeze/core";

const generateToggleAction = (value: string): Action => {
    return {
        type: "toggle_value_in_list",
        field: "tags",
        value: value
    };
};

const generateRenderer = (value: string): ValueRenderer => {
    return {
        type: "conditionnal",
        return_condition: true,
        term: {
            condition: "contains",
            field: "tags",
            values: [value]
        }
    };
};

// Structure data for global biomes section
const biomeStructures = [
    {
        title: "tools.enchantments.section.addons.dnt.overworld.title",
        description: "tools.enchantments.section.addons.dnt.overworld.description",
        image: "/images/features/structure/overworld.webp",
        tag: "#nova_structures:structure/overworld"
    },
    {
        title: "tools.enchantments.section.addons.dnt.underwater.title",
        description: "tools.enchantments.section.addons.dnt.underwater.description",
        image: "/images/features/structure/underwater.webp",
        tag: "#nova_structures:structure/underwater"
    },
    {
        title: "tools.enchantments.section.addons.dnt.nether.title",
        description: "tools.enchantments.section.addons.dnt.nether.description",
        image: "/images/features/structure/nether.webp",
        tag: "#nova_structures:structure/nether"
    },
    {
        title: "tools.enchantments.section.addons.dnt.end.title",
        description: "tools.enchantments.section.addons.dnt.end.description",
        image: "/images/features/structure/end.webp",
        tag: "#nova_structures:structure/end"
    }
];

// Structure data for specific structures section
const specificStructures = [
    {
        title: "tools.enchantments.section.addons.dnt.creeping_crypt.title",
        description: "tools.enchantments.section.addons.dnt.creeping_crypt.description",
        image: "/images/addons/card/dnt/creeping_crypt.webp",
        tag: "#nova_structures:structure/creeping_crypt"
    },
    {
        title: "tools.enchantments.section.addons.dnt.nether_keep.title",
        description: "tools.enchantments.section.addons.dnt.nether_keep.description",
        image: "/images/addons/card/dnt/piglin_outstation.webp",
        tag: "#nova_structures:structure/nether_keep"
    },
    {
        title: "tools.enchantments.section.addons.dnt.illager.title",
        description: "tools.enchantments.section.addons.dnt.illager.description",
        image: "/images/addons/card/dnt/illager_manor.webp",
        tag: "#nova_structures:structure/illager"
    },
    {
        title: "tools.enchantments.section.addons.dnt.illager_outpost.title",
        description: "tools.enchantments.section.addons.dnt.illager_outpost.description",
        image: "/images/addons/card/dnt/illager_hideout.webp",
        tag: "#nova_structures:structure/illager_outpost"
    },
    {
        title: "tools.enchantments.section.addons.dnt.pale_residence.title",
        description: "tools.enchantments.section.addons.dnt.pale_residence.description",
        image: "/images/addons/card/dnt/pale_residence.webp",
        tag: "#nova_structures:structure/pale_residence"
    },
    {
        title: "tools.enchantments.section.addons.dnt.shrine.title",
        description: "tools.enchantments.section.addons.dnt.shrine.description",
        image: "/images/addons/card/dnt/shrine.webp",
        tag: "#nova_structures:structure/shrine"
    },
    {
        title: "tools.enchantments.section.addons.dnt.shrine_ominous.title",
        description: "tools.enchantments.section.addons.dnt.shrine_ominous.description",
        image: "/images/addons/card/dnt/shrine_ominous.webp",
        tag: "#nova_structures:structure/shrine_ominous"
    },
    {
        title: "tools.enchantments.section.addons.dnt.snowy.title",
        description: "tools.enchantments.section.addons.dnt.snowy.description",
        image: "/images/addons/card/dnt/stay_fort.webp",
        tag: "#nova_structures:structure/snowy"
    },
    {
        title: "tools.enchantments.section.addons.dnt.toxic_lair.title",
        description: "tools.enchantments.section.addons.dnt.toxic_lair.description",
        image: "/images/addons/card/dnt/toxic_lair.webp",
        tag: "#nova_structures:structure/toxic_lair"
    }
];

export default function EnchantDNT() {
    return (
        <>
            {/* Global Category */}
            <ToolCategory title={{ key: "tools.enchantments.section.addons.dnt.global.title" }}>
                <ToolGrid size="250px">
                    {biomeStructures.map((structure) => (
                        <ToolSlot
                            key={structure.tag}
                            title={{ key: structure.title }}
                            description={{ key: structure.description }}
                            image={structure.image}
                            size={128}
                            action={generateToggleAction(structure.tag)}
                            renderer={generateRenderer(structure.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            {/* Structures Category */}
            <ToolCategory title={{ key: "tools.enchantments.section.addons.dnt.structures.title" }}>
                <ToolGrid size="400px">
                    {specificStructures.map((structure) => (
                        <ToolCard
                            key={structure.tag}
                            title={{ key: structure.title }}
                            description={{ key: structure.description }}
                            image={structure.image}
                            action={generateToggleAction(structure.tag)}
                            renderer={generateRenderer(structure.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>
        </>
    );
}
