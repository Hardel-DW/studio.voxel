import Dropzone from "@/components/ui/Dropzone";
import { TOAST, toast } from "@/components/ui/Toast";
import { useLevelStore } from "@/lib/store/LevelStore";

export default function LevelUploader() {
    const load = useLevelStore((s) => s.load);

    const handleFileUpload = async (files: FileList) => {
        const file = files[0];
        if (!file) {
            toast("No file selected", TOAST.ERROR);
            return;
        }

        if (!file.name.endsWith(".dat")) {
            toast("Invalid file type", TOAST.ERROR, "Please upload a .dat file");
            return;
        }

        const buffer = await file.arrayBuffer();
        load(new Uint8Array(buffer), file.name);
        toast(`Loaded ${file.name}`, TOAST.SUCCESS);
    };

    return (
        <Dropzone
            onFileUpload={handleFileUpload}
            dropzone={{ accept: ".dat", maxSize: 50000000, multiple: false }}
            className="gap-6 p-12 min-h-[300px]">
            <div className="size-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <img
                    src="/icons/upload.svg"
                    className="size-10 opacity-50 group-hover:opacity-100 transition-opacity invert"
                    alt="Upload"
                />
            </div>
            <div className="text-center space-y-2">
                <p className="text-zinc-200 font-medium text-xl group-hover:text-white transition-colors">Upload level.dat</p>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    Drag & drop your level.dat file or click to browse
                </p>
            </div>
        </Dropzone>
    );
}
