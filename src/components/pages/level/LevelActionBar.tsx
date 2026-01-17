import { TOAST, toast } from "@/components/ui/Toast";
import { useTranslate } from "@/lib/i18n";
import { useLevelStore } from "@/lib/store/LevelStore";
import { downloadFile } from "@/lib/utils/download";

export default function LevelActionBar() {
    const t = useTranslate();
    const fileName = useLevelStore((s) => s.fileName);
    const exportFile = useLevelStore((s) => s.exportFile);
    const reset = useLevelStore((s) => s.reset);

    if (!fileName) return null;

    const handleExport = async () => {
        const data = exportFile();
        if (!data) {
            toast(t("level.actionbar.nothing_to_export"), TOAST.ERROR);
            return;
        }

        await downloadFile(new Blob([new Uint8Array(data)], { type: "application/octet-stream" }), fileName);
        toast(t("level.actionbar.exported", { file: fileName }), TOAST.SUCCESS);
    };

    const handleClose = () => {
        reset();
        toast(t("level.actionbar.file_closed"), TOAST.SUCCESS);
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 bg-zinc-950/50 backdrop-blur-lg border border-zinc-800 rounded-4xl shadow-2xl">
                <div className="flex items-center gap-2 px-4 ">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-zinc-300 font-medium">{fileName}</span>
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                    className="h-10 px-4 flex items-center gap-2 hover:bg-zinc-800/50 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-700/50 transition-colors cursor-pointer">
                    <img src="/icons/close.svg" alt="Close" className="size-4 invert opacity-50" />
                    {t("level.actionbar.close")}
                </button>

                <button
                    type="button"
                    onClick={handleExport}
                    className="h-10 px-4 flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-full text-xs font-medium text-zinc-300 transition-colors cursor-pointer">
                    <img src="/icons/upload.svg" alt="Export" className="size-4 opacity-75" />
                    {t("level.actionbar.export")}
                </button>
            </div>
        </div>
    );
}
