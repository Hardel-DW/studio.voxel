import { DatapackDownloader } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import SettingsDialog from "@/components/tools/sidebar/SettingsDialog";
import { Button, LinkButton } from "@/components/ui/Button";
import {
    Dialog,
    DialogCloseButton,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/Dialog";
import Translate from "@/components/ui/Translate";
import { downloadFile } from "@/lib/utils/download";

export default function DownloadButton() {
    const handleDownload = async () => {
        const { logger, isModded, compile, name } = useConfiguratorStore.getState();
        const response = await compile().generate(logger);
        downloadFile(response, DatapackDownloader.getFileName(name, isModded));
    };

    return (
        <Dialog id="download-success-modal">
            <DialogTrigger>
                <Button type="button" variant="aurora" onClick={handleDownload}>
                    <Translate content="export.download" />
                    <img src="/icons/download.svg" alt="download" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[525px] p-4">
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
            </DialogContent>
        </Dialog>
    );
}
