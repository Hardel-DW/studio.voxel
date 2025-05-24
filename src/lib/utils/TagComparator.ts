import type { DataDrivenRegistryElement, OptionalTag, TagType } from "@voxelio/breeze";
import { Identifier, type IdentifierObject } from "@voxelio/breeze";

/**
 * A utility class for comparing and processing Minecraft tags.
 * Used to handle tag references and resolve recursive tag values.
 */
export default class TagsComparator {
    /**
     * Creates a new TagsComparator instance
     * @param tags Array of tag registry elements to process
     */
    constructor(private readonly tags: DataDrivenRegistryElement<TagType>[]) {}

    /**
     * Gets all values from all tags, merging them into a single list
     * @returns Array of all unique values from all tags
     */
    public getAllValues(): string[] {
        const values = new Set<string>();
        const processedTags = new Set<string>();

        for (const tag of this.tags) {
            this.addValuesFromTag(tag, values, processedTags);
        }

        return Array.from(values);
    }

    /**
     * Gets all values recursively from a specific tag, removing duplicates.
     * @param identifier The identifier of the tag to process
     * @returns Array of unique values from the tag
     */
    public getRecursiveValues(identifier: IdentifierObject): string[] {
        const values = new Set<string>();
        const processedTags = new Set<string>();

        const element = this.tags.find((tag) => new Identifier(tag.identifier).equalsObject(identifier));
        if (element) {
            this.addValuesFromTag(element, values, processedTags);
        }

        return Array.from(values);
    }

    /**
     * Recursively add values from a tag to the set
     * @param tag The tag to process
     * @param accumulator The set to add values to
     * @param processedTags Set of tag IDs that have already been processed (to prevent infinite loops)
     */
    private addValuesFromTag(element: DataDrivenRegistryElement<TagType>, accumulator: Set<string>, processedTags: Set<string>): void {
        if (this.isTagProcessed(element, processedTags)) return;
        for (const value of element.data.values) {
            this.processValue(value, accumulator, processedTags);
        }
    }

    private isTagProcessed(element: DataDrivenRegistryElement<TagType>, processedTags: Set<string>): boolean {
        const tagId = new Identifier(element.identifier).toString();
        if (processedTags.has(tagId)) return true;
        processedTags.add(tagId);
        return false;
    }

    private processValue(value: string | OptionalTag, accumulator: Set<string>, processedTags: Set<string>): void {
        if (typeof value === "string") {
            this.processStringValue(value, accumulator, processedTags);
        } else {
            this.processOptionalTag(value, accumulator, processedTags);
        }
    }

    private processStringValue(value: string, accumulator: Set<string>, processedTags: Set<string>): void {
        if (value.startsWith("#")) {
            const tagPath = value.slice(1);
            const tagId = Identifier.of(tagPath, "tags/item");
            this.processTagReference(tagId.toString(), accumulator, processedTags);
        } else {
            accumulator.add(value);
        }
    }

    private processTagReference(tagId: string, accumulator: Set<string>, processedTags: Set<string>): void {
        const referencedTag = this.findTagByPath(tagId);
        if (referencedTag) {
            this.addValuesFromTag(referencedTag, accumulator, processedTags);
        }
    }

    private processOptionalTag(tag: OptionalTag, accumulator: Set<string>, processedTags: Set<string>): void {
        if (!tag.required) return;
        this.processTagReference(tag.id, accumulator, processedTags);
    }

    /**
     * Find a tag by its path in the tags array
     * @param path The path to search for
     * @returns The found tag or undefined
     */
    private findTagByPath(path: string): DataDrivenRegistryElement<TagType> | undefined {
        return this.tags.find((tag) => new Identifier(tag.identifier).toString() === path);
    }
}
