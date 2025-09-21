import type { DataDrivenRegistryElement, TagType } from "@voxelio/breeze";
import { Datapack, TagsComparator } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import useRegistry from "./useRegistry";

export default function useTagManager() {
    const files = useConfiguratorStore((state) => state.files);
    const { data: vanillaTags, isLoading } = useRegistry<Record<string, TagType>>("summary", "tags/item");

    const combinedTags = (() => {
        if (!vanillaTags || isLoading) return [];

        const datapackTags: DataDrivenRegistryElement<TagType>[] = [];

        // Get tags from datapack
        if (files && Object.keys(files).length > 0) {
            const datapack = new Datapack(files);
            const datapackTagsRegistry = datapack.getRegistry("tags/item") as DataDrivenRegistryElement<TagType>[];
            datapackTags.push(...datapackTagsRegistry);
        }

        // Convert vanilla tags to DataDrivenRegistryElement format
        const vanillaTagsArray: DataDrivenRegistryElement<TagType>[] = Object.entries(vanillaTags).map(([key, tag]) => ({
            identifier: {
                namespace: key.includes(":") ? key.split(":")[0] : "minecraft",
                registry: "tags/item",
                resource: key.includes(":") ? key.split(":")[1] : key
            },
            data: tag
        }));

        // Combine both, with datapack tags taking precedence over vanilla ones
        const allTags = [...vanillaTagsArray];

        // Add datapack tags, replacing vanilla ones if they have the same identifier
        for (const datapackTag of datapackTags) {
            const existingIndex = allTags.findIndex(
                (tag) =>
                    tag.identifier.namespace === datapackTag.identifier.namespace &&
                    tag.identifier.resource === datapackTag.identifier.resource
            );

            if (existingIndex >= 0) {
                allTags[existingIndex] = datapackTag;
            } else {
                allTags.push(datapackTag);
            }
        }

        return allTags;
    })();

    const getRandomItemFromTag = (tagId: string): string | null => {
        if (combinedTags.length === 0) return null;

        const comparator = new TagsComparator(combinedTags);

        // Remove # prefix if present
        const cleanTagId = tagId.startsWith("#") ? tagId.slice(1) : tagId;

        // Parse namespace and resource from tag ID
        const [namespace, resource] = cleanTagId.includes(":") ? cleanTagId.split(":") : ["minecraft", cleanTagId];

        const identifier = {
            namespace,
            registry: "tags/item",
            resource
        };

        const values = comparator.getRecursiveValues(identifier);

        if (values.length === 0) return null;

        // Return random item from resolved values
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
    };

    const getAllItemsFromTag = (tagId: string): string[] => {
        if (combinedTags.length === 0) return [];

        const comparator = new TagsComparator(combinedTags);

        // Remove # prefix if present
        const cleanTagId = tagId.startsWith("#") ? tagId.slice(1) : tagId;

        // Parse namespace and resource from tag ID
        const [namespace, resource] = cleanTagId.includes(":") ? cleanTagId.split(":") : ["minecraft", cleanTagId];

        const identifier = {
            namespace,
            registry: "tags/item",
            resource
        };

        return comparator.getRecursiveValues(identifier);
    };

    return {
        getRandomItemFromTag,
        getAllItemsFromTag,
        isLoading,
        tags: combinedTags
    };
}
