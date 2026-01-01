import { DatapackDownloader } from "@voxelio/breeze";
import { convertDatapack, extractMetadata, ModPlatforms } from "@voxelio/converter";
import { useConfiguratorStore } from "@/components/tools/Store";
import { Button } from "@/components/ui/Button";
import Translate from "@/components/ui/Translate";
import { downloadFile } from "@/lib/utils/download";

const MOD_MANIFEST_FILES = ["fabric.mod.json", "quilt.mod.json", "META-INF/mods.toml", "META-INF/neoforge.mods.toml"];

function hasModManifest(files: Record<string, Uint8Array>): boolean {
    return MOD_MANIFEST_FILES.some((manifest) => manifest in files);
}

export default function DownloadButton({ onSuccess }: { onSuccess?: () => void }) {
    const handleDownload = async () => {
        const { logger, isModded, compile, name, files } = useConfiguratorStore.getState();
        const response = await compile().generate(logger, isModded);
        const outputName = DatapackDownloader.getFileName(name, isModded);

        if (isModded && !hasModManifest(files)) {
            const blob = await response.blob();
            const zipFile = new File([blob], `${name}.zip`, { type: "application/zip" });
            const metadata = await extractMetadata(zipFile, name);
            const platforms = [ModPlatforms.FORGE, ModPlatforms.FABRIC, ModPlatforms.QUILT, ModPlatforms.NEOFORGE];
            const converted = await convertDatapack(zipFile, platforms, metadata);
            if (converted) {
                downloadFile(await converted.blob(), outputName);
                onSuccess?.();
                return;
            }
        }

        downloadFile(response, outputName);
        onSuccess?.();
    };

    return (
        <Button
            type="button"
            className="w-full h-14 bg-zinc-100 text-zinc-950 font-bold hover:bg-white hover:scale-[1.01] transition-all shadow-lg shadow-white/5"
            onClick={handleDownload}>
            <div className="flex items-center gap-3">
                <span className="text-base tracking-wide">
                    <Translate content="export.download" />
                </span>
                <img src="/icons/download.svg" alt="download" className="size-5" />
            </div>
        </Button>
    );
}
