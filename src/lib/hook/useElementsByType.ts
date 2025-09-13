import type { Analysers } from "@voxelio/breeze";
import { isVoxel } from "@voxelio/breeze";
import { useShallow } from "zustand/shallow";
import { useConfiguratorStore } from "@/components/tools/Store";

export function useElementsByType<T extends keyof Analysers>(elementType: T): Analysers[T]["voxel"][] {
    return useConfiguratorStore(
        useShallow((state) => {
            const elements: Analysers[T]["voxel"][] = [];
            for (const element of state.elements.values()) {
                if (isVoxel(element, elementType)) {
                    elements.push(element);
                }
            }
            return elements;
        })
    );
}
