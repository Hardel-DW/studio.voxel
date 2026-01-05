import { Identifier } from "@voxelio/breeze";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import CodeDiff from "@/components/ui/codeblock/CodeDiff";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { parseFilePath } from "@/lib/utils/concept";
import { computeLineDiff } from "@/lib/utils/diff";

type ViewMode = "diff" | "voxel" | "patch";

export const Route = createFileRoute("/$lang/studio/editor/changes/diff")({
    component: ChangesDiffPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function ChangesDiffPage() {
    const t = useTranslate();
    const { file } = Route.useSearch();
    const [viewMode, setViewMode] = useState<ViewMode>("diff");
    const { files, elements, logger } = useConfiguratorStore.getState();
    const compiledDatapack = useConfiguratorStore.getState().compile();
    const identifier = parseFilePath(file);
    const uniqueKey = identifier?.toUniqueKey();
    const originalData = files[file];
    const compiledFiles = compiledDatapack.getFiles();
    const compiledData = compiledFiles[file];
    const original = originalData ? JSON.stringify(JSON.parse(new TextDecoder().decode(originalData)), null, 4) : "";
    const compiled = compiledData ? JSON.stringify(JSON.parse(new TextDecoder().decode(compiledData)), null, 4) : "";
    const voxelData = uniqueKey ? elements.get(uniqueKey) : undefined;
    const logsData = identifier && logger
        ? logger.getChangeSets().filter((change) => new Identifier(change.identifier).equals(identifier))
        : [];
    const name = identifier?.toFileName(true) ?? file.split("/").pop() ?? "";
    const diffLines = computeLineDiff(original, compiled);
    const addedCount = diffLines.filter((l) => l.type === "added").length;
    const removedCount = diffLines.filter((l) => l.type === "removed").length;
    const view = ["diff", "voxel", "patch"] as const;

    if (!file) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
                <img src="/icons/search.svg" className="size-12 opacity-20 invert" alt="Search icon" />
                <p className="text-sm">{t("changes:diff.select_file")}</p>
            </div>
        );
    }

    if (!file.endsWith(".json")) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
                <img src="/icons/tools/crafting/code.svg" className="size-12 opacity-20 invert" alt="Code icon" />
                <p className="text-sm">{t("changes:diff.preview_unavailable")}</p>
                <p className="text-xs text-zinc-600">{file}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between gap-1 px-4 py-2 border-b border-zinc-800/50 bg-zinc-950/20">
                <div className="relative flex h-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-red-500" />
                            <div className="size-3 rounded-full bg-yellow-500" />
                            <div className="size-3 rounded-full bg-green-500" />
                        </div>
                        <span className="font-mono text-sm text-zinc-300">{name}</span>
                        {viewMode === "diff" && (
                            <div className="flex items-center gap-2 text-xs font-mono">
                                {addedCount > 0 && <span className="text-green-400">+{addedCount}</span>}
                                {removedCount > 0 && <span className="text-red-400">-{removedCount}</span>}
                                {addedCount === 0 && removedCount === 0 && <span className="text-zinc-500">{t("code_diff.no_changes")}</span>}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-600 font-mono">{file}</span>
                    <div className="flex items-center gap-2">
                        {view.map((mode) => (
                            <button key={mode} type="button" onClick={() => setViewMode(mode)} className={cn("p-1.5 cursor-pointer rounded transition-colors text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50", viewMode === mode && "bg-zinc-800 text-zinc-100")}>
                                <img src={`/icons/tools/diff/${mode}.svg`} className="size-4" alt={mode} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {viewMode === "diff" && <CodeDiff original={original} modified={compiled} />}
            {viewMode === "voxel" && <CodeBlock language="json">{voxelData ? JSON.stringify(voxelData, null, 4) : t("changes:diff.no_data")}</CodeBlock>}
            {viewMode === "patch" && <CodeBlock language="json">{logsData.length > 0 ? JSON.stringify(logsData, null, 4) : t("changes:diff.no_data")}</CodeBlock>}
        </div>
    );
}