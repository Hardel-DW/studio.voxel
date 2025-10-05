import type { IdentifierObject, TagType } from "@voxelio/breeze";
import { CoreAction, EnchantmentAction, Identifier, Tags, TagsProcessor } from "@voxelio/breeze";
import { useState } from "react";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolListOption from "@/components/tools/elements/ToolListOption";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogCloseButton, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import Loader from "@/components/ui/Loader";
import { exclusiveSetGroups } from "@/lib/data/exclusive";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { isMinecraft } from "@/lib/utils/lock";

type SelectedGroup = {
    identifier: IdentifierObject;
    title: string;
    description: string;
    image: string;
    values: string[];
    value: string;
};

export function ExclusiveGroupSection() {
    const [selectedGroup, setSelectedGroup] = useState<SelectedGroup | null>(null);
    const { data, isLoading, isError } = useRegistry<FetchedRegistry<TagType>>("summary", "tags/enchantment");
    const currentElementId = useConfiguratorStore((state) => state.currentElementId);
    const getRegistry = useConfiguratorStore((state) => state.getRegistry);
    const performGlobalHandleChange = useConfiguratorStore((state) => state.handleChange);
    if (!currentElementId) return null;

    const openDialog = (group: SelectedGroup) => {
        setSelectedGroup(group);
        document.getElementById("exclusive-group-dialog")?.showPopover();
    };

    const closeDialog = () => document.getElementById("exclusive-group-dialog")?.hidePopover();
    const executeAction = (action: CoreAction | EnchantmentAction) => {
        if (!currentElementId) return;
        performGlobalHandleChange(action, currentElementId, true);
        closeDialog();
    };

    const tagsRegistry = getRegistry<TagType>("tags/enchantment", { path: "exclusive_set" });
    const vanillaTags = data ? Object.entries(data).map(([key, value]) => ({ identifier: Identifier.of(key, "tags/enchantment"), data: value })) : [];
    const merge = TagsProcessor.merge([{ id: "vanilla", tags: vanillaTags }, { id: "datapack", tags: tagsRegistry }]);

    return (
        <>
            <ToolCategory title="enchantment:exclusive.vanilla.title">
                <ToolGrid>
                    {exclusiveSetGroups.map(({ id, image, value }) => {
                        const tagData = merge.find((tag) =>
                            new Identifier(tag.identifier).equals(Identifier.of(value, "tags/enchantment"))
                        );
                        const values = tagData && Tags.isTag(tagData.data) ? new Tags(tagData.data).fromRegistry() : [];

                        return (
                            <ToolListOption
                                key={id}
                                title={`enchantment:exclusive.set.${id}.title`}
                                description={`enchantment:exclusive.set.${id}.description`}
                                image={`/images/features/item/${image}.webp`}
                                values={values}
                                action={CoreAction.setValue("exclusiveSet", value)}
                                highlightAction={CoreAction.removeTags([value])}
                                renderer={(el) => el.exclusiveSet === value}
                                highlightRenderer={(el) => Array.isArray(el.tags) && el.tags.includes(value)}
                                lock={[isMinecraft]}
                                disableToggle
                                onSelect={() => openDialog({
                                    identifier: Identifier.of(value, "tags/enchantment"),
                                    title: `enchantment:exclusive.set.${id}.title`,
                                    description: `enchantment:exclusive.set.${id}.description`,
                                    image: `/images/features/item/${image}.webp`,
                                    values,
                                    value
                                })}
                            />
                        );
                    })}
                </ToolGrid>
            </ToolCategory>

            <ToolCategory title="enchantment:exclusive.custom.title">
                {merge.filter((tag) => tag.identifier.namespace !== "minecraft").length === 0 && (
                    <p className="text-zinc-400 p-4">
                        <Translate content="enchantment:exclusive.custom.fallback" />
                    </p>
                )}

                {merge.filter((tag) => tag.identifier.namespace !== "minecraft").length > 0 && (
                    <ToolGrid>
                        {merge
                            .filter((tag) => tag.identifier.namespace !== "minecraft")
                            .map((tagEntry) => {
                                const identifier = new Identifier(tagEntry.identifier);
                                const values = Tags.isTag(tagEntry.data) ? new Tags(tagEntry.data).fromRegistry() : [];
                                const identifierString = identifier.toString();

                                return (
                                    <ToolListOption
                                        key={identifier.toUniqueKey()}
                                        title={identifier.toResourceName()}
                                        description={identifier.toResourcePath()}
                                        image="/icons/logo.svg"
                                        values={values}
                                        action={CoreAction.setValue("exclusiveSet", identifierString)}
                                        highlightAction={CoreAction.removeTags([identifierString])}
                                        renderer={(el) => el.exclusiveSet === identifierString}
                                        highlightRenderer={(el) => Array.isArray(el.tags) && el.tags.includes(identifierString)}
                                        disableToggle
                                        onSelect={() => openDialog({
                                            identifier,
                                            title: identifier.toResourceName(),
                                            description: identifier.toResourcePath(),
                                            image: "/icons/logo.svg",
                                            values,
                                            value: identifierString
                                        })}
                                    />
                                );
                            })}
                    </ToolGrid>
                )}
            </ToolCategory>

            {isLoading && <Loader />}
            {isError && <ErrorPlaceholder error={new Error("Erreur de chargement du registre.")} />}

            <Dialog id="exclusive-group-dialog" className="sm:max-w-[620px] p-4">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-3">
                        {selectedGroup?.identifier && <img src={selectedGroup.image} alt="group" className="size-8 pixelated" />}
                        <span>
                            <Translate content={selectedGroup?.title} />
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        {selectedGroup?.description && (
                            <p className="text-xs text-zinc-500 mb-3">
                                <Translate content={selectedGroup.description} />
                            </p>
                        )}
                        <div className="text-sm text-zinc-400">
                            <p>
                                <Translate content="enchantment:exclusive.dialog.explain.target" />
                            </p>
                            <p>
                                <Translate content="enchantment:exclusive.dialog.explain.membership" />
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="px-4 pb-4 space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                            <Translate content="enchantment:exclusive.dialog.members.title" />
                        </h3>
                        {selectedGroup?.values?.length && selectedGroup.values.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedGroup.values.map((value) => (
                                    <span
                                        key={value}
                                        className="text-xs text-zinc-300 bg-zinc-900/40 border border-zinc-800 rounded-lg px-2 py-1">
                                        {value}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-zinc-500">
                                <Translate content="enchantment:exclusive.dialog.members.empty" />
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="border-t border-zinc-800">
                    <DialogCloseButton variant="ghost_border">
                        <Translate content="enchantment:exclusive.dialog.actions.close" />
                    </DialogCloseButton>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            onClick={() => selectedGroup && executeAction(CoreAction.setValue("exclusiveSet", selectedGroup.value))}>
                            <Translate content="enchantment:exclusive.dialog.actions.target" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost_border">
                                    <Translate content="enchantment:exclusive.dialog.actions.more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => selectedGroup && executeAction(CoreAction.addTags([selectedGroup.value]))}>
                                    <Translate content="enchantment:exclusive.dialog.actions.join" />
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => selectedGroup && executeAction(EnchantmentAction.setExclusiveSetWithTags(selectedGroup.value))}>
                                    <Translate content="enchantment:exclusive.dialog.actions.target_join" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-400 hover:text-red-300"
                                    onClick={() => {
                                        if (!selectedGroup || !currentElementId) return;
                                        executeAction(CoreAction.setValue("exclusiveSet", selectedGroup.value));
                                        executeAction(CoreAction.setValue("tags", []));
                                    }}>
                                    <Translate content="enchantment:exclusive.dialog.actions.target_exclusive" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </DialogFooter>
            </Dialog>
        </>
    );
}
