import { DatapackDownloader } from "@voxelio/breeze";
import type { RefObject } from "react";
import { useRef } from "react";
import SettingsDialog from "@/components/tools/SettingsDialog";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import Translate from "@/components/tools/Translate";
import { Button, LinkButton } from "@/components/ui/Button";
import { Dialog, DialogCloseButton, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { downloadFile } from "@/lib/utils/download";

export default function DownloadButton({ containerRef }: { containerRef?: RefObject<HTMLDivElement | null> }) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const isGitRepository = useExportStore((state) => state.isGitRepository);
    const repository = useExportStore((state) => state.repository);
    const currentBranch = useExportStore((state) => state.currentBranch);

    const handleDownload = async () => {
        const { logger, name, isModded } = useConfiguratorStore.getState();
        if (!logger) return;

        const content = useConfiguratorStore.getState().compile();
        const response = await content.generate(logger);
        const filename = DatapackDownloader.getFileName(name, isModded);
        downloadFile(response, filename);
        dialogRef.current?.showPopover();
    };

    const handlePull = () => {
        console.log("Pull clicked");
    };

    const handlePush = () => {
        console.log("Push clicked");
    };

    const handleInitRepository = () => {
        console.log("Init repository clicked");
    };

    return (
        <>
            <Popover className="w-full">
                <PopoverTrigger className="w-full">
                    <Button type="button" className="w-full" variant="shimmer">
                        <span className="text-sm">
                            <Translate content="export" />
                        </span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent containerRef={containerRef} spacing={20} padding={16} className="p-0 relative">
                    {isGitRepository && (
                        <div className="p-4 flex items-center justify-between text-xs text-zinc-400">
                            <span className="leading-none">{repository}</span>
                            <span className="leading-none">
                                <Translate content="export.branch" />: {currentBranch}
                            </span>
                        </div>
                    )}

                    <div className="px-2 pb-2">
                        <div className=" flex flex-col gap-1 bg-neutral-950 rounded-2xl p-2 border border-zinc-800">
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
