import { createFileRoute } from "@tanstack/react-router";
import type { Analysers } from "@voxelio/breeze";
import { type EnchantmentSortCriteria, EnchantmentSorter, type EnchantmentGroup, getItemFromMultipleOrOne, Identifier, isVoxel } from "@voxelio/breeze";
import { useState } from "react";
import EnchantOverviewCard from "@/components/tools/concept/enchantment/EnchantOverviewCard";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { Toolbar } from "@/components/ui/FloatingBar/Toolbar";
import { ToolbarButton } from "@/components/ui/FloatingBar/ToolbarButton";
import { ToolbarDropdown } from "@/components/ui/FloatingBar/ToolbarDropdown";
import { ToolbarSearch } from "@/components/ui/FloatingBar/ToolbarSearch";
import useTagManager from "@/lib/hook/useTagManager";
import { exclusiveSetGroups } from "@/lib/data/exclusive";
import { enchantableItems } from "@/lib/data/tags";

type EnchantmentProps = Analysers["enchantment"]["voxel"];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/overview")({
    component: Page
});

function Page() {
    const [isDetailed, setIsDetailed] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [sortCriteria, setSortCriteria] = useState<EnchantmentSortCriteria | "none">("none");
    const elements = useConfiguratorStore((state) => state.elements);
    const baseElements = [...elements.values()]
        .filter((el) => isVoxel(el, "enchantment"))
        .filter((el) => !searchValue || el.identifier.resource.toLowerCase().includes(searchValue.toLowerCase())) as EnchantmentProps[];

    const isGroupView = sortCriteria !== "none";
    const filteredElements = isGroupView
        ? new EnchantmentSorter(baseElements).groupBy(sortCriteria).sort((a, b) => b.enchantments.length - a.enchantments.length)
        : baseElements;

    const sortOptions = [
        { value: "supportedItems", label: "Supported Items", description: "Sort by supported items" },
        { value: "exclusiveSet", label: "Exclusive Set", description: "Sort by exclusive set" },
        { value: "slots", label: "Slots", description: "Sort by equipment slots" },
        { value: "none", label: "Sans Filtre", description: "No grouping" }
    ];

    return (
        <div>
            <Toolbar>
                <ToolbarSearch placeholder="Search enchantments..." value={searchValue} onChange={setSearchValue} />
                <div className="flex items-center">
                    <ToolbarDropdown
                        icon="/icons/tools/overview/filter.svg"
                        tooltip={`Sort by: ${sortOptions.find((opt) => opt.value === sortCriteria)?.label}`}
                        value={sortCriteria}
                        options={sortOptions}
                        onChange={(value: string) => setSortCriteria(value as EnchantmentSortCriteria | "none")}
                    />
                    <ToolbarButton
                        icon={`/icons/tools/overview/${isDetailed ? "map" : "list"}.svg`}
                        tooltip={isDetailed ? "Minimal view" : "Detailed view"}
                        onClick={() => setIsDetailed(!isDetailed)}
                    />
                </div>
            </Toolbar>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold uppercase">Overview</h1>
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
                            <SlotGroup group={group} sortCriteria={sortCriteria}>
                                {group.enchantments.map((element) => (
                                    <EnchantmentCard key={element.identifier.resource} element={element} isDetailed={isDetailed} />
                                ))}
                            </SlotGroup>
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
    );
}

function EnchantmentCard({ element, isDetailed }: { element: EnchantmentProps, isDetailed: boolean }) {
    const { getAllItemsFromTag } = useTagManager();
    const { isTag, id } = getItemFromMultipleOrOne(element.supportedItems);

    return (
        <EnchantOverviewCard
            key={new Identifier(element.identifier).toUniqueKey()}
            element={element}
            items={isTag ? getAllItemsFromTag(id) : [id]}
            elementId={new Identifier(element.identifier).toUniqueKey()}
            display={isDetailed}
        />
    );
}

function SlotGroup({ group, sortCriteria, children }: { group: EnchantmentGroup, sortCriteria: string, children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const getGroupTranslation = (type: string, groupKey: string) => {
        const firstKey = groupKey.split(',')[0];

        switch (type) {
            case "slots":
                return <Translate content={`enchantment:slots.${firstKey}.title`} />;
            case "exclusiveSet": {
                const exclusiveGroup = exclusiveSetGroups.find(group => group.value === firstKey);
                if (exclusiveGroup) {
                    return <Translate content={`enchantment:exclusive.set.${exclusiveGroup.id}.title`} />;
                }
                return Identifier.of(firstKey, "exclusive_set").toResourceName();
            }
            case "supportedItems": {
                const supportedEntry = Object.entries(enchantableItems).find(([_, value]) => value === firstKey);
                if (supportedEntry) {
                    return <Translate content={`enchantment:supported.${supportedEntry[0]}.title`} />;
                }
                return Identifier.of(firstKey, "enchantable").toResourceName();
            }
            default:
                return firstKey;
        }
    };

    const getGroupDescription = (type: string, groupKey: string) => {
        const firstKey = groupKey.split(',')[0];

        switch (type) {
            case "slots":
                return <Translate content={`enchantment:slots.${firstKey}.description`} />;
            case "exclusiveSet": {
                const exclusiveGroup = exclusiveSetGroups.find(group => group.value === firstKey);
                if (exclusiveGroup) {
                    return <Translate content={`enchantment:exclusive.set.${exclusiveGroup.id}.description`} />;
                }
                return null;
            }
            case "supportedItems": {
                return null; // Pas de description pour supportedItems
            }
            default:
                return null;
        }
    };

    return (
        <div key={group.key} className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/50">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-zinc-200">
                            {getGroupTranslation(sortCriteria, group.key)}
                        </h2>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
                            {group.enchantments.length} <Translate content="elements" />
                        </span>
                    </div>
                    {getGroupDescription(sortCriteria, group.key) && (
                        <p className="text-sm text-zinc-500">
                            {getGroupDescription(sortCriteria, group.key)}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-4 p-1 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                    title={isCollapsed ? "Show items" : "Hide items"}
                >
                    <img
                        src="/icons/chevron-down.svg"
                        alt="This button will show or hide the items in the group"
                        className={`w-6 h-6 invert opacity-75 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : "rotate-0"}`}
                    />
                </button>
            </div>
            {!isCollapsed && (
                <div
                    className="grid gap-4 mt-6"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gridAutoRows: "masonry"
                    }}>
                    {children}
                </div>
            )}
        </div>
    );
}