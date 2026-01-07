import { createFileRoute } from "@tanstack/react-router";
import { DiffEmptyState } from "@/components/tools/concept/changes/DiffEmptyState";
import { DiffHeader } from "@/components/tools/concept/changes/DiffHeader";
import JsonEditor from "@/components/ui/codeblock/JsonEditor";
import { useChangesStore } from "@/lib/store/ChangesStore";
import { parseFilePath } from "@/lib/utils/concept";

export const Route = createFileRoute("/$lang/studio/editor/changes/edit")({
    component: ChangesEditPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function decodeFile(data: Uint8Array | undefined): string {
    if (!data) return "";
    return JSON.stringify(JSON.parse(new TextDecoder().decode(data)), null, 4);
}

function ChangesEditPage() {
    const { file } = Route.useSearch();
    const { lang } = Route.useParams();
    const { compiledFiles } = useChangesStore();

    if (!file || !file.endsWith(".json")) return <DiffEmptyState file={file} />;
    const identifier = parseFilePath(file);
    const name = identifier?.toFileName(true) ?? file.split("/").pop() ?? "";
    const compiled = decodeFile(compiledFiles[file]);

    return (
        <div className="flex flex-col h-full">
            <DiffHeader name={name} file={file} lang={lang} currentView="edit" />
            <JsonEditor key={file} initialValue={compiled} className="flex-1 bg-zinc-950" />
        </div>
    );
}
