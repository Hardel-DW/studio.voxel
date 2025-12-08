import { Identifier } from "@voxelio/breeze";
import { enchantableEntries } from "@/lib/data/tags";
import type { TreeNode } from "@/lib/utils/tree";
import { SLOT_CONFIGS } from "./slots";

type EnchantmentElement = {
    identifier: { namespace: string; registry: string; resource: string };
    slots: string[];
    supportedItems: string | string[];
    primaryItems?: string | string[];
    tags?: string[];
    exclusiveSet?: string | string[];
};

export function buildEnchantmentTree(elements: EnchantmentElement[], view: string): TreeNode {
    const root: TreeNode = { count: elements.length, children: new Map(), identifiers: [] };
    const builders: Record<string, () => void> = {
        tree: () => { },
        slots: () => buildBySlots(root, elements),
        items: () => buildByItems(root, elements),
        exclusive: () => buildByExclusive(root, elements)
    };

    builders[view]?.();
    return root;
}

function buildBySlots(root: TreeNode, elements: EnchantmentElement[]) {
    for (const config of SLOT_CONFIGS) {
        const matching = elements.filter((el) => el.slots.some((s) => config.slots.includes(s)));
        if (matching.length > 0) {
            root.children.set(config.id, createCategoryNode(matching));
        }
    }
}

function buildByItems(root: TreeNode, elements: EnchantmentElement[]) {
    for (const [key, identifier] of enchantableEntries) {
        const tag = identifier.toString();
        const matching = elements.filter((el) => {
            const supported = Array.isArray(el.supportedItems) ? el.supportedItems : [el.supportedItems];
            const primary = el.primaryItems ? (Array.isArray(el.primaryItems) ? el.primaryItems : [el.primaryItems]) : [];
            const allTags = [...supported, ...primary, ...(el.tags || [])];
            return allTags.includes(tag);
        });

        if (matching.length > 0) {
            root.children.set(key, createCategoryNode(matching));
        }
    }
}

function buildByExclusive(root: TreeNode, elements: EnchantmentElement[]) {
    const grouped = new Map<string, EnchantmentElement[]>();

    for (const el of elements) {
        if (el.exclusiveSet) {
            const sets = Array.isArray(el.exclusiveSet) ? el.exclusiveSet : [el.exclusiveSet];
            for (const set of sets) {
                if (!grouped.has(set)) grouped.set(set, []);
                grouped.get(set)?.push(el);
            }
        }
    }

    for (const [set, group] of grouped) {
        const name = set.startsWith("#") ? set : Identifier.toDisplay(set);
        root.children.set(name, createCategoryNode(group));
    }
}

function createCategoryNode(elements: EnchantmentElement[]): TreeNode {
    const children = new Map<string, TreeNode>();
    for (const el of elements) {
        const id = new Identifier(el.identifier);
        children.set(id.toResourceName(), {
            count: 0,
            children: new Map(),
            identifiers: [el.identifier],
            elementId: id.toUniqueKey()
        });
    }
    return { count: elements.length, children, identifiers: [] };
}
