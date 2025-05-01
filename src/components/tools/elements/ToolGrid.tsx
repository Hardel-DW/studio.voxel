import { RenderComponent } from "@/components/tools/RenderComponent";
import type { FormComponent, ToolGridType } from "@voxelio/breeze/core";

export default function ToolGrid({ component }: { component: ToolGridType }) {
    return (
        <div
            className="grid max-xl:grid-cols-1 gap-4"
            style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${component.size ?? "255px"}, 1fr))`
            }}>
            {component.children.map((child: FormComponent, index: number) => (
                <RenderComponent key={index.toString()} component={child} index={index} />
            ))}
        </div>
    );
}
