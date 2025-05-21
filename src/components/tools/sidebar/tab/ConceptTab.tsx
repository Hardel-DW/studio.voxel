"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import SidebarCard from "@/components/tools/sidebar/tab/SidebarCard";
import { CONCEPTS } from "@/components/tools/elements";
import type { Analysers } from "@voxelio/breeze/core";
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
                    description={`${getLengthByRegistry(concept.registry)} Elements`}
                    selected={selectedConcept === concept.registry}
                    onClick={() => setSelectedConcept(concept.registry as keyof Analysers)}
                />
            ))}
        </div>
    );
}
