import { createFileRoute, useParams } from "@tanstack/react-router";
import type { EnchantmentOption, EnchantmentStats, SlotLevelRange, TagType } from "@voxelio/breeze";
import { Datapack, type Enchantment, EnchantmentSimulator, Identifier, TagCompiler, TagsComparator, toRoman } from "@voxelio/breeze";
import { type Component, useState } from "react";
import EnchantingTable from "@/components/tools/elements/EnchantingTable";
import MinecraftSlot from "@/components/tools/elements/gui/MinecraftSlot";
import MinecraftTooltip from "@/components/tools/elements/gui/MinecraftTooltip";
import SimpleCard from "@/components/tools/elements/SimpleCard";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarTextButton } from "@/components/tools/floatingbar/ToolbarTextButton";
import { ToolbarTextLink } from "@/components/tools/floatingbar/ToolbarTextLink";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import { Dialog, DialogCloseButton, DialogFooter, DialogHeader, DialogHero } from "@/components/ui/Dialog";
import { MultiStep, MultiStepControl, MultiStepItem } from "@/components/ui/MultiStep";
import Range from "@/components/ui/Range";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { useTranslateKey } from "@/lib/hook/useTranslation";
import { mergeRegistries } from "@/lib/registry";
import { clsx, cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/simulation")({
    component: RouteComponent
});

