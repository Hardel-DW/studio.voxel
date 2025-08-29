import type { ComponentType } from "react";
import { CONCEPTS } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";

type WithConceptProps = {};

/**
 * HOC to handle the conditional rendering of concepts
 * @param WrappedComponent The component to wrap
 * @returns A new component with the concept logic
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
