import { compileDatapack, Datapack, DatapackDownloader, Logger } from "@voxelio/breeze";
import type React from "react";
import { useRef, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    type DialogHandle,
    DialogHeader,
    DialogTitle
} from "@/components/ui/Dialog";
import Dropzone from "@/components/ui/Dropzone";
import { toast } from "@/components/ui/Toast";
import { useConfetti } from "@/lib/hook/useConfetti";
import { useServerDictionary } from "@/lib/hook/useServerDictionary";
import { downloadFile } from "@/lib/utils/download";
import { trackEvent } from "@/lib/utils/telemetry";
import { StatusBox } from "../ui/StatusBox";

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

export default function MigrationTool({ children }: { children?: React.ReactNode }) {
    const [uploads, setUploads] = useState<Record<UploadType, UploadState>>({
        source: { files: null },
        target: { files: null }
    });
    const { addConfetti, renderConfetti } = useConfetti();
    const dictionary = useServerDictionary();
    const dialogRef = useRef<DialogHandle>(null);

    const handleMigration = async () => {
        const { source, target } = uploads;
        if (!source.files || !target.files) return;
        toast(dictionary.migration.processing, "info");

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

            toast(dictionary.migration.success_message, "success");
            await trackEvent("migrated_datapack");
            dialogRef.current?.open();

            addConfetti();
            setTimeout(() => setUploads({ source: { files: null }, target: { files: null } }), 3000);
        } catch (error) {
            console.error("Migration failed:", error);
            toast("Failed to apply migration changes", "error");
        }
    };

    const validators: Record<UploadType, (result: Exclude<Awaited<ReturnType<Datapack["parse"]>>, string>) => string | null> = {
        source: (result) => (!result.files["voxel/logs.json"] ? dictionary.migration.error_types.no_logs : null),
        target: (result) => (result.elements.size === 0 ? dictionary.migration.error_types.invalid_datapack : null)
    };

    const handleUpload = async (files: FileList, type: UploadType) => {
        const datapack = await Datapack.from(files[0]);
        const result = datapack.parse();
        const filename = files[0].name;
        const isModded = filename.endsWith(".jar");

        if (typeof result === "string") {
            toast(dictionary[result], "error");
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
        <div className="container mx-auto">
            {renderConfetti()}
            {children}
            <Dialog id="migration-success-modal">
                <DialogContent ref={dialogRef} className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-x-2">
                            <img src="/icons/success.svg" alt="zip" className="size-6" />
                            <span className="text-xl font-medium text-zinc-200">{dictionary.generic.dialog.success}</span>
                        </DialogTitle>
                        <DialogDescription>
                            {dictionary.migration.success_message}
                            <div className="py-2">
                                <span className="font-semibold text-zinc-400">
                                    {uploads.target.data && `${uploads.target.data.name}.${uploads.target.data.isModded ? "jar" : "zip"}`}
                                </span>
                            </div>
                            <div className="h-1 w-full bg-zinc-700 rounded-full" />
                            <div className="pt-8">
                                <h4 className="font-semibold">{dictionary.migration.success_info.additional_info}</h4>
                                <ul className="list-disc list-inside pt-4 space-y-2 pl-4">
                                    <li>
                                        <span className="font-light">{dictionary.migration.success_info.additional_info}</span>
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
                                className="hover:opacity-50 transition">
                                <img src="/icons/company/discord.svg" alt="Discord" className="size-6 invert" />
                            </a>
                        </div>
                        <LinkButton
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://streamelements.com/hardoudou/tip"
                            variant="shimmer">
                            {dictionary.generic.donate}
                        </LinkButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col md:grid md:grid-cols-5 items-center justify-center mt-8">
                <div className="col-span-2 h-full">
                    {!uploads.source.files ? (
                        <Dropzone
                            id="source-dropzone"
                            onFileUpload={(files) => handleUpload(files, "source")}
                            dropzone={{
                                accept: ".zip",
                                maxSize: 100000000,
                                multiple: false
                            }}>
                            <div>
                                <p className="mb-2 text-sm text-gray-500">{dictionary.migration.source}</p>
                                <p className="text-xs text-gray-500">{dictionary.migration.drop.source}</p>
                            </div>
                        </Dropzone>
                    ) : (
                        <StatusBox
                            files={uploads.source.files}
                            version={uploads.source.data?.version ?? 0}
                            onResetAction={() => setUploads((prev) => ({ ...prev, source: { files: null } }))}
                            variant={uploads.source.data?.status ?? "error"}
                            reason={uploads.source.data?.reason}
                        />
                    )}
                </div>

                <div className="col-span-1 flex-col items-center gap-2 hidden md:flex">
                    <img src="/icons/arrow-right.svg" alt="Arrow" className="w-12 h-12 invert-75" />
                    <span className="text-sm text-muted-foreground">{dictionary.migration.arrow}</span>
                </div>

                <div className="col-span-1 flex-col items-center py-8 gap-4 md:hidden flex">
                    <span className="text-sm text-muted-foreground">{dictionary.migration.arrow}</span>
                    <img src="/icons/arrow-bottom.svg" alt="Arrow" className="w-12 h-12 invert-75" />
                </div>

                <div className="col-span-2">
                    {!uploads.target.files ? (
                        <Dropzone
                            id="target-dropzone"
                            onFileUpload={(files) => handleUpload(files, "target")}
                            dropzone={{
                                accept: ".zip",
                                maxSize: 100000000,
                                multiple: false
                            }}>
                            <div>
                                <p className="mb-2 text-sm text-gray-500">{dictionary.migration.target}</p>
                                <p className="text-xs text-gray-500">{dictionary.migration.drop.target}</p>
                            </div>
                        </Dropzone>
                    ) : (
                        <StatusBox
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
