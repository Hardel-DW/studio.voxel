"use client";

import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import React, { useState } from "react";
import Loader from "@/components/ui/Loader";

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
    const [section, setSection] = useState<string>(elements[0].id);
    const LazyGroup = React.lazy(() => import("./ExclusiveGroup"));
    const LazySingle = React.lazy(() => import("./ExclusiveSingle"));

    return (
        <ToolSectionSelector
            id="exclusive"
            title={{ key: "tools.enchantments.section.exclusive.description" }}
            elements={elements}
            value={section}
            setValue={setSection}>
            {section === "group" && (
                <React.Suspense fallback={<Loader />}>
                    <LazyGroup />
                </React.Suspense>
            )}

            {section === "single" && (
                <React.Suspense fallback={<Loader />}>
                    <LazySingle />
                </React.Suspense>
            )}
        </ToolSectionSelector>
    );
}
