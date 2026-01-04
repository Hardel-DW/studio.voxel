import { FILE_STATUS, Identifier } from "@voxelio/breeze";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";

interface CodeSectionProps {
    uniqueKey: string | undefined;
}

const tabs = {
    original: {
        title: "debug:tab.source.title",
        description: "debug:tab.source.description"
    },
    voxel: {
        title: "debug:tab.modified.title",
        description: "debug:tab.modified.description"
    },
    datapack: {
        title: "debug:tab.output.title",
        description: "debug:tab.output.description"
    },
    logs: {
        title: "debug:tab.logs.title",
        description: "debug:tab.logs.description"
    }
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
                return fileStatus === FILE_STATUS.ADDED || fileStatus === FILE_STATUS.UPDATED
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

    const title = fileStatus !== FILE_STATUS.DELETED && codeToDisplay !== undefined;
    return (
        <div className="h-full flex flex-col">
            <CodeBlock
                language="json"
                title={title ? identifier.toFileName() : "debug:element.deleted"}
                tabs={tabs}
                defaultTab={format}
                onTabChange={(tab) => setFormat(tab as keyof typeof tabs)}>
                {title ? JSON.stringify(codeToDisplay, null, 4) : "debug:element.not_modified"}
            </CodeBlock>
        </div>
    );
}
