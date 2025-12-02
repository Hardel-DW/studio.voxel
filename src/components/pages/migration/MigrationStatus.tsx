import { cn } from "@/lib/utils";

interface MigrationStatusProps {
    files: FileList | null;
    version: number;
    onResetAction: () => void;
    variant: "success" | "error";
    reason?: string;
}

export default function MigrationStatus({ files, version, onResetAction, variant, reason }: MigrationStatusProps) {
    const file = files?.[0];

    return (
        <div className="w-full h-full min-h-[250px] flex flex-col relative group">
            <div
                className={cn(
                    "flex flex-col items-center justify-center gap-6 p-8 rounded-3xl border border-white/5 h-full min-h-[250px] bg-zinc-900/60 backdrop-blur-md shadow-xl transition-all duration-300",
                    variant === "error" ? "border-red-500/20 bg-red-500/5" : "border-green-500/20 bg-green-500/5"
                )}>
                <div
                    className={cn(
                        "size-16 rounded-2xl flex items-center justify-center border shadow-inner transition-transform duration-300 group-hover:scale-110",
                        variant === "error" ? "bg-red-500/10 border-red-500/20" : "bg-green-500/10 border-green-500/20"
                    )}>
                    {variant === "error" ? (
                        <img src="/icons/toast/error.svg" className="size-8" alt="Error" />
                    ) : (
                        <img src="/icons/company/pull.svg" className="size-8 invert opacity-80" alt="Success" />
                    )}
                </div>

                <div className="text-center space-y-2 w-full">
                    <h3 className="text-zinc-200 font-medium text-lg truncate px-4" title={file?.name}>
                        {file?.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                        <span
                            className={cn(
                                "text-xs px-2 py-1 rounded-full border",
                                variant === "error"
                                    ? "text-red-400 border-red-500/20 bg-red-500/10"
                                    : "text-green-400 border-green-500/20 bg-green-500/10"
                            )}>
                            Version {version}
                        </span>
                        {variant === "error" && reason && (
                            <span className="text-xs text-red-400 max-w-[200px] truncate" title={reason}>
                                {reason}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onResetAction}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Remove file">
                    <img
                        src="/icons/close.svg"
                        className="size-4 invert opacity-60 group-hover:opacity-100 transition-opacity"
                        alt="Close"
                    />
                </button>
            </div>
        </div>
    );
}
