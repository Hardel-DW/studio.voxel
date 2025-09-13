import { type EnchantmentGroup, Identifier } from "@voxelio/breeze";
import { useState } from "react";
import { DropZone } from "@/components/ui/DragDrop";
import { exclusiveSetGroups } from "@/lib/data/exclusive";
import { enchantableItems } from "@/lib/data/tags";
import Translate from "../../Translate";

const GROUP_MAPS = {
    slots: (key: string) => [`enchantment:slots.${key}.title`, `enchantment:slots.${key}.description`],
    exclusiveSet: (key: string) => {
        const group = exclusiveSetGroups.find((g) => g.value === key);
        return group ? [`enchantment:exclusive.set.${group.id}.title`, null] : [Identifier.of(key, "exclusive_set").toResourceName(), null];
    },
    supportedItems: (key: string) => {
        const entry = Object.entries(enchantableItems).find(([_, v]) => v === key);
        return entry ? [`enchantment:supported.${entry[0]}.title`, null] : [Identifier.of(key, "enchantable").toResourceName(), null];
    }
};

export default function OverviewGroupCard({
    group,
    sortCriteria,
    children
}: {
    group: EnchantmentGroup;
    sortCriteria: string;
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [title, description] = GROUP_MAPS[sortCriteria as keyof typeof GROUP_MAPS]?.(group.key) || [group.key, null];

    return (
        <DropZone key={group.key} zone={group.key} className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/50">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-zinc-200">{title && <Translate content={title} />}</h2>
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
                    title={isCollapsed ? "Show items" : "Hide items"}>
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
        </DropZone>
    );
}
