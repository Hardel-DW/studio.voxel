import { RenderComponent } from "@/components/tools/RenderComponent";
import Translate from "@/components/tools/Translate";
import Button from "@/components/ui/Button";
import type { ToolSectionType } from "@voxelio/breeze/core";

export default function ToolSection({
    component
}: {
    component: ToolSectionType;
}) {
    return (
        <div className="not-first:mt-16 h-full">
            <div className="flex flex-col ring-0 transition-all h-full">
                <div className="py-2 px-2 gap-4 flex flex-wrap justify-between items-center cursor-pointer shrink-0">
                    <div className="relative">
                        <h2 className="text-2xl font-semibold">
                            <Translate content={component.title} schema={true} />
                        </h2>
                        <hr className="!m-0 absolute -bottom-2 left-0 right-0" />
                    </div>
                    {component.button && (
                        <Button href={component.button.url} variant="ghost">
                            <Translate content={component.button.text} schema={true} />
                        </Button>
                    )}
                </div>
                <div className="transition-height duration-100 ease-in-out h-full">
                    <div className="pt-4 gap-4 flex items flex-col h-full">
                        {component.children.map((child, index) => (
                            <RenderComponent key={component.id + index.toString()} component={child} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
