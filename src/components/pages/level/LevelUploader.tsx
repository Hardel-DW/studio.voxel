import Dropzone from "@/components/ui/Dropzone";
import { TOAST, toast } from "@/components/ui/Toast";
import { useTranslate } from "@/lib/i18n";
import { useLevelStore } from "@/lib/store/LevelStore";
import { cn } from "@/lib/utils";

interface LevelUploaderProps {
    className?: string;
    variant?: "hero" | "compact";
}

export default function LevelUploader({ className, variant = "hero" }: LevelUploaderProps) {
    const t = useTranslate();
    const load = useLevelStore((s) => s.load);

    const handleFileUpload = async (files: FileList) => {
        const file = files[0];
        if (!file) {
            toast(t("level.uploader.no_file"), TOAST.ERROR);
            return;
        }

        if (!file.name.endsWith(".dat")) {
            toast(t("level.uploader.invalid_type"), TOAST.ERROR, t("level.uploader.invalid_type_description"));
            return;
        }

        const buffer = await file.arrayBuffer();
        load(new Uint8Array(buffer), file.name);
        toast(t("level.uploader.loaded", { file: file.name }), TOAST.SUCCESS);
    };

    return (
        <Dropzone
            onFileUpload={handleFileUpload}
            dropzone={{ accept: ".dat", maxSize: 50000000, multiple: false }}
            className={cn(
                "transition-all duration-300 group hover:border-zinc-500 hover:bg-zinc-950/70",
                variant === "hero"
                    ? "gap-8 p-12 min-h-[320px] bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-2xl"
                    : "gap-4 p-6 min-h-[200px] border border-dashed border-zinc-700/50 rounded-xl",
                className
            )}
        >
            <div className={cn(
                "flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl group-hover:scale-110 group-hover:shadow-white/5 transition-all duration-500",
                variant === "hero" ? "size-24" : "size-16"
            )}>
                <img
                    src="/icons/upload.svg"
                    className={cn(
                        "opacity-50 group-hover:opacity-100 transition-opacity invert",
                        variant === "hero" ? "size-10" : "size-6"
                    )}
                    alt="Upload"
                />
            </div>

            <div className="text-center space-y-2 max-w-md">
                <p className={cn(
                    "font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors",
                    variant === "hero" ? "text-2xl" : "text-lg"
                )}>
                    {t("level.uploader.title")}
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {t("level.uploader.description")}<br />
                    <span className="opacity-50">{t("level.uploader.max_size")}</span>
                </p>
            </div>

            {variant === "hero" && (
                <div className="mt-4 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-500 group-hover:border-zinc-700 transition-colors">
                    /saves/your_world/level.dat
                </div>
            )}
        </Dropzone>
    );
}