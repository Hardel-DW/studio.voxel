import Translate from "@/components/tools/Translate";
import { cn } from "@/lib/utils";
import type { ToolSectionSelectorSection, ToolSectionSelectorType } from "@voxelio/breeze/core";
import { RenderSchemaChildren } from "../RenderSchema";
import type { WrappedComponentProps } from "./DynamicSchemaComponent";
export default function ToolSectionSelectorComponent({
    component,
    dynamicProps
}: WrappedComponentProps<ToolSectionSelectorType, ToolSectionSelectorSection>) {
    const { currentElement, composant, currentId, setCurrentId } = dynamicProps;

    return (
        <div className="not-first:mt-16 h-full">
            <div className="flex flex-col ring-0 transition-all h-full">
                <div className="py-2 px-2 gap-4 flex flex-wrap justify-between items-center cursor-pointer shrink-0">
                    <div className="relative">
                        <h2 className="text-2xl font-semibold">
                            <Translate content={currentElement?.title} schema={true} />
                        </h2>
                        <hr className="!m-0 absolute -bottom-2 left-0 right-0" />
                    </div>
                    {component.elements && (
                        <div className="flex gap-x-2 py-2 px-2 items-center rounded-2xl p-1 bg-black/50 border-t-2 border-l-2 border-stone-900 shrink-0 relative overflow-hidden">
                            {component.elements.map((element) => (
                                <div
                                    className={cn("px-4 py-2 rounded-xl", {
                                        "bg-rose-900 text-white": currentId === element.id
                                    })}
                                    key={element.id}
                                    onKeyDown={() => setCurrentId(element.id)}
                                    onClick={() => setCurrentId(element.id)}>
                                    <p className="font-semibold line-clamp-1 text-xs md:text-sm">
                                        <Translate content={element.title} schema={true} />
                                    </p>
                                </div>
                            ))}

                            <div className="absolute inset-0 -z-10 brightness-30">
                                <img src="/images/shine.avif" alt="Shine" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="transition-height duration-100 ease-in-out h-full">
                    <div className="pt-4 gap-4 flex items flex-col h-full">
                        <RenderSchemaChildren component={composant} />
                    </div>
                </div>
            </div>
        </div>
    );
}
