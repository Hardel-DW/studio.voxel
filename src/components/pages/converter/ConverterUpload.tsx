import Dropzone from "@/components/ui/Dropzone";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ConverterUploadProps {
    onFileUpload: (files: FileList) => void;
    multiple?: boolean;
    compact?: boolean;
}

export default function ConverterUpload({ onFileUpload, multiple, compact }: ConverterUploadProps) {
    const t = useTranslate();
    return (
        <div className={cn("w-full h-full flex flex-col", compact ? "min-h-[150px]" : "min-h-[300px]")}>
            <Dropzone
                dropzone={{ accept: "application/zip", maxSize: 10000000, multiple: multiple ?? false }}
                onFileUpload={onFileUpload}
                className={cn("gap-6", compact ? "p-6" : "p-12")}>
                <div
                    className={cn(
                        "rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-300",
                        compact ? "size-12" : "size-20"
                    )}>
                    <img
                        src="/icons/upload.svg"
                        className={cn("opacity-50 group-hover:opacity-100 transition-opacity invert", compact ? "size-6" : "size-10")}
                        alt="Upload"
                    />
                </div>
                <div className="text-center space-y-2">
                    <p
                        className={cn(
                            "text-zinc-200 font-medium group-hover:text-white transition-colors",
                            compact ? "text-base" : "text-xl"
                        )}>
                        {compact ? t("converter.dropzone_add") : t("converter.dropzone")}
                    </p>
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">.zip files up to 10MB</p>
                </div>
            </Dropzone>
        </div>
    );
}
