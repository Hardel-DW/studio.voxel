import { createFileRoute, Link } from "@tanstack/react-router";
import type { EnchantmentProps, EnchantmentSortCriteria } from "@voxelio/breeze";
import { EnchantmentSorter } from "@voxelio/breeze";
import { useState } from "react";
import EnchantmentCard from "@/components/tools/concept/enchantment/EnchantmentCard";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarButton } from "@/components/tools/floatingbar/ToolbarButton";
import { ToolbarDropdown } from "@/components/tools/floatingbar/ToolbarDropdown";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogCloseButton, DialogContent, DialogFooter, DialogHeader, DialogHero } from "@/components/ui/Dialog";
import { MultiStep, MultiStepControl, MultiStepItem } from "@/components/ui/MultiStep";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useTranslate } from "@/lib/hook/useTranslation";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/overview")({
    component: Page
});

const sortOptions = [
    {
        key: "supported",
        value: "supportedItems",
        to: "/$lang/studio/editor/enchantment/items_overview",
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
        to: "/$lang/studio/editor/enchantment/slots_overview",
        label: "enchantment:overview.sort.slots.label",
        description: "enchantment:overview.sort.slots.description"
    },
    { value: "none", label: "enchantment:overview.sort.none.label", description: "enchantment:overview.sort.none.description" }
];

function Page() {
    const { lang } = Route.useParams();
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
    const translatedSortOption = useTranslate(sortOption?.label || "enchantment:overview.sort.none.label");
    const translatedSortBy = useTranslate("enchantment:overview.sort.by");

    return (
        <>
            <Dialog id="enchantment-welcome">
                <DialogContent reminder defaultOpen className="sm:max-w-[800px]">
                    <MultiStep>
                        <MultiStepItem>
                            <DialogHeader>
                                <DialogHero image="/images/background/dialog/enchantment/overview_1.webp" />
                            </DialogHeader>
                            <hr className="my-1" />
                            <div className="p-4">
                                <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                    <Translate content="enchantment:overview.dialog.welcome.title" />
                                </h2>
                                <div className="relative leading-normal text-zinc-400 font-light">
                                    <p>
                                        <Translate content="enchantment:overview.dialog.welcome.body" />
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                        <li>
                                            <Translate content="enchantment:overview.dialog.welcome.list.1" />
                                        </li>
                                        <li>
                                            <Translate content="enchantment:overview.dialog.welcome.list.2" />
                                        </li>
                                        <li>
                                            <Translate content="enchantment:overview.dialog.welcome.list.3" />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </MultiStepItem>
                        <MultiStepItem>
                            <DialogHeader>
                                <DialogHero image="/images/background/dialog/enchantment/overview_2.webp" />
                            </DialogHeader>
                            <hr className="my-1" />
                            <div className="p-4">
                                <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                    <Translate content="enchantment:overview.dialog.toolbar.title" />
                                </h2>
                                <div className="relative leading-normal text-zinc-400 font-light">
                                    <p>
                                        <Translate content="enchantment:overview.dialog.toolbar.body" />
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                        <li>
                                            <Translate content="enchantment:overview.dialog.toolbar.list.1" />
                                        </li>
                                        <li>
                                            <Translate content="enchantment:overview.dialog.toolbar.list.2" />
                                        </li>
                                        <li>
                                            <Translate content="enchantment:overview.dialog.toolbar.list.3" />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </MultiStepItem>
                        <MultiStepItem>
                            <DialogHeader>
                                <DialogHero image="/images/background/dialog/enchantment/overview_3.webp" />
                            </DialogHeader>
                            <hr className="my-1" />
                            <div className="p-4">
                                <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                    <Translate content="enchantment:overview.dialog.advanced.title" />
                                </h2>
                                <div className="relative leading-normal text-zinc-400 font-light">
                                    <p>
                                        <Translate content="enchantment:overview.dialog.advanced.body" />
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                        <li>
                                            <Translate content="enchantment:overview.dialog.advanced.list.before" />{" "}
                                            <b>
                                                <Translate content="enchantment:overview.dialog.advanced.list.1.bold" />
                                            </b>
                                            , <Translate content="enchantment:overview.dialog.advanced.list.1.after" />
                                        </li>
                                        <li>
                                            <Translate content="enchantment:overview.dialog.advanced.list.before" />{" "}
                                            <b>
                                                <Translate content="enchantment:overview.dialog.advanced.list.2.bold" />
                                            </b>
                                            , <Translate content="enchantment:overview.dialog.advanced.list.2.after" />
                                        </li>
                                        <li>
                                            <Translate content="enchantment:overview.dialog.advanced.list.before" />{" "}
                                            <b>
                                                <Translate content="enchantment:overview.dialog.advanced.list.3.bold" />
                                            </b>
                                            , <Translate content="enchantment:overview.dialog.advanced.list.3.after" />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </MultiStepItem>

                        <DialogFooter className="flex items-end justify-between">
                            <DialogCloseButton variant="ghost_border">
                                <Translate content="close" />
                            </DialogCloseButton>
                            <MultiStepControl />
                        </DialogFooter>
                    </MultiStep>
                </DialogContent>
            </Dialog>

            <Toolbar>
                <ToolbarSearch placeholder="enchantment:overview.search.placeholder" value={searchValue} onChange={setSearchValue} />
                <div className="flex items-center gap-1">
                    <ToolbarDropdown
                        icon="/icons/tools/overview/grid.svg"
                        tooltip={`${translatedSortBy} ${translatedSortOption}`}
                        value={sortCriteria}
                        options={sortOptions}
                        onChange={(value: string) => setSortCriteria(value as EnchantmentSortCriteria)}
                        params={{ lang }}
                    />
                    <ToolbarButton
                        icon={`/icons/tools/overview/${isDetailed ? "map" : "list"}.svg`}
                        tooltip={isDetailed ? "enchantment:overview.view.minimal" : "enchantment:overview.view.detailed"}
                        onClick={() => setIsDetailed(!isDetailed)}
                    />
                    <ToolbarButton
                        icon="/icons/tools/overview/help.svg"
                        tooltip="Réouvrir l'aide"
                        onClick={() => document.getElementById("enchantment-welcome")?.showPopover()}
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
                <Link to="/$lang/studio/editor/enchantment/simulation" params={{ lang }}>
                    <Button variant="ghost">Simulation</Button>
                </Link>
            </div>

            <hr className="my-4" />

            <div className="grid gap-4 overview-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {(filteredElements as EnchantmentProps[]).map((element) => (
                    <EnchantmentCard key={element.identifier.resource} element={element} display={isDetailed} />
                ))}
            </div>
        </>
    );
}
