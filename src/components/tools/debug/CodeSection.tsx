import { useConfiguratorStore } from "@/components/tools/Store";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import EmptyCodeBlock from "@/components/ui/codeblock/EmptyCodeBlock";
import { Identifier, getLabeledIdentifier } from "@voxelio/breeze/core";
import type { LabeledElement } from "@voxelio/breeze/core";
import Translate from "../Translate";
import { useDebugStore } from "./DebugStore";

interface CodeSectionProps {
    code: LabeledElement | undefined;
}

export function CodeSection({ code }: CodeSectionProps) {
    const { name, version, elements, files } = useConfiguratorStore.getState();
    const { closeDebugModal, format } = useDebugStore();

    if (!code) return null;
    const identifier = getLabeledIdentifier(code);
    const element = elements.get(new Identifier(identifier).toUniqueKey());

    const getCode = () => {
        if (code.type === "deleted") return;

        if (format === "voxel") return element;
        if (format === "datapack") return code.element.data;
        if (format === "original") return JSON.parse(new TextDecoder().decode(files[new Identifier(identifier).toFilePath()]));
        return code;
    };

    return (
        <div className="h-full pt-12 relative flex flex-col">
            <div className="absolute top-0 left-0 px-2">
                <p className="text-zinc-400">{name}</p>
                <p className="text-xs text-zinc-500">Pack Version - {version}</p>
            </div>
            <button
                className="absolute cursor-pointer top-1 right-0 rounded-xl text-zinc-500 hover:text-zinc-200 transition-colors bg-zinc-950/10 px-2 py-1 border-zinc-950"
                type="button"
                onClick={closeDebugModal}>
                <Translate content="tools.debug.quit" />
            </button>
            <div className="flex-1 overflow-y-auto">
                {code.type !== "deleted" ? (
                    <CodeBlock language="json" title={new Identifier(identifier).toFileName()}>
                        {JSON.stringify(getCode(), null, 4)}
                    </CodeBlock>
                ) : (
                    <EmptyCodeBlock title={new Identifier(identifier).toFileName()}>This files is deleted.</EmptyCodeBlock>
                )}
            </div>
        </div>
    );
}
