import { FILE_STATUS, Identifier } from "@voxelio/breeze";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import EmptyCodeBlock from "@/components/ui/codeblock/EmptyCodeBlock";
import Translate from "@/components/ui/Translate";

interface CodeSectionProps {
    uniqueKey: string | undefined;
}

const tabs = {
    original: {
        title: "Source",
        description: "Original datapack files",
    },
    voxel: {
        title: "Modified",
        description: "Elements in Voxel format",
    },
    datapack: {
        title: "Output",
        description: "Files as they will be in the final datapack",
    },
    logs: {
        title: "Logs",
        description: "Logs related to modifications",
    },
};

export function CodeSection({ uniqueKey }: CodeSectionProps) {
    const { elements, files, logger } = useConfiguratorStore.getState();
    const { format, compiledDatapack, fileStatusComparator, setFormat } = useDebugStore();
    if (!uniqueKey) return null;

    const identifier = Identifier.fromUniqueKey(uniqueKey);
    const fileStatus = fileStatusComparator?.getFileStatus(uniqueKey);

    const codeToDisplay = (() => {
        switch (format) {
            case "voxel":
                return elements.get(uniqueKey);
            case "original": {
                const fileData = files[identifier.toFilePath()];
                return fileData ? JSON.parse(new TextDecoder().decode(fileData)) : undefined;
            }
            case "datapack":
                return (fileStatus === FILE_STATUS.ADDED || fileStatus === FILE_STATUS.UPDATED)
                    ? compiledDatapack?.getIndex(identifier.registry).get(uniqueKey)?.data
                    : undefined;
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
                <CodeBlock language="json" title={identifier.toFileName()} tabs={tabs} onTabChange={(tab) => setFormat(tab as keyof typeof tabs)}>
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
