import ToolRevealElement from "@/components/tools/elements/schema/reveal/ToolRevealElementType";
import type { ToolRevealElementType, ToolRevealType } from "@voxelio/breeze/core";
import { RenderSchemaChildren } from "@/components/tools/RenderSchema";
import type { WrappedComponentProps } from "../../DynamicSchemaComponent";

export default function ToolSectionSelectorComponent({
    component,
    dynamicProps
}: WrappedComponentProps<ToolRevealType, ToolRevealElementType>) {
    const { composant, currentId, setCurrentId } = dynamicProps;

    return (
        <div className="grid gap-4">
            <div className="grid max-xl:grid-cols-1 gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(225px, 1fr))" }}>
                {component.elements.map((element) => (
                    <ToolRevealElement
                        key={element.id}
                        element={element}
                        isSelected={currentId === element.id}
                        onSelect={() => setCurrentId(element.id)}
                    />
                ))}
            </div>

            <div className="h-1 my-4 rounded-full w-full bg-zinc-900" />
            <RenderSchemaChildren component={composant} />
        </div>
    );
}
