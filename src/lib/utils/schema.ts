import type { InterfaceConfiguration, Roadmap } from "@voxelio/breeze/core";

// Generic fetcher for any item from the /api/schema endpoint
export const fetchApiSchemaItem = async <T>(key: string): Promise<T | null> => {
    if (!key) {
        console.warn("fetchApiSchemaItem: key is missing");
        return null;
    }
    console.log(`fetchApiSchemaItem: Fetching schema item for key: ${key}`);
    const response = await fetch(`/api/schema?key=${key}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok for schema key ${key}`);
    }
    // Check if response is empty
    const text = await response.text();
    if (!text) {
        console.warn(`fetchApiSchemaItem: No content returned for key ${key}`);
        return null;
    }
    try {
        return JSON.parse(text) as T;
    } catch (e) {
        console.error(`fetchApiSchemaItem: Failed to parse JSON for key ${key}`, e);
        throw new Error(`Failed to parse JSON for schema key ${key}`);
    }
};

export const fetchSchemaData = async (
    schemaId: string, // This 'schemaId' is the 'id' from a roadmap section, used to find the actual content key
    concept: string | null | undefined,
    roadmapForConcept: Roadmap | null | undefined
): Promise<InterfaceConfiguration | null> => {
    if (!concept) {
        console.warn("fetchSchemaData: concept is missing, cannot fetch schema for id:", schemaId);
        return null;
    }

    if (!roadmapForConcept) {
        console.warn("fetchSchemaData: roadmap data is not available for concept:", concept);
        return null;
    }

    const schemaMeta = roadmapForConcept.schema.find((s) => s.id === schemaId);
    if (!schemaMeta?.content) {
        console.warn(`fetchSchemaData: schemaKeyId not found in roadmap for schemaId: ${schemaId} and concept: ${concept}`);
        return null;
    }
    const schemaKeyId = schemaMeta.content;
    return fetchApiSchemaItem<InterfaceConfiguration>(schemaKeyId);
};
