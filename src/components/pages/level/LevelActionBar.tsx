import { TOAST, toast } from "@/components/ui/Toast";
import { useLevelStore } from "@/lib/store/LevelStore";
import { downloadFile } from "@/lib/utils/download";

export default function LevelActionBar() {
    const fileName = useLevelStore((s) => s.fileName);
    const exportFile = useLevelStore((s) => s.exportFile);
    const reset = useLevelStore((s) => s.reset);

    if (!fileName) return null;

    const handleExport = async () => {
        const data = exportFile();
        if (!data) {
            toast("Nothing to export", TOAST.ERROR);
            return;
        }

        await downloadFile(new Blob([new Uint8Array(data)], { type: "application/octet-stream" }), fileName);
        toast(`Exported ${fileName}`, TOAST.SUCCESS);
    };

    const handleClose = () => {
        reset();
        toast("File closed", TOAST.SUCCESS);
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm text-zinc-300 font-medium">{fileName}</span>
                </div>

                <button
                    type="button"
                    onClick={handleExport}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors">
                    Export
                </button>

                <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
}
