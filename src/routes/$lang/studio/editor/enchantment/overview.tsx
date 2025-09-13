import { createFileRoute } from "@tanstack/react-router";
import {
    EnchantmentActionBuilder,
    type EnchantmentGroup,
    type EnchantmentProps,
    type EnchantmentSortCriteria,
    EnchantmentSorter
} from "@voxelio/breeze";
import { useState } from "react";
import EnchantmentCard from "@/components/tools/concept/enchantment/EnchantmentCard";
import OverviewGroupCard from "@/components/tools/concept/enchantment/OverviewGroupCard";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarButton } from "@/components/tools/floatingbar/ToolbarButton";
import { ToolbarDropdown } from "@/components/tools/floatingbar/ToolbarDropdown";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { DragDropProvider } from "@/components/ui/DragDrop";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useTranslateKey } from "@/lib/hook/useTranslation";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/overview")({
    component: Page
});

const sortOptions = [
    {
        key: "supported",
        value: "supportedItems",
        label: "enchantment:overview.sort.supported.label",
        description: "enchantment:overview.sort.supported.description"
    },
    {
        key: "exclusive",
        value: "exclusiveSet",
        label: "enchantment:overview.sort.exclusive.label",
        description: "enchantment:overview.sort.exclusive.description"
    },
    {
        key: "slots",
        value: "slots",
        label: "enchantment:overview.sort.slots.label",
        description: "enchantment:overview.sort.slots.description"
    },
    { value: "none", label: "enchantment:overview.sort.none.label", description: "enchantment:overview.sort.none.description" }
];

function Page() {
    const [isDetailed, setIsDetailed] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [sortCriteria, setSortCriteria] = useState<EnchantmentSortCriteria | "none">("none");
    const enchantmentElements = useElementsByType("enchantment");
    const baseElements = enchantmentElements.filter(
        (el) => !searchValue || el.identifier.resource.toLowerCase().includes(searchValue.toLowerCase())
    );

    const isGroupView = sortCriteria !== "none";
    const filteredElements = isGroupView ? new EnchantmentSorter(baseElements).groupBy(sortCriteria) : baseElements;

    const sortOption = sortOptions.find((opt) => opt.value === sortCriteria);
    const translatedSortOption = useTranslateKey(sortOption?.label || "enchantment:overview.sort.none.label");
    const translatedSortBy = useTranslateKey("enchantment:overview.sort.by");

    const handleDrop = (dragData: { id: string; category: string }, dropZone: string) => {
        if (sortCriteria === "exclusiveSet") {
            useConfiguratorStore
                .getState()
                .handleChange(new EnchantmentActionBuilder().setExclusiveSetWithTags(dropZone).build(), dragData.id);
        }
    };

    return (
        <DragDropProvider onDrop={handleDrop}>
            <div>
                <Toolbar>
                    <ToolbarSearch placeholder="enchantment:overview.search.placeholder" value={searchValue} onChange={setSearchValue} />
                    <div className="flex items-center">
                        <ToolbarDropdown
                            icon="/icons/tools/overview/filter.svg"
                            tooltip={`${translatedSortBy} ${translatedSortOption}`}
                            value={sortCriteria}
                            options={sortOptions}
                            onChange={(value: string) => setSortCriteria(value as EnchantmentSortCriteria)}
                        />
                        <ToolbarButton
                            icon={`/icons/tools/overview/${isDetailed ? "map" : "list"}.svg`}
                            tooltip={isDetailed ? "enchantment:overview.view.minimal" : "enchantment:overview.view.detailed"}
                            onClick={() => setIsDetailed(!isDetailed)}
                        />
                    </div>
                </Toolbar>

                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold uppercase">
                            <Translate content="enchantment:overview.title" />
                        </h1>
                        <p className="text-sm text-zinc-500">
                            {sortCriteria !== "none" && <Translate content={`enchantment:overview.sort.${sortOption?.key}.section`} />}
                        </p>
                    </div>
                </div>

                <hr className="my-4" />

                {isGroupView ? (
                    <div
                        className="grid gap-6"
                        style={{
                            gridTemplateColumns: "repeat(auto-fit, minmax(max(280px, calc((100% - 1.5rem) / 2)), 1fr))",
                            containerType: "inline-size"
                        }}>
                        {(filteredElements as EnchantmentGroup[]).map((group) => (
                            <div
                                key={group.key}
                                className="slot-group-container"
                                style={{ gridColumn: group.enchantments.length > 8 ? "1 / -1" : "auto" }}>
                                <OverviewGroupCard group={group} sortCriteria={sortCriteria}>
                                    {group.enchantments.map((element) => (
                                        <EnchantmentCard key={element.identifier.resource} element={element} isDetailed={isDetailed} />
                                    ))}
                                </OverviewGroupCard>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                        {(filteredElements as EnchantmentProps[]).map((element) => (
                            <EnchantmentCard key={element.identifier.resource} element={element} isDetailed={isDetailed} />
                        ))}
                    </div>
                )}
            </div>
        </DragDropProvider>
    );
}
