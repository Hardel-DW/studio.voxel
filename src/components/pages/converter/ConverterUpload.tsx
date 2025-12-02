import Dropzone from "@/components/ui/Dropzone";
import { useServerDictionary } from "@/lib/hook/useServerDictionary";

interface ConverterUploadProps {
    onFileUpload: (files: FileList) => void;
}

export default function ConverterUpload({ onFileUpload }: ConverterUploadProps) {
    const dictionary = useServerDictionary();

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            <Dropzone
                dropzone={{ accept: "application/zip", maxSize: 10000000, multiple: false }}
                onFileUpload={onFileUpload}
                className="gap-6 p-12"
            >
                <div className="size-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <img
                        src="/icons/upload.svg"
                        className="size-10 opacity-50 group-hover:opacity-100 transition-opacity invert"
                        alt="Upload"
                    />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-zinc-200 font-medium text-xl group-hover:text-white transition-colors">
                        {dictionary.converter.dropzone}
                    </p>
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">.zip files up to 10MB</p>
                </div>
            </Dropzone>
        </div>
    );
}
