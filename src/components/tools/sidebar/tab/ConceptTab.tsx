
import { useConfiguratorStore } from "@/components/tools/Store";
import { CONCEPTS } from "@/components/tools/elements";
import SidebarCard from "@/components/tools/sidebar/tab/SidebarCard";
import Translate from "@/components/tools/Translate";

export default function ConceptTab() {
    const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
    const setSelectedConcept = useConfiguratorStore((state) => state.setSelectedConcept);
    const getLengthByRegistry = useConfiguratorStore((state) => state.getLengthByRegistry);

    return (
        <div className="flex flex-col gap-4 mt-4">
            {CONCEPTS.map((concept, index) => (
                <SidebarCard
                    key={concept.title}
                    {...concept}
                    index={index}
                    selected={selectedConcept === concept.registry}
                    onClick={() => setSelectedConcept(concept.registry)}
                >
                    {getLengthByRegistry(concept.registry)} <Translate content="elements" />
                </SidebarCard>
            ))}
        </div>
    );
}
