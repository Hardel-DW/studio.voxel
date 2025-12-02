import Dropzone from "@/components/ui/Dropzone";

interface MigrationUploadProps {
    id: string;
    onFileUpload: (files: FileList) => void;
    title: string;
    description: string;
}

export default function MigrationUpload({ id, onFileUpload, title, description }: MigrationUploadProps) {
    return (
        <div className="w-full h-full min-h-[250px] flex flex-col">
            <Dropzone
                id={id}
                dropzone={{ accept: ".zip", maxSize: 100000000, multiple: false }}
                onFileUpload={onFileUpload}
                className="gap-6 p-8">
                <div className="size-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <img
                        src="/icons/upload.svg"
                        className="size-8 opacity-50 group-hover:opacity-100 transition-opacity invert"
                        alt="Upload"
                    />
                </div>
                <div className="text-center space-y-2 flex flex-col items-center">
                    <p className="text-zinc-200 font-medium text-lg group-hover:text-white transition-colors">{title}</p>
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors max-w-xs px-4">{description}</p>
                </div>
            </Dropzone>
        </div>
    );
}
