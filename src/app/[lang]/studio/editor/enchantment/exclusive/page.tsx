import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import React from "react";

const elements = [
    {
        id: "group",
        title: { key: "tools.enchantments.section.toggle.exclusive.group.title" }
    },
    {
        id: "single",
        title: { key: "tools.enchantments.section.toggle.exclusive.individual.title" }
    }
];

export default function EnchantSlotsSection() {
    return (
        <ToolSectionSelector id="exclusive" title={{ key: "tools.enchantments.section.exclusive.description" }} elements={elements}>
            {(currentId: string) => {
                const LazyGroup = React.lazy(() => import("./ExclusiveGroup"));
                const LazySingle = React.lazy(() => import("./ExclusiveSingle"));

                if (currentId === "group") {
                    return (
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <LazyGroup />
                        </React.Suspense>
                    );
                }

                if (currentId === "single") {
                    return (
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <LazySingle />
                        </React.Suspense>
                    );
                }

                return null;
            }}
        </ToolSectionSelector>
    );
}
