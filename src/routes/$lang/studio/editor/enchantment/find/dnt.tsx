import { createFileRoute } from "@tanstack/react-router";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import ToolCard from "@/components/tools/elements/ToolCard";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSlot from "@/components/tools/elements/ToolSlot";

const biomeStructures = [
    {
        title: "dnt:overworld.title",
        description: "dnt:overworld.description",
        image: "/images/features/structure/overworld.webp",
        tag: "#nova_structures:structure/overworld"
    },
    {
        title: "dnt:underwater.title",
        description: "dnt:underwater.description",
        image: "/images/features/structure/underwater.webp",
        tag: "#nova_structures:structure/underwater"
    },
    {
        title: "dnt:nether.title",
        description: "dnt:nether.description",
        image: "/images/features/structure/nether.webp",
        tag: "#nova_structures:structure/nether"
    },
    {
        title: "dnt:end.title",
        description: "dnt:end.description",
        image: "/images/features/structure/end.webp",
        tag: "#nova_structures:structure/end"
    }
];

// Structure data for specific structures section
const specificStructures = [
    {
        title: "dnt:creeping_crypt.title",
        description: "dnt:creeping_crypt.description",
        image: "/images/addons/card/dnt/creeping_crypt.webp",
        tag: "#nova_structures:structure/creeping_crypt"
    },
    {
        title: "dnt:nether_keep.title",
        description: "dnt:nether_keep.description",
        image: "/images/addons/card/dnt/piglin_outstation.webp",
        tag: "#nova_structures:structure/nether_keep"
    },
    {
        title: "dnt:illager.title",
        description: "dnt:illager.description",
        image: "/images/addons/card/dnt/illager_manor.webp",
        tag: "#nova_structures:structure/illager"
    },
    {
        title: "dnt:illager_outpost.title",
        description: "dnt:illager_outpost.description",
        image: "/images/addons/card/dnt/illager_hideout.webp",
        tag: "#nova_structures:structure/illager_outpost"
    },
    {
        title: "dnt:pale_residence.title",
        description: "dnt:pale_residence.description",
        image: "/images/addons/card/dnt/pale_residence.webp",
        tag: "#nova_structures:structure/pale_residence"
    },
    {
        title: "dnt:shrine.title",
        description: "dnt:shrine.description",
        image: "/images/addons/card/dnt/shrine.webp",
        tag: "#nova_structures:structure/shrine"
    },
    {
        title: "dnt:shrine_ominous.title",
        description: "dnt:shrine_ominous.description",
        image: "/images/addons/card/dnt/shrine_ominous.webp",
        tag: "#nova_structures:structure/shrine_ominous"
    },
    {
        title: "dnt:snowy.title",
        description: "dnt:snowy.description",
        image: "/images/addons/card/dnt/stay_fort.webp",
        tag: "#nova_structures:structure/snowy"
    },
    {
        title: "dnt:toxic_lair.title",
        description: "dnt:toxic_lair.description",
        image: "/images/addons/card/dnt/toxic_lair.webp",
        tag: "#nova_structures:structure/toxic_lair"
    }
];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/find/dnt")({
    component: Page
});

function Page() {
    return (
        <>
            {/* Global Category */}
            <ToolCategory title="dnt:globals">
                <ToolGrid size="250px">
                    {biomeStructures.map((structure) => (
                        <ToolSlot
                            key={structure.tag}
                            title={structure.title}
                            description={structure.description}
                            image={structure.image}
                            size={128}
                            action={new Actions().toggleValueInList("tags", structure.tag).build()}
                            renderer={(el: EnchantmentProps) => el.tags.includes(structure.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>

            {/* Structures Category */}
            <ToolCategory title="dnt:structures">
                <ToolGrid size="400px">
                    {specificStructures.map((structure) => (
                        <ToolCard
                            key={structure.tag}
                            title={structure.title}
                            description={structure.description}
                            image={structure.image}
                            action={new Actions().toggleValueInList("tags", structure.tag).build()}
                            renderer={(el: EnchantmentProps) => el.tags.includes(structure.tag)}
                        />
                    ))}
                </ToolGrid>
            </ToolCategory>
        </>
    );
}
