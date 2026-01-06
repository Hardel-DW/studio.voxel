import { Identifier } from "@voxelio/breeze";
import { createFileRoute } from "@tanstack/react-router";
import { DiffEmptyState } from "@/components/tools/concept/changes/DiffEmptyState";
import { DiffHeader } from "@/components/tools/concept/changes/DiffHeader";
import { useConfiguratorStore } from "@/components/tools/Store";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import { useTranslate } from "@/lib/i18n";
import { parseFilePath } from "@/lib/utils/concept";

export const Route = createFileRoute("/$lang/studio/editor/changes/patch")({
    component: ChangesPatchPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function ChangesPatchPage() {
    const t = useTranslate();
    const { file } = Route.useSearch();
    const { lang } = Route.useParams();
    const { logger } = useConfiguratorStore.getState();

    if (!file || !file.endsWith(".json")) return <DiffEmptyState file={file} />;
    const identifier = parseFilePath(file);
    const name = identifier?.toFileName(true) ?? file.split("/").pop() ?? "";
    const logsData =
        identifier && logger ? logger.getChangeSets().filter((change) => new Identifier(change.identifier).equals(identifier)) : [];

    return (
        <div className="flex flex-col h-full">
            <DiffHeader name={name} file={file} lang={lang} currentView="patch" />
            <CodeBlock language="json">{logsData.length > 0 ? JSON.stringify(logsData, null, 4) : t("changes:diff.no_data")}</CodeBlock>
        </div>
    );
}