function RouteComponent() {
    const defaultCount = 15;
    const params = useParams({ from: "/$lang/studio/editor" });
    const [blockCount, setBlockCount] = useState(defaultCount);
    const [itemInput, setItemInput] = useState("minecraft:diamond_sword");
    const [enchantability, setEnchantability] = useState(10);
    const [iteration, setIteration] = useState(1000);
    const [includeVanilla, setIncludeVanilla] = useState(false);
    const [stats, setStats] = useState<EnchantmentStats[]>([]);
    const [output, setOutput] = useState<EnchantmentOption>();
    const [showTooltip, setShowTooltip] = useState(false);
    const [slotRanges, setSlotRanges] = useState<SlotLevelRange[]>(new EnchantmentSimulator(new Map()).getSlotLevelRanges(defaultCount));
    const translatedIterationsLabel = useTranslateKey("enchantment:simulation.iterations.label");
    const { data: vanillaEnchantment } = useRegistry<FetchedRegistry<Enchantment>>("summary", "enchantment");
    const { data: vanillaTagsItem } = useRegistry<FetchedRegistry<TagType>>("summary", "tag/item");
    const { data: vanillaTagsEnchantment } = useRegistry<FetchedRegistry<TagType>>("summary", "tag/enchantment");
    const { data: components } = useRegistry<FetchedRegistry<Component>>("component");
    const enchantmentsTooltipEntries = output?.enchantments.map((enchantment) => ({
        enchantment: Identifier.of(enchantment.enchantment, "enchantment"),
        level: enchantment.level
    }));

    const runSimulation = (index: number) => {
        const getRegistry = useConfiguratorStore.getState().getRegistry;
        const enchantments = getRegistry("enchantment");
        const itemTagsRegistry = getRegistry<TagType>("tags/item");
        const enchantmentTagsRegistry = getRegistry<TagType>("tags/enchantment");

        const allEnchantments = mergeRegistries(includeVanilla ? vanillaEnchantment : {}, enchantments, "enchantment");
        const allItemTags = mergeRegistries(vanillaTagsItem, itemTagsRegistry, "tags/item");
        const allVanillaTagsEnchantments = mergeRegistries(vanillaTagsEnchantment, [], "tags/enchantment");

        const enchantmentMap = new Map(allEnchantments.map((element) => [new Identifier(element.identifier).toString(), element.data]));

        const tagCompiler = new TagCompiler(true);
        const compiledEnchTags = tagCompiler.compile([
            { id: "vanilla", tags: allVanillaTagsEnchantments },
            { id: "datapack", tags: enchantmentTagsRegistry }
        ]);

        const simulator = new EnchantmentSimulator(enchantmentMap as Map<string, Enchantment>, compiledEnchTags);
        const itemTags = new TagsComparator(allItemTags).findItemTags(itemInput).map((tag) => tag.toString());
        setOutput(simulator.simulateEnchantmentTable(blockCount, enchantability, itemTags)[index]);
        setStats(simulator.calculateEnchantmentProbabilities(blockCount, enchantability, itemTags, iteration, index));
    };

    const getAvailableItems = () => {
        const getRegistry = useConfiguratorStore.getState().getRegistry;
        const enchantments = getRegistry<Enchantment>("enchantment");
        const itemTagsRegistry = getRegistry<TagType>("tags/item");

        const allEnchantments = mergeRegistries(vanillaEnchantment, enchantments, "enchantment");
        const allItemTags = mergeRegistries(vanillaTagsItem, itemTagsRegistry, "tags/item");

        const enchantmentMap = new Map();
        for (const element of allEnchantments) {
            enchantmentMap.set(new Identifier(element.identifier).toString(), element.data);
        }

        const simulator = new EnchantmentSimulator(enchantmentMap);
        return simulator.getFlattenedPrimaryItems(allItemTags);
    };

    const calculateSlotRanges = (count: number) => {
        setSlotRanges(new EnchantmentSimulator(new Map()).getSlotLevelRanges(count));
        setBlockCount(count);
    };

    const setItemInputHandler = (item: string) => {
        setItemInput(item);

        const identifier = Identifier.of(item, "item");
        const component = components?.[identifier.resource] as { "minecraft:enchantable"?: { value?: number } };
        const enchantability = component?.["minecraft:enchantable"]?.value;
        if (typeof enchantability !== "number") return;

        setEnchantability(enchantability);
    };

    return (
        <div className="h-full">
            <Dialog id="enchantment-simulation-welcome" reminder defaultOpen className="sm:max-w-[800px]">
                <MultiStep>
                    <MultiStepItem>
                        <DialogHeader>
                            <DialogHero image="/images/background/dialog/enchantment/simulation_1.webp" />
                        </DialogHeader>
                        <hr className="!my-1" />
                        <div className="p-4">
                            <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                <Translate content="enchantment:simulation.dialog.usage.title" />
                            </h2>
                            <div className="relative leading-normal text-zinc-400 font-light">
                                <p>
                                    <Translate content="enchantment:simulation.dialog.usage.body" />
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.usage.list.1" />
                                    </li>
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.usage.list.2" />
                                    </li>
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.usage.list.3" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </MultiStepItem>
                    <MultiStepItem>
                        <DialogHeader>
                            <DialogHero image="/images/background/dialog/enchantment/simulation_2.webp" />
                        </DialogHeader>
                        <hr className="!my-1" />
                        <div className="p-4">
                            <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                <Translate content="enchantment:simulation.dialog.stats.title" />
                            </h2>
                            <div className="relative leading-normal text-zinc-400 font-light">
                                <p>
                                    <Translate content="enchantment:simulation.dialog.stats.body" />
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.stats.list.1" />
                                    </li>
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.stats.list.2" />
                                    </li>
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.stats.list.3" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </MultiStepItem>
                    <MultiStepItem>
                        <DialogHeader>
                            <DialogHero image="/images/background/dialog/enchantment/simulation_3.webp" />
                        </DialogHeader>
                        <hr className="!my-1" />
                        <div className="p-4">
                            <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                <Translate content="enchantment:simulation.dialog.results.title" />
                            </h2>
                            <div className="relative leading-normal text-zinc-400 font-light">
                                <p>
                                    <Translate content="enchantment:simulation.dialog.results.body" />
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.results.list.1" />
                                    </li>
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.results.list.2" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </MultiStepItem>
                    <MultiStepItem>
                        <DialogHeader>
                            <DialogHero image="/images/background/dialog/enchantment/simulation_4.webp" />
                        </DialogHeader>
                        <hr className="!my-1" />
                        <div className="p-4">
                            <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                <Translate content="enchantment:simulation.dialog.item_selection.title" />
                            </h2>
                            <div className="relative leading-normal text-zinc-400 font-light">
                                <p>
                                    <Translate content="enchantment:simulation.dialog.item_selection.body" />
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.item_selection.list.1" />
                                    </li>
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.item_selection.list.2" />
                                    </li>
                                    <li>
                                        <Translate content="enchantment:simulation.dialog.item_selection.list.3" />
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
            </Dialog>
            <Toolbar>
                <div className="flex items-center gap-1">
                    <ToolbarTextLink
                        icon="/icons/tools/overview/home.svg"
                        tooltip="enchantment:simulation.toolbar.back"
                        labelText="enchantment:simulation.toolbar.back"
                        lang={params.lang}
                        to="/$lang/studio/editor/enchantment/overview"
                    />
                    <ToolbarTextButton
                        icon="/icons/tools/overview/help.svg"
                        tooltip="enchantment:simulation.toolbar.help"
                        onClick={() => document.getElementById("enchantment-simulation-welcome")?.showPopover()}
                        labelText="enchantment:simulation.toolbar.help"
                    />
                </div>
                <Button onClick={() => runSimulation(0)} rounded="full">
                    <Translate content="enchantment:simulation.toolbar.run" />
                </Button>
            </Toolbar>

            <div className="flex flex-col p-4 h-full space-y-4">
                <div className="relative">
                    <h1 className="text-2xl font-semibold">
                        <Translate content="enchantment:simulation.title" />
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        <Translate content="enchantment:simulation.description" />
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8" style={{ gridTemplateColumns: `repeat(auto-fit, minmax("255px", 1fr))` }}>
                    <div
                        className="flex justify-evenly items-center gap-4 w-full px-16 pixelated border-solid border-[16px]"
                        style={{
                            borderImageSource: 'url("/images/features/gui/background.png")',
                            borderImageSlice: "4 4 4 4 fill",
                            borderImageRepeat: "stretch"
                        }}>
                        <div className="flex flex-col justify-center items-center h-full flex-2">
                            <p className="font-seven text-zinc-800 text-xl">
                                <Translate content="enchantment:simulation.enchant_label" />
                            </p>
                            <img
                                onClick={() => setShowTooltip(!showTooltip)}
                                src={showTooltip ? "/images/features/gui/book_open.webp" : "/images/features/gui/book_closed.webp"}
                                alt="Enchanting Table"
                                className="pixelated w-24 mt-4 mb-8 cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
                            />
                            <div className="relative group">
                                <MinecraftSlot id={itemInput} count={1} onItemChange={setItemInputHandler} items={getAvailableItems} />
                                <MinecraftTooltip
                                    enchantments={enchantmentsTooltipEntries}
                                    name={Identifier.of(itemInput, "item")}
                                    className={cn("hidden group-hover:block absolute top-16 left-4", showTooltip && "block opacity-100")}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center h-full flex-3">
                            {Array(3)
                                .fill(null)
                                .map((_, index) => (
                                    <button
                                        type="button"
                                        key={`enchantment_slot_${index + 1}`}
                                        className="relative cursor-pointer"
                                        onClick={() => runSimulation(index)}>
                                        <img
                                            src={`/images/features/gui/enchantment_slot_${index + 1}.png`}
                                            alt="Enchanting Table"
                                            className="w-full pixelated hover:-hue-rotate-20 transition"
                                        />
                                        {slotRanges[index] && (
                                            <div
                                                className={clsx(
                                                    "absolute user-select-none select-none font-seven bottom-1.5 right-2.5 text-experience text-shadow-tooltip text-shadow-experience-shadow text-sm rounded",
                                                    index === 2 && "bottom-2"
                                                )}>
                                                {slotRanges[index].minLevel} - {slotRanges[index].maxLevel}
                                            </div>
                                        )}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <SimpleCard className="flex justify-between px-2">
                        <div className="flex flex-col items-center gap-4 px-6">
                            <div className="size-50 ">
                                <EnchantingTable blockCount={blockCount} />
                            </div>
                            <Counter max={15} min={0} step={1} value={blockCount} onChange={calculateSlotRanges} />
                        </div>
                        <div className="flex flex-col justify-between items-center gap-4 border-l-2 border-zinc-900 px-6 flex-1">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col w-3/4">
                                    <span className="text-lg font-medium text-zinc-200 tracking-wide">
                                        <Translate content="enchantment:simulation.enchantability.title" />
                                    </span>
                                    <span className="text-sm text-zinc-500">
                                        <Translate content="enchantment:simulation.enchantability.description" />
                                    </span>
                                </div>
                                <Counter max={15} min={0} step={1} value={enchantability} onChange={setEnchantability} />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col w-3/4">
                                    <span className="text-lg font-medium text-zinc-200 tracking-wide">
                                        <Translate content="enchantment:simulation.vanilla.title" />
                                    </span>
                                    <span className="text-sm text-zinc-500">
                                        <Translate content="enchantment:simulation.vanilla.description" />
                                    </span>
                                </div>
                                <label className="cursor-pointer flex">
                                    <input type="checkbox" checked={includeVanilla} onChange={(e) => setIncludeVanilla(e.target.checked)} />
                                </label>
                            </div>
                            <div className="flex flex-col w-full">
                                <Range
                                    value={iteration}
                                    min={100}
                                    max={10000}
                                    step={100}
                                    onChangeEnd={(value) => setIteration(value)}
                                    label={translatedIterationsLabel}
                                />
                                <div className="flex justify-between items-center text-xs text-zinc-500 font-light">
                                    <p>
                                        <Translate content="enchantment:simulation.iterations.speed" />
                                    </p>
                                    <p>
                                        <Translate content="enchantment:simulation.iterations.accuracy" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SimpleCard>
                </div>

                <div className="mt-16">
                    <div className="relative mb-8">
                        <h2 className="text-2xl font-semibold mb-1">
                            <Translate content="enchantment:simulation.results.title" />
                        </h2>
                        <ul className="text-zinc-400 text-sm list-disc list-inside space-y-1">
                            <li>
                                <Translate content="enchantment:simulation.results.description.1" />
                            </li>
                            <li>
                                <Translate content="enchantment:simulation.results.description.2" />
                            </li>
                        </ul>
                        <hr className="!m-0 absolute -bottom-2 left-0 right-0" />
                    </div>
                    <div className="backdrop-blur-2xl border-2 border-stone-900 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-black/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-200">
                                            <Translate content="enchantment:simulation.results.table.enchantment" />
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-200">
                                            <Translate content="enchantment:simulation.results.table.probability" />
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-200">
                                            <Translate content="enchantment:simulation.results.table.average_level" />
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-200">
                                            <Translate content="enchantment:simulation.results.table.level_range" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {stats.length === 0 ? (
                                        <tr className="bg-black/30 h-96">
                                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-sm">
                                                        <Translate content="enchantment:simulation.results.empty.title" />
                                                    </span>
                                                    <span className="text-xs text-zinc-500">
                                                        <Translate content="enchantment:simulation.results.empty.description" />
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.map((stat) => (
                                            <tr
                                                key={stat.enchantmentId}
                                                className="hover:bg-zinc-900/50 transition-colors odd:bg-black/30 even:bg-black/50">
                                                <td className="px-6 py-4 text-white font-medium">
                                                    {Identifier.of(stat.enchantmentId, "enchantment").toResourceName()}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-300">{stat.probability.toFixed(2)}%</td>
                                                <td className="px-6 py-4 text-zinc-300">{stat.averageLevel.toFixed(1)}</td>
                                                <td className="px-6 py-4 text-zinc-300">
                                                    {stat.minLevel === stat.maxLevel ? (
                                                        <span className="font-medium text-zinc-300">{toRoman(stat.minLevel)}</span>
                                                    ) : (
                                                        <>
                                                            <span className="font-medium text-zinc-300">{toRoman(stat.minLevel)}</span>
                                                            <span className="font-light text-sm text-zinc-400 px-1.5">
                                                                <Translate content="enchantment:simulation.results.level_range.to" />
                                                            </span>
                                                            <span className="font-medium text-zinc-300">{toRoman(stat.maxLevel)}</span>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
