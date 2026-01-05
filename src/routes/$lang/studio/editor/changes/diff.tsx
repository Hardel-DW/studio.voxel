import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import CodeDiff from "@/components/ui/codeblock/CodeDiff";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/$lang/studio/editor/changes/diff")({
    component: ChangesDiffPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function parseFilePath(path: string): Identifier | null {
    const parts = path.split("/");
    if (parts.length < 4 || !path.endsWith(".json")) return null;

    const [, namespace, ...rest] = parts;
    const resourceWithExt = rest.pop();
    if (!resourceWithExt || !namespace) return null;

    const resource = resourceWithExt.replace(/\.json$/, "");
    const registry = rest.join("/");
    if (!registry || !resource) return null;

    return new Identifier({ namespace, registry, resource });
}

function ChangesDiffPage() {
    const t = useTranslate();
    const { file } = Route.useSearch();
    const files = useConfiguratorStore.getState().files;
    const compiledFiles = useConfiguratorStore.getState().compile().getFiles();

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

    const identifier = parseFilePath(file);
    const originalData = files[file];
    const compiledData = compiledFiles[file];
    const original = originalData ? JSON.stringify(JSON.parse(new TextDecoder().decode(originalData)), null, 4) : "";
    const compiled = compiledData ? JSON.stringify(JSON.parse(new TextDecoder().decode(compiledData)), null, 4) : "";
    const name = identifier?.toFileName(true) ?? file.split("/").pop() ?? "";

    return (
        <div className="flex flex-col h-full">
            <CodeDiff original={original} modified={compiled} name={name} path={file} />
        </div>
    );
}
