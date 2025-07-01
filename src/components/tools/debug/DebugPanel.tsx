import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { RegistryElement } from "@/components/tools/debug/RegistryElement";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { ruwsc } from "@/lib/utils";
import Translate from "@/components/tools/Translate";
import { RightSection } from "@/components/tools/debug/RightSection";

export default function DebugPanel() {
    const {
        selectedElement,
        selectedRegistry,
        selectedNamespace,
        registries,
        namespaces,
        format,
        setSelectedRegistry,
        setSelectedNamespace,
        setSelectedElement,
        getFilteredElements,
        setFormat
    } = useDebugStore();

    const filteredElements = getFilteredElements();

    return (
        <>
            <div className="fixed border-zinc-800 border-t border-l bg-header-translucent backdrop-blur-xl rounded-2xl inset-4 p-8 z-200 flex flex-col starting:translate-y-2 starting:scale-95 duration-150 ease-bounce transition-[translate,scale,display,opacity]">
                <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
                    <div className="flex flex-col gap-4 min-h-0">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 mb-4 flex-shrink-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="z-10">
                                        <Button variant="ghost" className="min-w-[150px] justify-between">
                                            {selectedRegistry || <Translate content="debug.registry" />}
                                            <span className="ml-2">▼</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="z-100">
                                        {registries.map((registry) => (
                                            <DropdownMenuItem key={registry} onClick={() => setSelectedRegistry(registry)}>
                                                {ruwsc(registry)}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger className="z-10">
                                        <Button variant="ghost" className="min-w-[150px] justify-between">
                                            {selectedNamespace || <Translate content="debug.namespace" />}
                                            <span className="ml-2">▼</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="z-100">
                                        {namespaces.map((namespace) => (
                                            <DropdownMenuItem key={namespace} onClick={() => setSelectedNamespace(namespace)}>
                                                {ruwsc(namespace)}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="z-10">
                                        <Button variant="ghost" className="min-w-[150px] justify-between">
                                            {format === "voxel" ? (
                                                <Translate content="debug.format.voxel" />
                                            ) : format === "datapack" ? (
                                                <Translate content="debug.format.datapack" />
                                            ) : (
                                                <Translate content="debug.format.original" />
                                            )}
                                            <span className="ml-2">▼</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="z-100">
                                        <DropdownMenuItem onClick={() => setFormat("voxel")}>
                                            <Translate content="debug.format.voxel" />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFormat("datapack")}>
                                            <Translate content="debug.format.datapack" />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFormat("original")}>
                                            <Translate content="debug.format.original" />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 auto-rows-min">
                                {filteredElements.map((uniqueKey) => (
                                    <RegistryElement
                                        key={uniqueKey}
                                        uniqueKey={uniqueKey}
                                        selectedElement={selectedElement}
                                        onElementSelect={setSelectedElement}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <RightSection uniqueKey={selectedElement} />
                </div>
            </div>
        </>
    );
}
