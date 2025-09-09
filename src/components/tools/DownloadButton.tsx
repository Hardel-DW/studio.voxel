import { Datapack, voxelDatapacks } from "@voxelio/breeze";
import SettingsDialog from "@/components/tools/SettingsDialog";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { Button, LinkButton } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { saveLogs } from "@/lib/telemetry";
import { downloadArchive } from "@/lib/utils/download";

export default function DownloadButton() {
    const handleClick = async () => {
        const store = useConfiguratorStore.getState();
        const { logger, files, minify, name, isModded } = store;

        const content = store.compile();
        const compiledContent = new Datapack(files).generate(content, { isMinified: minify, logger, include: voxelDatapacks });
        await saveLogs({ logs: logger?.exportJson() });
        downloadArchive(compiledContent, name, isModded);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button type="button" className="w-full" variant="white-shimmer" onClick={handleClick} onKeyDown={handleClick}>
                    <span className="text-sm hidden xl:block">
                        <Translate content="download_data_pack" />
                    </span>
                    <span className="text-sm block xl:hidden">
                        <Translate content="download" />
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/success.svg" alt="zip" className="size-6" />
                        <Translate content="success" />
                    </DialogTitle>
                    <DialogDescription>
                        <Translate content="modification_success" />
                    </DialogDescription>
                    <SettingsDialog />
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
                    <LinkButton
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://streamelements.com/hardoudou/tip"
                        variant="primary-shimmer">
                        <Translate content="donate" />
                    </LinkButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
