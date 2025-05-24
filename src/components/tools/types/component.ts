import type { Action, Condition, ValueRenderer } from "@voxelio/breeze";

// Base type for common component properties
export type BaseComponent = {
    hide?: Condition;
};

export type BaseInteractiveComponent = BaseComponent & {
    action: Action;
    renderer: ValueRenderer;
    lock?: Lock[];
    elementId?: string;
};

export type Lock = {
    text: TranslateTextType;
    condition: Condition;
};

export type LockRenderer = { isLocked: boolean; text?: TranslateTextType };

export type BaseDynamicSchema<T> = BaseComponent & {
    elements: T[];
};

export type TranslateTextType = string | { key: string };

export type FieldConfiguration = Record<
    string,
    {
        name: TranslateTextType;
        type: FieldType;
        icon?: string;
    }
>;

export type FieldType = "string" | "number" | "boolean" | "array" | "tags" | "effects" | "deleted";

export function getKey(text: TranslateTextType): string {
    if (typeof text === "string") {
        return text;
    }
    return text.key;
}
