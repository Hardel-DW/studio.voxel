import { createFileRoute } from "@tanstack/react-router";
import { DiffEmptyState } from "@/components/tools/concept/changes/DiffEmptyState";
import { DiffHeader } from "@/components/tools/concept/changes/DiffHeader";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { parseFilePath } from "@/lib/utils/concept";

export const Route = createFileRoute("/$lang/studio/editor/changes/voxel")({
    component: ChangesVoxelPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function ChangesVoxelPage() {
    const t = useTranslate();
    const { file } = Route.useSearch();
    const { lang } = Route.useParams();
    const { elements } = useConfiguratorStore.getState();

    if (!file || !file.endsWith(".json")) return <DiffEmptyState file={file} />;
    const identifier = parseFilePath(file);
    const uniqueKey = identifier?.toUniqueKey();
    const fileName = file?.split("/").pop();
    const name = identifier?.toFileName(true) ?? fileName ?? "";
    const voxelData = uniqueKey ? elements.get(uniqueKey) : undefined;

    return (
        <div className="flex flex-col h-full">
            <DiffHeader name={name} file={file} lang={lang} currentView="voxel" />
            <CodeBlock language="json">{voxelData ? JSON.stringify(voxelData, null, 4) : t("changes:diff.no_data")}</CodeBlock>
        </div>
    );
}
