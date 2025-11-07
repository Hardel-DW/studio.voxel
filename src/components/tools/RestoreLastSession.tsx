import { Button } from "@/components/ui/Button";
import Translate from "@/components/ui/Translate";
import { hasSession, restoreSession } from "@/lib/utils/sessionPersistence";
import { toast, TOAST } from "../ui/Toast";
import { Datapack } from "@voxelio/breeze";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useNavigate, useParams } from "@tanstack/react-router";

export default function RestoreLastSession({ className }: { className?: string }) {
    const { lang } = useParams({ from: "/$lang" });
    const navigate = useNavigate();
    if (!hasSession()) return null;

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

    return (
        <Button variant="shimmer" onClick={handleRestore} className={className}>
            <Translate content="restore_session" />
        </Button>
    );
}