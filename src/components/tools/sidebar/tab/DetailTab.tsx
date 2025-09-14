import { Link, useLocation, useParams } from "@tanstack/react-router";
import { CONCEPTS } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import SidebarCrafting from "@/components/tools/sidebar/crafting/SidebarCrafting";
import SidebarEnchant from "@/components/tools/sidebar/enchant/SidebarEnchant";
import SidebarLoot from "@/components/tools/sidebar/loot/SidebarLoot";
import SidebarStructure from "@/components/tools/sidebar/structure/SidebarStructure";
import { withConcept } from "@/components/tools/sidebar/tab/HocConcept";

export default function DetailTab() {
    const location = useLocation();
    const getConcept = useConfiguratorStore((state) => state.getConcept);
    const selectedConcept = getConcept(location.pathname);
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);
    const { lang } = useParams({ from: "/$lang" });

    const contentMap = {
        enchantment: withConcept(SidebarEnchant),
        loot_table: withConcept(SidebarLoot),
        recipe: withConcept(SidebarCrafting),
        structure: withConcept(SidebarStructure)
    };

    const handleOverviewClick = () => {
        setCurrentElementId(null);
    };

    const Component = contentMap[selectedConcept as keyof typeof contentMap];
    const currentConcept = CONCEPTS.find((concept) => concept.registry === selectedConcept);

    return (
        <div className="flex flex-col gap-4">
            {currentConcept && (
                <Link
                    to={currentConcept.overview}
                    params={{ lang }}
                    onClick={handleOverviewClick}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 bg-transparent border-0 p-0">
                    Overview
                </Link>
            )}
            <div className="flex flex-col gap-2">{Component && <Component />}</div>
        </div>
    );
}
