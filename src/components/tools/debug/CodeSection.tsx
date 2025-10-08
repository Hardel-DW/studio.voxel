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
    const { elements, files, logger } = useConfiguratorStore.getState();
    const { format, compiledDatapack, fileStatusComparator } = useDebugStore();
    if (!uniqueKey) return null;

    const identifier = Identifier.fromUniqueKey(uniqueKey);
    const fileStatus = fileStatusComparator?.getFileStatus(uniqueKey);

    const codeToDisplay = (() => {
        switch (format) {
            case "voxel":
                return elements.get(uniqueKey);
            case "original": {
                const fileData = files[identifier.toFilePath()];
                if (!fileData) return undefined;
                return JSON.parse(new TextDecoder().decode(fileData));
            }
            case "datapack": {
                if (fileStatus === FILE_STATUS.ADDED || fileStatus === FILE_STATUS.UPDATED) {
                    return compiledDatapack?.getIndex(identifier.registry).get(uniqueKey)?.data;
                }
                return undefined;
            }
            case "logs": {
                const changeSets = logger?.getChangeSets().filter((change) => new Identifier(change.identifier).equals(identifier));
                return changeSets?.length ? changeSets : undefined;
            }
            default:
                return undefined;
        }
    })();

    return (
        <div className="h-full flex flex-col">
            {fileStatus !== FILE_STATUS.DELETED && codeToDisplay !== undefined ? (
                <CodeBlock language="json" title={identifier.toFileName()}>
                    {JSON.stringify(codeToDisplay, null, 4)}
                </CodeBlock>
            ) : (
                <EmptyCodeBlock title={identifier.toFileName()}>
                    <Translate content={fileStatus === FILE_STATUS.DELETED ? "debug.code.deleted" : "debug.code.unavailable"} />
                </EmptyCodeBlock>
            )}
        </div>
    );
}
