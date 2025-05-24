import type { TagType } from "@voxelio/breeze/schema";

/**
 * Represents a Minecraft tag system that can contain multiple values.
 * Tags are used to group blocks, items, entities, or functions together.
 */
export default class Tags {
    /**
     * Creates a new Tags instance
     * @param tags The tag data containing values and optional replace property
     */
    constructor(public readonly tags: TagType) {
        this.tags = tags;
    }

    /**
     * Gets the raw tag data
     * @returns The TagType object containing values and replace property
     * @example
     * const tag = new Tags({
     *   replace: false,
     *   values: ["minecraft:diamond_sword", "minecraft:iron_sword"]
     * });
     * const data = tag.getTags(); // Returns the TagType object
     */
    public getTags() {
        return this.tags;
    }

    /**
     * Checks if a specific value exists in the tag
     * @param name The value to check for
     * @returns True if the value exists in the tag
     * @example
     * const tag = new Tags({
     *   values: ["minecraft:diamond_sword"]
     * });
     * tag.hasValue("minecraft:diamond_sword"); // Returns true
     */
    public hasValue(name: string) {
        return this.tags.values.includes(name);
    }

    /**
     * Gets the first non-tag value in the tag
     * @returns The first value in the tag's values array that doesn't start with #
     * @example
     * const tag = new Tags({
     *   values: ["#minecraft:swords", "minecraft:diamond_sword"]
     * });
     * tag.getFirstValue(); // Returns "minecraft:diamond_sword"
     */
    public getFirstValue(): string | null {
        for (const value of this.tags.values) {
            const strValue = typeof value === "string" ? value : value.id;
            if (!strValue.startsWith("#")) {
                return strValue;
            }
        }

        return null;
    }

    /**
     * Gets all values in the tag
     * @returns Array of values in the tag
     * @example
     * const tag = new Tags({
     *   values: ["minecraft:diamond_sword", "minecraft:iron_sword"]
     * });
     * tag.getValues(); // Returns ["minecraft:diamond_sword", "minecraft:iron_sword"]
     */
    public getValues() {
        return this.tags.values;
    }
}

export function isTag(tag: any): tag is TagType {
    return tag && typeof tag === "object" && "values" in tag;
}
