import { compileDatapack, Datapack, DatapackDownloader, Logger } from "@voxelio/breeze";
import { useRef, useState } from "react";
import MigrationStatus from "@/components/pages/migration/MigrationStatus";
import MigrationUpload from "@/components/pages/migration/MigrationUpload";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    type DialogHandle,
    DialogHeader,
    DialogTitle
} from "@/components/ui/Dialog";
import { toast } from "@/components/ui/Toast";
import { useConfetti } from "@/lib/hook/useConfetti";
import { t, useI18n } from "@/lib/i18n";
import { downloadFile } from "@/lib/utils/download";
import { trackEvent } from "@/lib/utils/telemetry";

interface DatapackInfo {
    version: number;
    name: string;
    isModded: boolean;
    status: "success" | "error";
    reason?: string;
}

type UploadType = "source" | "target";

interface UploadState {
    files: FileList | null;
    data?: DatapackInfo;
}

export default function MigrationEditor() {
    useI18n((state) => state.locale);
    const [uploads, setUploads] = useState<Record<UploadType, UploadState>>({
        source: { files: null },
        target: { files: null }
    });
    const { addConfetti, renderConfetti } = useConfetti();
    const dialogRef = useRef<DialogHandle>(null);

    const handleMigration = async () => {
        const { source, target } = uploads;
        if (!source.files || !target.files) return;
        toast(t("migration.processing"), "info");

        const targetData = await Datapack.from(target.files[0]);
        const targetDataResult = targetData.parse();
        const filename = target.files[0].name;
        const isModded = filename.endsWith(".jar");

        try {
            const sourceDatapack = await Datapack.from(source.files[0]);
            const changesetsA = new Logger(sourceDatapack.getFiles()).getChangeSets();

            const loggerB = new Logger(targetDataResult.files);
            const mergedElements = loggerB.applyChangeSets(changesetsA, targetDataResult.elements);

            const finalDatapack = compileDatapack({
                elements: Array.from(mergedElements.values()),
                files: targetDataResult.files
            });

            const response = await finalDatapack.generate(loggerB);
            const newFilename = DatapackDownloader.getFileName(filename, isModded);
            downloadFile(response, newFilename);

            toast(t("migration.success_message"), "success");
            await trackEvent("migrated_datapack");
            dialogRef.current?.open();

            addConfetti();
            setTimeout(() => setUploads({ source: { files: null }, target: { files: null } }), 3000);
        } catch (error) {
            console.error("Migration failed:", error);
            toast(t("migration.error.failed_to_apply_changes"), "error");
        }
    };

    const validators: Record<UploadType, (result: Exclude<Awaited<ReturnType<Datapack["parse"]>>, string>) => string | null> = {
        source: (result) => (!result.files["voxel/logs.json"] ? t("migration.error_types.no_logs") : null),
        target: (result) => (result.elements.size === 0 ? t("migration.error_types.invalid_datapack") : null)
    };

    const handleUpload = async (files: FileList, type: UploadType) => {
        const datapack = await Datapack.from(files[0]);
        const result = datapack.parse();
        const filename = files[0].name;
        const isModded = filename.endsWith(".jar");

        if (typeof result === "string") {
            toast(t(result), "error");
            return;
        }

        const error = validators[type](result);
        const data: DatapackInfo = {
            version: result.version,
            name: filename,
            isModded: isModded,
            status: error ? "error" : "success",
            reason: error ?? undefined
        };

        setUploads((prev) => ({ ...prev, [type]: { files, data } }));
        if (uploads.target.files && uploads.source.files) handleMigration();
        if (error) toast(error, "error");
    };

    return (
        <div className="w-full">
            {renderConfetti()}

            <Dialog id="migration-success-modal">
                <DialogContent ref={dialogRef} className="sm:max-w-[525px] bg-zinc-900/90 backdrop-blur-xl border border-white/10">
                    <DialogHeader>
                        <DialogTitle className="mb-3">
                            <img src="/icons/success.svg" alt="zip" className="size-6" />
                            <span className="text-xl font-medium text-zinc-200">{t("generic.dialog.success")}</span>
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            {t("migration.success_message")}
                            <div className="py-2">
                                <span className="font-semibold text-zinc-200">
                                    {uploads.target.data && `${uploads.target.data.name}.${uploads.target.data.isModded ? "jar" : "zip"}`}
                                </span>
                            </div>
                            <div className="h-px w-full bg-white/10 my-4" />
                            <div className="space-y-2">
                                <h4 className="font-semibold text-zinc-200">{t("migration.success_info.additional_info")}</h4>
                                <ul className="list-disc list-inside text-sm pl-2">
                                    <li>
                                        <span className="font-light">{t("migration.success_info.additional_info")}</span>
                                    </li>
                                </ul>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4 flex items-end justify-between">
                        <div>
                            <a
                                href="https://discord.gg/TAmVFvkHep"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="discord"
                                className="hover:opacity-70 transition opacity-50">
                                <img src="/icons/company/discord.svg" alt="Discord" className="size-6 invert" />
                            </a>
                        </div>
                        <Button
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://streamelements.com/hardoudou/tip"
                            variant="shimmer"
                            className="cursor-pointer">
                            {t("generic.donate")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col lg:grid lg:grid-cols-11 gap-8 lg:items-stretch items-center justify-center relative">
                <div className="w-full lg:col-span-5">
                    {!uploads.source.files ? (
                        <MigrationUpload
                            id="source-dropzone"
                            onFileUpload={(files) => handleUpload(files, "source")}
                            title={t("migration.source")}
                            description={t("migration.drop.source")}
                        />
                    ) : (
                        <MigrationStatus
                            files={uploads.source.files}
                            version={uploads.source.data?.version ?? 0}
                            onResetAction={() => setUploads((prev) => ({ ...prev, source: { files: null } }))}
                            variant={uploads.source.data?.status ?? "error"}
                            reason={uploads.source.data?.reason}
                        />
                    )}
                </div>

                {/* Arrow Indicator */}
                <div className="col-span-1 flex flex-col items-center justify-center gap-4 opacity-50">
                    <div className="hidden lg:flex flex-col items-center gap-2">
                        <img src="/icons/arrow-right.svg" alt="Arrow" className="size-8 invert opacity-50" />
                    </div>
                    <div className="flex lg:hidden flex-col items-center gap-2">
                        <img src="/icons/arrow-bottom.svg" alt="Arrow" className="size-8 invert opacity-50" />
                    </div>
                </div>

                {/* Target Upload */}
                <div className="w-full lg:col-span-5">
                    {!uploads.target.files ? (
                        <MigrationUpload
                            id="target-dropzone"
                            onFileUpload={(files) => handleUpload(files, "target")}
                            title={t("migration.target")}
                            description={t("migration.drop.target")}
                        />
                    ) : (
                        <MigrationStatus
                            files={uploads.target.files}
                            version={uploads.target.data?.version ?? 0}
                            onResetAction={() => setUploads((prev) => ({ ...prev, target: { files: null } }))}
                            variant={uploads.target.data?.status ?? "error"}
                            reason={uploads.target.data?.reason}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
