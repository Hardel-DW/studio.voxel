import { RenderComponent } from "@/components/tools/RenderComponent";
import Translate from "@/components/tools/Translate";
import type { ToolCategoryType } from "@voxelio/breeze/core";

export default function ToolCategory({ component }: { component: ToolCategoryType }) {
    return (
        <div className="not-first:mt-8">
            <div className="flex items-center gap-x-4 mb-8">
                <div className="h-1 flex-1 bg-zinc-700" />
                <h2 className="text-2xl font-semibold px-4">
                    <Translate content={component.title} schema={true} />
                </h2>
                <div className="h-1 flex-1 bg-zinc-700" />
            </div>
            <div className="flex flex-col gap-4">
                {component.children.map((child, index) => (
                    <RenderComponent key={index.toString()} component={child} index={index} />
                ))}
            </div>
        </div>
    );
}
