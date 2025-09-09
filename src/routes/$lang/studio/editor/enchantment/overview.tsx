import { createFileRoute } from "@tanstack/react-router";
import type { Analysers } from "@voxelio/breeze";
import { type EnchantmentSortCriteria, EnchantmentSorter, type EnchantmentGroup, getItemFromMultipleOrOne, Identifier, isVoxel } from "@voxelio/breeze";
import { useState } from "react";
import EnchantOverviewCard from "@/components/tools/concept/enchantment/EnchantOverviewCard";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarButton } from "@/components/tools/floatingbar/ToolbarButton";
import { ToolbarDropdown } from "@/components/tools/floatingbar/ToolbarDropdown";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import useTagManager from "@/lib/hook/useTagManager";
import { exclusiveSetGroups } from "@/lib/data/exclusive";
import { enchantableItems } from "@/lib/data/tags";
import { useTranslateKey } from "@/lib/hook/useTranslation";

type EnchantmentProps = Analysers["enchantment"]["voxel"];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/overview")({
    component: Page
});

const GROUP_MAPS = {
    slots: (key: string) => [`enchantment:slots.${key}.title`, `enchantment:slots.${key}.description`],
    exclusiveSet: (key: string) => {
        const group = exclusiveSetGroups.find(g => g.value === key);
        return group
            ? [`enchantment:exclusive.set.${group.id}.title`, null]
            : [Identifier.of(key, "exclusive_set").toResourceName(), null];
    },
    supportedItems: (key: string) => {
        const entry = Object.entries(enchantableItems).find(([_, v]) => v === key);
        return entry
            ? [`enchantment:supported.${entry[0]}.title`, null]
            : [Identifier.of(key, "enchantable").toResourceName(), null];
    }
};

const sortOptions = [
    { key: "supported", value: "supportedItems", label: "enchantment:overview.sort.supported.label", description: "enchantment:overview.sort.supported.description" },
    { key: "exclusive", value: "exclusiveSet", label: "enchantment:overview.sort.exclusive.label", description: "enchantment:overview.sort.exclusive.description" },
    { key: "slots", value: "slots", label: "enchantment:overview.sort.slots.label", description: "enchantment:overview.sort.slots.description" },
    { value: "none", label: "enchantment:overview.sort.none.label", description: "enchantment:overview.sort.none.description" }
];

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

    const sortOption = sortOptions.find((opt) => opt.value === sortCriteria);
    const translatedSortOption = useTranslateKey(sortOption?.label || "enchantment:overview.sort.none.label");
    const translatedSortBy = useTranslateKey("enchantment:overview.sort.by");

    return (
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
                        {sortCriteria !== "none" && (
                            <Translate content={`enchantment:overview.sort.${sortOption?.key}.section`} />
                        )}
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
    const [title, description] = GROUP_MAPS[sortCriteria as keyof typeof GROUP_MAPS]?.(group.key) || [group.key, null];

    return (
        <div key={group.key} className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/50">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-zinc-200">
                            {title && <Translate content={title} />}
                        </h2>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
                            {group.enchantments.length} <Translate content="elements" />
                        </span>
                    </div>
                    {group.key === "none" && (
                        <p className="text-sm text-zinc-500">
                            <Translate content={"enchantment:overview.sort.none.section"} />
                        </p>
                    )}
                    {description && (
                        <p className="text-sm text-zinc-500">
                            <Translate content={description} />
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