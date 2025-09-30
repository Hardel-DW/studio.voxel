import type { IdentifierObject, TagRegistry, TagType } from "@voxelio/breeze";
import { EnchantmentAction, Identifier, isTag, isVoxel, Tags } from "@voxelio/breeze";
import { useState } from "react";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolListOption from "@/components/tools/elements/ToolListOption";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogCloseButton, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Loader from "@/components/ui/Loader";
import { exclusiveSetGroups } from "@/lib/data/exclusive";
import useRegistry from "@/lib/hook/useRegistry";
import { isMinecraft } from "@/lib/utils/lock";

const normalizeTag = (tag: string) => (tag.startsWith("#") ? tag.slice(1) : tag);

type SelectedGroup = {
    identifier: IdentifierObject;
    title: string;
    description: string;
    image: string;
    values: string[];
};

export function ExclusiveGroupSection() {
    const [selectedGroup, setSelectedGroup] = useState<SelectedGroup | null>(null);
    const { data, isLoading, isError } = useRegistry<TagRegistry>("summary", "tags/enchantment");
    const tagsRegistry = useConfiguratorStore((state) => state.getRegistry<TagType>("tags/enchantment"));
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const currentEnchantment = currentElement && isVoxel(currentElement, "enchantment") ? currentElement : undefined;
    if (!currentEnchantment) return null;

    const currentIdentifier = new Identifier(currentEnchantment.identifier);
    const exclusiveTags = tagsRegistry.filter((tag) => tag.identifier.resource.startsWith("exclusive_set/"));
    const tagIndex = new Map(exclusiveTags.map((tag) => [new Identifier(tag.identifier).toUniqueKey(), tag]));
    const customExclusiveTags = exclusiveTags.filter((tag) => tag.identifier.namespace !== "minecraft");
    const tags = currentEnchantment?.tags ?? [];
    const currentTagSet = new Set(Array.isArray(tags) ? tags.map(normalizeTag) : []);

    const resolveValues = (identifier: Identifier) => {
        const fromDatapack = tagIndex.get(identifier.toUniqueKey());
        const compiledValues = fromDatapack && isTag(fromDatapack.data) ? new Tags(fromDatapack.data).fromRegistry() : [];
        const vanillaValues = data?.[identifier.resource] ? new Tags(data[identifier.resource]).fromRegistry() : [];
        return Array.from(new Set([...compiledValues, ...vanillaValues]));
    };

    return (
        <>
            <ToolCategory title="enchantment:exclusive.vanilla.title">
                <ToolGrid>
                    {exclusiveSetGroups.map(({ id, image, value }) => {
                        const identifier = Identifier.of(value, "tags/enchantment");
                        const values = resolveValues(identifier);
                        const containsCurrent = currentEnchantment
                            ? values.includes(currentIdentifier.toString()) || currentTagSet.has(normalizeTag(value))
                            : false;

                        return (
                            <ToolListOption
                                key={id}
                                title={`enchantment:exclusive.set.${id}.title`}
                                description={`enchantment:exclusive.set.${id}.description`}
                                image={`/images/features/item/${image}.webp`}
                                values={values}
                                action={EnchantmentAction.setExclusiveSetWithTags(value)}
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
                            const identifierString = identifier.toString();
                            const value = identifierString;
                            const containsCurrent = currentEnchantment
                                ? values.includes(currentIdentifier.toString()) || currentTagSet.has(normalizeTag(value))
                                : false;

                            return (
                                <ToolListOption
                                    key={identifier.toUniqueKey()}
                                    title={identifier.toResourceName()}
                                    description={identifier.toResourcePath()}
                                    image="/icons/logo.svg"
                                    values={values}
                                    action={EnchantmentAction.setExclusiveSetWithTags(identifierString)}
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
                        <div className="space-y-3 text-sm text-zinc-400">
                            <p>
                                Cibler un groupe signifie que l'enchantement ne peut pas être combiné avec les enchantements listés dans ce
                                groupe.
                            </p>
                            <p>
                                Appartenir à un groupe ajoute l'enchantement à la liste de ce groupe, pour que d'autres enchantements qui
                                ciblent ce groupe le prennent en compte.
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Enchantements dans ce groupe</h3>
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
                            <p className="text-xs text-zinc-500">Aucun enchantement n'est encore listé dans ce groupe.</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="primary">Cibler</Button>
                        <Button variant="ghost">Ajouter</Button>
                        <Button variant="ghost">Cibler + ajouter</Button>
                        <Button variant="destructive">Cibler + exclusif</Button>
                    </div>
                </div>

                <DialogFooter>
                    <DialogCloseButton variant="ghost_border">
                        <Translate content="close" />
                    </DialogCloseButton>
                </DialogFooter>
            </Dialog>
        </>
    );
}
