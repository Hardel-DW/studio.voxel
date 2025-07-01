import { useConfiguratorStore } from "@/components/tools/Store";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import EmptyCodeBlock from "@/components/ui/codeblock/EmptyCodeBlock";
import { Identifier } from "@voxelio/breeze/core";
import Translate from "@/components/tools/Translate";
import { useDebugStore } from "@/components/tools/debug/DebugStore";

interface CodeSectionProps {
    uniqueKey: string | undefined;
}

export function CodeSection({ uniqueKey }: CodeSectionProps) {
    const { elements, files } = useConfiguratorStore.getState();
    const { format, elements: debugElements } = useDebugStore();

    if (!uniqueKey) return null;

    const labeledElement = debugElements.get(uniqueKey);
    const identifier = Identifier.fromUniqueKey(uniqueKey);

    const codeToDisplay = (() => {
        if (format === "voxel") return elements.get(uniqueKey);
        if (format === "original") {
            const fileData = files[identifier.toFilePath()];
            return fileData ? JSON.parse(new TextDecoder().decode(fileData)) : undefined;
        }
        if (format === "datapack") {
            if (labeledElement?.type === "new" || labeledElement?.type === "updated") {
                return labeledElement?.element?.data;
            }
            return undefined;
        }
        return undefined;
    })();

    return (
        <div className="h-full flex flex-col">
            {labeledElement?.type !== "deleted" && codeToDisplay !== undefined ? (
                <CodeBlock language="json" title={identifier.toFileName()}>
                    {JSON.stringify(codeToDisplay, null, 4)}
                </CodeBlock>
            ) : (
                <EmptyCodeBlock title={identifier.toFileName()}>
                    {labeledElement?.type === "deleted" ? (
                        <Translate content="debug.code.deleted" />
                    ) : (
                        <Translate content="debug.code.unavailable" />
                    )}
                </EmptyCodeBlock>
            )}
        </div>
    );
}
