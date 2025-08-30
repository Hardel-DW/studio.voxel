import { useParams, useRouter } from "@tanstack/react-router";
import { useConfiguratorStore } from "@/components/tools/Store";
import SidebarCrafting from "@/components/tools/sidebar/crafting/SidebarCrafting";
import SidebarEnchant from "@/components/tools/sidebar/enchant/SidebarEnchant";
import SidebarLoot from "@/components/tools/sidebar/loot/SidebarLoot";
import SidebarStructure from "@/components/tools/sidebar/structure/SidebarStructure";
import { withConcept } from "@/components/tools/sidebar/tab/HocConcept";
import { Button } from "@/components/ui/Button";

export default function DetailTab() {
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);
    const router = useRouter();
    const { lang } = useParams({ from: "/$lang" });
    
    const contentMap = {
        enchantment: withConcept(SidebarEnchant),
        loot_table: withConcept(SidebarLoot),
        recipe: withConcept(SidebarCrafting),
        structure: withConcept(SidebarStructure)
    };

    const handleOverviewClick = () => {
        setCurrentElementId(null);
        router.navigate({ to: `/$lang/studio/editor/${selectedConcept}/overview`, params: { lang } });
    };

    const Component = contentMap[selectedConcept as keyof typeof contentMap];
    return (
        <div className="flex flex-col gap-4">
            <Button variant="transparent" size="square" onClick={handleOverviewClick}>
                Overview
            </Button>
            <div className="flex flex-col gap-2">{Component && <Component />}</div>
        </div>
    );
}
