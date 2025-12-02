import Dropzone from "@/components/ui/Dropzone";
import { useServerDictionary } from "@/lib/hook/useServerDictionary";
import { cn } from "@/lib/utils";

interface HarmonizeUploadProps {
    onFileUpload: (files: FileList) => void;
    isCompact?: boolean;
}

export default function HarmonizeUpload({ onFileUpload, isCompact = false }: HarmonizeUploadProps) {
    const dictionary = useServerDictionary();

    return (
        <div className="w-full h-full min-h-[200px] flex flex-col">
            <Dropzone
                dropzone={{ accept: "image/*", maxSize: 5242880, multiple: true }}
                onFileUpload={onFileUpload}
                className={cn("gap-4", isCompact ? "py-8" : "flex-1")}>
                <div className="size-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <img
                        src="/icons/upload.svg"
                        className="size-8 opacity-50 group-hover:opacity-100 transition-opacity invert"
                        alt="Upload"
                    />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-zinc-200 font-medium text-lg group-hover:text-white transition-colors">
                        {dictionary.harmonization.drop}
                    </p>
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">PNG, JPG, WEBP • Max 5MB</p>
                </div>
            </Dropzone>
        </div>
    );
}
