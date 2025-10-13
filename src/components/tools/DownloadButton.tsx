import type { FileStatus } from "@voxelio/breeze";
import { DatapackDownloader } from "@voxelio/breeze";
import type { RefObject } from "react";
import { useRef, useState } from "react";
import SettingsDialog from "@/components/tools/SettingsDialog";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import Translate from "@/components/tools/Translate";
import { Button, LinkButton } from "@/components/ui/Button";
import { Dialog, DialogCloseButton, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Loader from "@/components/ui/Loader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { TOAST, toast } from "@/components/ui/Toast";
import { cn, encodeToBase64 } from "@/lib/utils";
import { downloadFile } from "@/lib/utils/download";

type ActionType = "push" | "pr";

export default function DownloadButton({ containerRef }: { containerRef?: RefObject<HTMLDivElement | null> }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        type: ActionType;
        changes: Map<string, FileStatus>;
        files: Record<string, string | null>;
    } | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const confirmDialogRef = useRef<HTMLDivElement>(null);
    const isGitRepository = useExportStore((state) => state.isGitRepository);
    const owner = useExportStore((state) => state.owner);
    const repo = useExportStore((state) => state.repositoryName);
    const branch = useExportStore((state) => state.branch);
    const token = useExportStore((state) => state.token);

    const handleDownload = async () => {
        const { logger, name, isModded } = useConfiguratorStore.getState();
        if (!logger) return;

        const content = useConfiguratorStore.getState().compile();
        const response = await content.generate(logger);
        const filename = DatapackDownloader.getFileName(name, isModded);
        downloadFile(response, filename);
        dialogRef.current?.showPopover();
    };

    const prepareChanges = () => {
        const files = useConfiguratorStore.getState().files;
        const compiled = useConfiguratorStore.getState().compile();
        const compiledFiles = compiled.getFiles();
        const changes = new DatapackDownloader(compiledFiles).getDiff(files);
        if (changes.size === 0) {
            toast("No changes detected", TOAST.INFO);
            return null;
        }

        const filesToUpload = Object.fromEntries(
            Array.from(changes).map(([path, status]) => [path, status === "deleted" ? null : encodeToBase64(compiledFiles[path])])
        );

        return { changes, filesToUpload };
    };

    const handlePull = () => {
        if (!token) {
            toast("Authentication token missing", TOAST.ERROR);
            return;
        }

        const result = prepareChanges();
        if (!result) return;

        setPendingAction({ type: "pr", changes: result.changes, files: result.filesToUpload });
        confirmDialogRef.current?.showPopover();
    };

    const handlePush = () => {
        if (!token) {
            toast("Authentication token missing", TOAST.ERROR);
            return;
        }

        const result = prepareChanges();
        if (!result) return;

        setPendingAction({ type: "push", changes: result.changes, files: result.filesToUpload });
        confirmDialogRef.current?.showPopover();
    };

    const executeAction = async () => {
        if (!pendingAction || !token) return;

        setIsProcessing(true);
        confirmDialogRef.current?.hidePopover();

        try {
            const response = await fetch(pendingAction.type === "pr" ? "/api/github/pr" : "/api/github/push", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    owner,
                    repo,
                    branch,
                    files: pendingAction.files
                })
            });

            if (!response.ok) {
                const error = await response.json();
                toast(`Failed to ${pendingAction.type === "pr" ? "create PR" : "push"}`, TOAST.ERROR, error.error);
                return;
            }

            const result = await response.json();
            if (pendingAction.type === "pr") {
                toast("Pull request created", TOAST.SUCCESS, result.prUrl);
            } else {
                toast("Changes pushed", TOAST.SUCCESS, `${result.filesModified} files modified`);
            }
        } catch (error) {
            console.error("Failed to execute action:", error);
            toast(`Failed to ${pendingAction.type === "pr" ? "create PR" : "push"}`, TOAST.ERROR);
        } finally {
            setIsProcessing(false);
            setPendingAction(null);
        }
    };

    const handleInitRepository = () => {
        console.log("Init repository clicked");
    };

    return (
        <>
            <Popover className="w-full">
                <PopoverTrigger className="w-full">
                    <Button type="button" className="w-full items-center gap-2" variant="shimmer">
                        {isProcessing && <Loader className="size-4" />}
                        <span className="text-sm">
                            <Translate content={isProcessing ? "export.processing" : "export"} />
                        </span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent containerRef={containerRef} spacing={20} padding={16} className="p-0 relative">
                    {isGitRepository && (
                        <div className="p-4 flex items-center justify-between text-xs text-zinc-400">
                            <span className="leading-none">
                                {owner}/{repo}
                            </span>
                            <span className="leading-none">
                                <Translate content="export.branch" />: {branch}
                            </span>
                        </div>
                    )}

                    <div className="px-2 pb-2">
                        <div className="flex flex-col gap-1 bg-neutral-950 rounded-2xl p-2 border border-zinc-800">
                            {isGitRepository ? (
                                <>
                                    <Button
                                        type="button"
                                        className="w-full justify-between bg-gradient-to-r from-transparent from-70% to-zinc-700/30 hover:from-50% hover:border-zinc-800"
                                        variant="ghost_border"
                                        onClick={handlePull}>
                                        <span className="text-xs text-zinc-400">
                                            <Translate content="export.pull" />
                                        </span>
                                        <img src="/icons/company/pull.svg" alt="pull" className="size-4 invert-75" />
                                    </Button>
                                    <Button
                                        type="button"
                                        className="w-full justify-between bg-gradient-to-r from-transparent from-50% to-zinc-700/30 hover:from-30% hover:border-zinc-800"
                                        variant="ghost_border"
                                        onClick={handlePush}>
                                        <span className="text-xs text-zinc-400">
                                            <Translate content="export.push" />
                                        </span>
                                        <img src="/icons/company/github.svg" alt="push" className="size-4 invert-75" />
                                    </Button>
                                    <Button
                                        type="button"
                                        className="w-full justify-between bg-gradient-to-r from-transparent from-30% to-zinc-700/30 hover:from-10% hover:border-zinc-800"
                                        variant="ghost_border"
                                        onClick={handleDownload}>
                                        <span className="text-xs text-zinc-400">
                                            <Translate content="export.download" />
                                        </span>
                                        <img src="/icons/download.svg" alt="download" className="size-4 invert-75" />
                                    </Button>
                                </>
                            ) : (
                                <Button type="button" className="w-full justify-start" variant="default" onClick={handleInitRepository}>
                                    <span className="text-xs">
                                        <Translate content="export.init_repository" />
                                    </span>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="absolute inset-0 -z-10 brightness-30">
                        <img src="/images/shine.avif" alt="Shine" />
                    </div>
                </PopoverContent>
            </Popover>

            <Dialog ref={confirmDialogRef} id="confirm-changes-modal" className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/company/github.svg" alt="GitHub" className="size-6 invert" />
                        {pendingAction?.type === "pr" ? "Create Pull Request" : "Push Changes"}
                    </DialogTitle>
                    <DialogDescription>
                        Review the changes before {pendingAction?.type === "pr" ? "creating a pull request" : "pushing to the repository"}
                    </DialogDescription>
                </DialogHeader>

                {pendingAction && (
                    <div className="mt-4">
                        <div className="text-sm text-zinc-300 mb-3">{pendingAction.changes.size} file(s) will be modified</div>
                        <div className="max-h-[400px] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950">
                            {Array.from(pendingAction.changes).map(([path, status]) => (
                                <div
                                    key={path}
                                    className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-900/50 transition">
                                    <span
                                        className={cn(
                                            "text-xs font-mono px-2 py-1 rounded",
                                            status === "added" && "bg-green-900/30 text-green-400",
                                            status === "updated" && "bg-yellow-900/30 text-yellow-400",
                                            status === "deleted" && "bg-red-900/30 text-red-400"
                                        )}>
                                        {status === "added" ? "+" : status === "updated" ? "~" : "-"}
                                    </span>
                                    <span className="text-sm text-zinc-300 font-mono truncate flex-1">{path}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <DialogFooter className="pt-6 flex items-center justify-end gap-3">
                    <DialogCloseButton variant="ghost">Cancel</DialogCloseButton>
                    <Button type="button" onClick={executeAction} variant="default">
                        Confirm {pendingAction?.type === "pr" ? "Pull Request" : "Push"}
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog ref={dialogRef} id="download-success-modal" className="sm:max-w-[525px] p-4">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/success.svg" alt="zip" className="size-6" />
                        <Translate content="success" />
                    </DialogTitle>
                    <DialogDescription>
                        <Translate content="modification_success" />
                        <SettingsDialog />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-4 flex items-end justify-between">
                    <div>
                        <a
                            href="https://discord.gg/TAmVFvkHep"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="discord"
                            className="hover:opacity-50 transition">
                            <img src="/icons/company/discord.svg" alt="Discord" className="size-6 invert" />
                        </a>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                        <DialogCloseButton variant="ghost">
                            <Translate content="close" />
                        </DialogCloseButton>
                        <LinkButton
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://streamelements.com/hardoudou/tip"
                            variant="patreon">
                            <Translate content="donate" />
                        </LinkButton>
                    </div>
                </DialogFooter>
            </Dialog>
        </>
    );
}
