import {
    analyserCollection,
    type DataDrivenRegistryElement,
    type FlattenedLootItem,
    Identifier,
    isVoxel,
    LootTableFlattener,
    type LootTableProps,
    type MinecraftLootTable,
    type TagType
} from "@voxelio/breeze";
import { useShallow } from "zustand/shallow";
import { useConfiguratorStore } from "@/components/tools/Store";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { mergeRegistries } from "@/lib/registry";

interface FlattenResult {
    items: FlattenedLootItem[];
    isLoading: boolean;
}

export function useFlattenedLootItems(table: LootTableProps | undefined): FlattenResult {
    const lootTables = useConfiguratorStore(
        useShallow((state) => Array.from(state.elements.values()).filter((element) => isVoxel(element, "loot_table")))
    );
    const datapackTags = useConfiguratorStore((state) => state.getRegistry<TagType>("tags/item"));
    const { data: vanillaTags, isLoading: tagsLoading } = useRegistry<FetchedRegistry<TagType>>("summary", "tag/item");
    const { data: vanillaLootTables, isLoading: lootLoading } = useRegistry<FetchedRegistry<MinecraftLootTable>>("summary", "loot_table");
    const mergedTags = vanillaTags ? mergeRegistries(vanillaTags, datapackTags, "tags/item") : datapackTags;

    const vanillaVoxelTables: LootTableProps[] = vanillaLootTables
        ? Object.entries(vanillaLootTables).map(([key, data]) =>
              analyserCollection.loot_table.parser({
                  element: {
                      identifier: Identifier.of(key, "loot_table"),
                      data
                  } as DataDrivenRegistryElement<MinecraftLootTable>
              })
          )
        : [];

    const tableMap = new Map<string, LootTableProps>();
    for (const tableEntry of vanillaVoxelTables) {
        tableMap.set(new Identifier(tableEntry.identifier).toString(), tableEntry);
    }

    for (const tableEntry of lootTables) {
        tableMap.set(new Identifier(tableEntry.identifier).toString(), tableEntry);
    }

    const allTables = Array.from(tableMap.values());
    const items = table ? new LootTableFlattener(allTables, mergedTags).flatten(table.identifier) : [];
    return { items, isLoading: tagsLoading || lootLoading };
}
