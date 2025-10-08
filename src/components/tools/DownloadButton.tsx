import { DatapackDownloader } from "@voxelio/breeze";
import { useRef } from "react";
import SettingsDialog from "@/components/tools/SettingsDialog";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { Button, LinkButton } from "@/components/ui/Button";
import { Dialog, DialogCloseButton, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { downloadFile } from "@/lib/utils/download";

export default function DownloadButton() {
    const dialogRef = useRef<HTMLDivElement>(null);

    const handleClick = async () => {
        const { logger, name, isModded } = useConfiguratorStore.getState();
        if (!logger) return;

        const content = useConfiguratorStore.getState().compile();
        const response = await content.generate(logger);
        const filename = DatapackDownloader.getFileName(name, isModded);
        downloadFile(response, filename);
        dialogRef.current?.showPopover();
    };

    return (
        <>
            <Button type="button" className="w-full" variant="shimmer" onClick={handleClick}>
                <span className="text-sm hidden xl:block">
                    <Translate content="download_data_pack" />
                </span>
                <span className="text-sm block xl:hidden">
                    <Translate content="download" />
                </span>
            </Button>

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
                        <DialogCloseButton variant="ghost">Close</DialogCloseButton>
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
