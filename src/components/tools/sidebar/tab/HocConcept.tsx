
import type { ComponentType } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { CONCEPTS } from "@/components/tools/elements";

type WithConceptProps = {};

/**
 * HOC pour gérer le rendu conditionnel des concepts
 * @param WrappedComponent Le composant à wrapper
 * @returns Un nouveau composant avec la logique de concept
 */
export const withConcept = <P extends WithConceptProps>(WrappedComponent: ComponentType<P>) => {
    return function ConceptContainer(props: P) {
        const selectedConcept = useConfiguratorStore((state) => state.selectedConcept);
        const isValidConcept = CONCEPTS.some((concept) => concept.registry === selectedConcept);

        if (!isValidConcept) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};
