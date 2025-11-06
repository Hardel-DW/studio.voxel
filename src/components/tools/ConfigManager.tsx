import { ClientOnly, useNavigate, useParams } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { Button, LinkButton } from "@/components/ui/Button";
import { TOAST, toast } from "@/components/ui/Toast";
import Translate from "@/components/ui/Translate";
import { hasSession, restoreSession } from "@/lib/utils/sessionPersistence";
import { Datapack } from "@voxelio/breeze";

export default function ConfigManager(props: PropsWithChildren) {
    const { lang } = useParams({ from: "/$lang" });
    const navigate = useNavigate();
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    const hasSavedSession = hasSession();

    const handleRestore = async () => {
        try {
            const session = restoreSession();
            if (!session) {
                toast("No session found", TOAST.ERROR);
                return;
            }

            const datapack = new Datapack(session.files);
            const result = datapack.parse();
            const restoredElements = session.logger.applyChangeSets(session.logger.getChangeSets(), result.elements);
            useConfiguratorStore.getState().setup({ ...result, logger: session.logger, elements: restoredElements }, session.isModded, session.name);
            useExportStore.getState().setGitRepository(session.owner, session.repositoryName, session.branch, "");
            useExportStore.getState().setInitializing(session.isInitializing);

            toast("Session restored successfully", TOAST.SUCCESS);
            navigate({ to: "/$lang/studio/editor", params: { lang } });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "Failed to restore session";
            toast("Error", TOAST.ERROR, errorMessage);
        }
    };

    if (hasElements) return props.children;

    return (
        <div className="size-full flex items-center justify-center flex-col gap-y-4">
            <h1 className="text-zinc-400 text-2xl font-bold">
                <Translate content="no_config.title" />
            </h1>
            <div className="text-zinc-400 text-sm text-center">
                <Translate content="no_config.description.1" />
                <br />
                <Translate content="no_config.description.2" />
            </div>
            <div className="w-1/2">
                <hr />
            </div>
            <div className="flex gap-4">
                {hasSavedSession && (
                    <ClientOnly>
                        <Button variant="shimmer" size="sm" onClick={handleRestore}>
                            <Translate content="restore_session" />
                        </Button>
                    </ClientOnly>
                )}
                <LinkButton variant="ghost_border" size="sm" href={`/${lang}/studio`}>
                    <Translate content="back" />
                </LinkButton>
            </div>
        </div>
    );
}
