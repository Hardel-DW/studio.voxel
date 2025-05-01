import Donation from "@/components/tools/elements/Donation";
import { InteractiveComponent } from "@/components/tools/elements/InteractiveComponent";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInlineSlot from "@/components/tools/elements/ToolInlineSlot";
import ToolIteration from "@/components/tools/elements/ToolIteration";
import ToolRange from "@/components/tools/elements/ToolRange";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSelector from "@/components/tools/elements/ToolSelector";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import ToolSwitch from "@/components/tools/elements/ToolSwitch";
import ToolSwitchSlot from "@/components/tools/elements/ToolSwitchSlot";
import ToolProperty from "@/components/tools/elements/schema/property/ToolProperty";
import ToolReveal from "@/components/tools/elements/schema/reveal/ToolReveal";
import TextRender from "@/components/tools/elements/text/TextRender";
import type { FormComponent } from "@voxelio/breeze/core";
import ErrorBoundary from "../ui/ErrorBoundary";
import { BaseComponent } from "./elements/BaseComponent";
import ErrorPlaceholder from "./elements/error/Card";
import ToolSectionSelector from "./elements/ToolSectionSelector";
import { DynamicSchemaComponent } from "./elements/DynamicSchemaComponent";
import ToolSwitchSlotSpecial from "./elements/ToolSwitchSlotSpecial";

type ComponentMap = {
    [K in FormComponent["type"]]: React.ComponentType<{
        component: Extract<FormComponent, { type: K }>;
        index?: number;
    }>;
};

const COMPONENT_MAP: ComponentMap = {
    Counter: InteractiveComponent(ToolCounter),
    Selector: InteractiveComponent(ToolSelector),
    SectionSelector: DynamicSchemaComponent(ToolSectionSelector),
    Range: InteractiveComponent(ToolRange),
    Switch: InteractiveComponent(ToolSwitch),
    Slot: InteractiveComponent(ToolSlot),
    SwitchSlot: InteractiveComponent(ToolSwitchSlot),
    SwitchSlotSpecial: InteractiveComponent(ToolSwitchSlotSpecial),
    InlineSlot: InteractiveComponent(ToolInlineSlot),
    Property: InteractiveComponent(ToolProperty),
    Donation: BaseComponent(Donation),
    Reveal: DynamicSchemaComponent(ToolReveal),
    Category: BaseComponent(ToolCategory),
    Section: BaseComponent(ToolSection),
    Grid: BaseComponent(ToolGrid),
    Text: BaseComponent(TextRender),
    Iteration: BaseComponent(ToolIteration)
};

export function RenderComponent({ component, index }: { component: FormComponent; index: number }) {
    const Component = COMPONENT_MAP[component.type] as React.ComponentType<{
        component: typeof component;
        index: number;
    }>;

    return Component ? (
        <ErrorBoundary fallback={(error) => <ErrorPlaceholder error={error} />}>
            <Component component={component} index={index} />
        </ErrorBoundary>
    ) : null;
}
