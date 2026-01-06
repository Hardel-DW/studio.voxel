import { createFileRoute } from "@tanstack/react-router";
import { useChangesStore } from "@/components/tools/concept/changes/ChangesStore";
import { DiffEmptyState } from "@/components/tools/concept/changes/DiffEmptyState";
import { DiffHeader } from "@/components/tools/concept/changes/DiffHeader";
import CodeDiff from "@/components/ui/codeblock/CodeDiff";
import { parseFilePath } from "@/lib/utils/concept";

export const Route = createFileRoute("/$lang/studio/editor/changes/diff")({
    component: ChangesDiffPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function decodeFile(data: Uint8Array | undefined): string {
    if (!data) return "";
    return JSON.stringify(JSON.parse(new TextDecoder().decode(data)), null, 4);
}

function ChangesDiffPage() {
    const { file } = Route.useSearch();
    const { lang } = Route.useParams();
    const { originalFiles, compiledFiles } = useChangesStore();

    if (!!file && file.endsWith(".json")) return <DiffEmptyState file={file} />;
    const identifier = parseFilePath(file);
    const name = identifier?.toFileName(true) ?? file.split("/").pop() ?? "";
    const original = decodeFile(originalFiles[file]);
    const compiled = decodeFile(compiledFiles[file]);

    return (
        <div className="flex flex-col h-full">
            <DiffHeader name={name} file={file} lang={lang} currentView="diff" />
            <CodeDiff original={original} modified={compiled} />
        </div>
    );
}
