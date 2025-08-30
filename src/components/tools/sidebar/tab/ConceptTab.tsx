import { CONCEPTS } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import SidebarCard from "@/components/tools/sidebar/tab/SidebarCard";
import Translate from "@/components/tools/Translate";

export default function ConceptTab() {
    const getLengthByRegistry = useConfiguratorStore((state) => state.getLengthByRegistry);

    return (
        <div className="flex flex-col gap-4 mt-4">
            {CONCEPTS.map((concept, index) => (
                <SidebarCard
                    key={concept.title}
                    title={concept.title}
                    image={concept.image}
                    index={index}
                    registry={concept.registry}
                    overview={concept.overview}>
                    {getLengthByRegistry(concept.registry)} <Translate content="elements" />
                </SidebarCard>
            ))}
        </div>
    );
}
