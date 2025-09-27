import {
    Actions,
    EnchantmentActionBuilder,
    Identifier,
    Tags,
    isTag,
    type Action,
    type EnchantmentProps,
    type TagRegistry,
    type TagType
} from "@voxelio/breeze";
import { useCallback, useMemo, useRef, useState } from "react";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolListOption from "@/components/tools/elements/ToolListOption";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { exclusiveSetGroups } from "@/lib/data/exclusive";
import useRegistry from "@/lib/hook/useRegistry";
import { isMinecraft } from "@/lib/utils/lock";

type ExclusiveGroupInfo = {
    id: string;
    title: string;
    description?: string;
    image?: string;
    identifier: Identifier;
    value: string;
    members: string[];
};

const normalizeTag = (tag: string) => (tag.startsWith("#") ? tag.slice(1) : tag);
const isExclusiveTag = (tag: string) => normalizeTag(tag).includes("exclusive_set/");

export function ExclusiveGroupSection() {
    const tagsRegistry = useConfiguratorStore((state) => state.getRegistry<TagType>("tags/enchantment"));
    const currentEnchantment = useConfiguratorStore((state) => {
        if (!state.currentElementId) return undefined;
        const element = state.elements.get(state.currentElementId);
        if (!element) return undefined;
        return new Identifier(element.identifier).toString();
    });
    const { data, isLoading, isError } = useRegistry<TagRegistry>("summary", "tags/enchantment");

    const exclusiveTags = tagsRegistry.filter((tag) => tag.identifier.resource.startsWith("exclusive_set/"));
    const tagIndex = new Map(exclusiveTags.map((tag) => [new Identifier(tag.identifier).toUniqueKey(), tag]));
    const customExclusiveTags = exclusiveTags.filter((tag) => tag.identifier.namespace !== "minecraft");

    const currentElement = useConfiguratorStore((state) =>
        state.currentElementId ? (state.elements.get(state.currentElementId) as EnchantmentProps | undefined) : undefined
    );
    const currentTagSet = useMemo(() => {
        const tags = currentElement?.tags ?? [];
        return new Set(tags.map(normalizeTag));
    }, [currentElement]);

    const resolveValues = useCallback(
        (identifier: Identifier) => {
            const fromDatapack = tagIndex.get(identifier.toUniqueKey());
            const compiledValues = fromDatapack && isTag(fromDatapack.data) ? new Tags(fromDatapack.data).fromRegistry() : [];
            const vanillaValues = data?.[identifier.resource] ? new Tags(data[identifier.resource]).fromRegistry() : [];
            return Array.from(new Set([...compiledValues, ...vanillaValues]));
        },
        [data, tagIndex]
    );

    const createExclusiveAction = (value: string) => new EnchantmentActionBuilder().setExclusiveSetWithTags(value).build();

    const dialogRef = useRef<HTMLDivElement>(null);
    const [selectedGroup, setSelectedGroup] = useState<ExclusiveGroupInfo | null>(null);

    const openDialog = (group: ExclusiveGroupInfo) => {
        setSelectedGroup(group);
        requestAnimationFrame(() => {
            dialogRef.current?.showPopover();
        });
    };

    const closeDialog = () => {
        dialogRef.current?.hidePopover();
        setSelectedGroup(null);
    };

    const performActions = useCallback(async (actions: Array<Action | null | undefined>) => {
        const filtered = actions.filter(Boolean) as Action[];
        if (filtered.length === 0) {
            closeDialog();
            return;
        }

        const store = useConfiguratorStore.getState();
        const elementId = store.currentElementId;
        if (!elementId) return;

        for (const action of filtered) {
            await store.handleChange(action, elementId);
        }

        closeDialog();
    }, []);

    const buildTagsAction = useCallback(
        (updater: (tags: string[]) => string[] | null) => {
            const store = useConfiguratorStore.getState();
            const elementId = store.currentElementId;
            if (!elementId) return null;
            const element = store.elements.get(elementId) as EnchantmentProps | undefined;
            if (!element) return null;

            const base = Array.isArray(element.tags) ? [...element.tags] : [];
            const updated = updater([...base]);
            if (!updated) return null;

            const sameLength = updated.length === base.length;
            const sameContent =
                sameLength &&
                updated.every((value, index) => value === base[index]);

            if (sameContent) return null;

            return new Actions().setValue("tags", updated).build();
        },
        []
    );

    const handleSetTarget = useCallback(() => {
        if (!selectedGroup) return;
        performActions([createExclusiveAction(selectedGroup.value)]);
    }, [performActions, selectedGroup]);

    const handleJoinGroup = useCallback(() => {
        if (!selectedGroup) return;
        const normalized = normalizeTag(selectedGroup.value);
        const action = buildTagsAction((tags) => {
            if (!tags.includes(normalized)) {
                tags.push(normalized);
            }
            return Array.from(new Set(tags));
        });

        performActions([action]);
    }, [buildTagsAction, performActions, selectedGroup]);

    const handleTargetAndJoin = useCallback(() => {
        if (!selectedGroup) return;
        const normalized = normalizeTag(selectedGroup.value);
        const tagsAction = buildTagsAction((tags) => {
            if (!tags.includes(normalized)) tags.push(normalized);
            return Array.from(new Set(tags));
        });

        performActions([createExclusiveAction(selectedGroup.value), tagsAction]);
    }, [buildTagsAction, performActions, selectedGroup]);

    const handleExclusiveMembership = useCallback(() => {
        if (!selectedGroup) return;
        const normalized = normalizeTag(selectedGroup.value);
        const tagsAction = buildTagsAction((tags) => {
            const filtered = tags.filter((tag) => !isExclusiveTag(tag) || normalizeTag(tag) === normalized);
            if (!filtered.includes(normalized)) filtered.push(normalized);
            return Array.from(new Set(filtered));
        });

        performActions([createExclusiveAction(selectedGroup.value), tagsAction]);
    }, [buildTagsAction, performActions, selectedGroup]);

    const selectedMembers = useMemo(() => {
        if (!selectedGroup) return [] as { id: string; name: string }[];
        return selectedGroup.members.map((value) => {
            const identifier = Identifier.of(normalizeTag(value), "enchantment");
            return {
                id: identifier.toString(),
                name: identifier.toResourceName()
            };
        });
    }, [selectedGroup]);

    return (
        <>
            <ToolCategory title="enchantment:exclusive.vanilla.title">
                <ToolGrid>
                    {exclusiveSetGroups.map(({ id, image, value }) => {
                        const identifier = Identifier.of(value, "tags/enchantment");
                        const values = resolveValues(identifier);
                        const containsCurrent = currentEnchantment
                            ? values.includes(currentEnchantment) || currentTagSet.has(normalizeTag(value))
                            : false;
                        const groupInfo: ExclusiveGroupInfo = {
                            id,
                            title: `enchantment:exclusive.set.${id}.title`,
                            description: `enchantment:exclusive.set.${id}.description`,
                            image: `/images/features/item/${image}.webp`,
                            identifier,
                            value,
                            members: values
                        };

                        return (
                            <ToolListOption
                                key={id}
                                title={`enchantment:exclusive.set.${id}.title`}
                                description={`enchantment:exclusive.set.${id}.description`}
                                image={`/images/features/item/${image}.webp`}
                                values={values}
                                action={createExclusiveAction(value)}
                                disableToggle
                                onSelect={() => openDialog(groupInfo)}
                                renderer={(el) => el.exclusiveSet === value}
                                highlight={containsCurrent}
                                lock={[isMinecraft]}
                            />
                        );
                    })}
                </ToolGrid>
            </ToolCategory>

            <ToolCategory title="enchantment:exclusive.custom.title">
                {customExclusiveTags.length === 0 && (
                    <p className="text-zinc-400 p-4">
                        <Translate content="enchantment:exclusive.custom.fallback" />
                    </p>
                )}

                {customExclusiveTags.length > 0 && (
                    <ToolGrid>
                        {customExclusiveTags.map((enchantment) => {
                            const identifier = new Identifier(enchantment.identifier);
                            const values = resolveValues(identifier);
                            const containsCurrent = currentEnchantment
                                ? values.includes(currentEnchantment) || currentTagSet.has(normalizeTag(value))
                                : false;
                            const identifierString = identifier.toString();
                            const value = identifierString;
                            const groupInfo: ExclusiveGroupInfo = {
                                id: identifier.toUniqueKey(),
                                title: identifier.toResourceName(),
                                description: undefined,
                                image: "/icons/logo.svg",
                                identifier,
                                value,
                                members: values
                            };

                            return (
                                <ToolListOption
                                    key={identifier.toUniqueKey()}
                                    title={identifier.toResourceName()}
                                    description={identifier.toResourcePath()}
                                    image="/icons/logo.svg"
                                    values={values}
                                    action={createExclusiveAction(identifierString)}
                                    disableToggle
                                    onSelect={() => openDialog(groupInfo)}
                                    renderer={(el) => el.exclusiveSet === identifierString}
                                    highlight={containsCurrent}
                                />
                            );
                        })}
                    </ToolGrid>
                )}
            </ToolCategory>

            {isLoading && <Loader />}
            {isError && <ErrorPlaceholder error={new Error("Erreur de chargement du registre.")} />}

            <Dialog ref={dialogRef} id="exclusive-group-dialog" className="sm:max-w-[620px] p-4">
                {selectedGroup && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-x-3">
                                {selectedGroup.image && (
                                    <img src={selectedGroup.image} alt="group" className="size-8 pixelated" />
                                )}
                                <span>
                                    <Translate content={selectedGroup.title} />
                                </span>
                            </DialogTitle>
                            <DialogDescription>
                                {selectedGroup.description && (
                                    <p className="text-xs text-zinc-500 mb-3">
                                        <Translate content={selectedGroup.description} />
                                    </p>
                                )}
                                <div className="space-y-3 text-sm text-zinc-400">
                                    <p>
                                        Cibler un groupe signifie que l'enchantement ne peut pas être combiné avec les enchantements listés dans ce groupe.
                                    </p>
                                    <p>
                                        Appartenir à un groupe ajoute l'enchantement à la liste de ce groupe, pour que d'autres enchantements qui ciblent ce groupe le prennent en compte.
                                    </p>
                                </div>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-4 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Enchantements dans ce groupe</h3>
                                {selectedMembers.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMembers.map((member) => (
                                            <span
                                                key={member.id}
                                                className="text-xs text-zinc-300 bg-zinc-900/40 border border-zinc-800 rounded-lg px-2 py-1">
                                                {member.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-500">
                                        Aucun enchantement n'est encore listé dans ce groupe.
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Button onClick={handleSetTarget} variant="primary">
                                    Cibler
                                </Button>
                                <Button onClick={handleJoinGroup} variant="ghost">
                                    Ajouter
                                </Button>
                                <Button onClick={handleTargetAndJoin} variant="ghost">
                                    Cibler + ajouter
                                </Button>
                                <Button onClick={handleExclusiveMembership} variant="destructive">
                                    Cibler + exclusif
                                </Button>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" onClick={closeDialog}>
                                Fermer
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </Dialog>
        </>
    );
}
