import { FILE_STATUS, Identifier } from "@voxelio/breeze";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import EmptyCodeBlock from "@/components/ui/codeblock/EmptyCodeBlock";

interface CodeSectionProps {
    uniqueKey: string | undefined;
}

export function CodeSection({ uniqueKey }: CodeSectionProps) {
    const { elements, files } = useConfiguratorStore.getState();
    const { format, compiledDatapack, fileStatusComparator } = useDebugStore();

    if (!uniqueKey) return null;

    const identifier = Identifier.fromUniqueKey(uniqueKey);
    const fileStatus = fileStatusComparator?.getFileStatus(uniqueKey);

    const codeToDisplay = (() => {
        if (format === "voxel") return elements.get(uniqueKey);
        if (format === "original") {
            const fileData = files[identifier.toFilePath()];
            return fileData ? JSON.parse(new TextDecoder().decode(fileData)) : undefined;
        }
        if (format === "datapack") {
            if (fileStatus === FILE_STATUS.ADDED || fileStatus === FILE_STATUS.UPDATED) {
                return compiledDatapack?.getIndex(identifier.registry).get(uniqueKey)?.data;
            }
            return undefined;
        }
        return undefined;
    })();

    return (
        <div className="h-full flex flex-col">
            {fileStatus !== FILE_STATUS.DELETED && codeToDisplay !== undefined ? (
                <CodeBlock language="json" title={identifier.toFileName()}>
                    {JSON.stringify(codeToDisplay, null, 4)}
                </CodeBlock>
            ) : (
                <EmptyCodeBlock title={identifier.toFileName()}>
                    {fileStatus === FILE_STATUS.DELETED ? (
                        <Translate content="debug.code.deleted" />
                    ) : (
                        <Translate content="debug.code.unavailable" />
                    )}
                </EmptyCodeBlock>
            )}
        </div>
    );
}
