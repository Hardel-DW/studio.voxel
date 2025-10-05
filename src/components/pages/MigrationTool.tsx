import { compileDatapack, Datapack, Logger, parseDatapack } from "@voxelio/breeze";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { LinkButton } from "@/components/ui/Button";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Dropzone from "@/components/ui/Dropzone";
import { useConfetti } from "@/lib/hook/useConfetti";
import { useDictionary } from "@/lib/hook/useNext18n";
import { trackEvent } from "@/lib/telemetry";
import { downloadArchive } from "@/lib/utils/download";
import { StatusBox } from "../ui/StatusBox";

interface DatapackInfo {
    version: number;
    name: string;
    isModded: boolean;
    status: "success" | "error";
    reason?: string;
}

export default function MigrationTool({ children }: { children?: React.ReactNode }) {
    const [sourceFiles, setSourceFiles] = useState<FileList | null>(null);
    const [targetFiles, setTargetFiles] = useState<FileList | null>(null);
    const [sourceData, setSourceData] = useState<DatapackInfo>();
    const [targetData, setTargetData] = useState<DatapackInfo>();
    const dialogRef = useRef<HTMLDivElement>(null);
    const { addConfetti, renderConfetti } = useConfetti();
    const dictionary = useDictionary();

    const handleMigration = useCallback(async () => {
        if (!sourceFiles || !targetFiles) return;
        toast.info(dictionary.migration.processing);
        const source = await parseDatapack(sourceFiles[0]);
        const target = await parseDatapack(targetFiles[0]);
        if (typeof source === "string") {
            toast.error(dictionary[source]);
            return;
        }

        if (typeof target === "string") {
            toast.error(dictionary[target]);
            return;
        }

        try {
            const datapack = await Datapack.parse(sourceFiles[0]);
            const logger = new Logger(datapack.getFiles());
            const elements = logger.replay(target.elements, target.version);

            const finalDatapack = compileDatapack({
                elements: Array.from(elements.values()),
                files: target.files
            });

            const modifiedDatapack = await finalDatapack.generate(logger, `Migrated-${target.name}`, target.isModded);

            downloadArchive(modifiedDatapack, `Migrated-${target.name}`, target.isModded);
            toast.success(dictionary.migration.success_message);
            await trackEvent("migrated_datapack");
            dialogRef.current?.showPopover();
            addConfetti();

            setTimeout(() => {
                setSourceFiles(null);
                setTargetFiles(null);
                setSourceData(undefined);
                setTargetData(undefined);
            }, 3000);
        } catch (error) {
            console.error("Migration failed:", error);
            toast.error("Failed to apply migration changes");
        }
    }, [sourceFiles, targetFiles, dictionary, addConfetti]);

    useEffect(() => {
        if (sourceFiles && targetFiles) handleMigration();
    }, [sourceFiles, targetFiles, handleMigration]);

    const handleSourceUpload = async (files: FileList) => {
        const result = await parseDatapack(files[0]);
        if (typeof result === "string") {
            toast.error(dictionary[result]);
            return;
        }

        if (!result.files["voxel/logs.json"]) {
            toast.error(dictionary.migration.error_types.no_logs);
            setSourceData({
                version: result.version,
                name: result.name,
                isModded: result.isModded,
                status: "error",
                reason: dictionary.migration.error_types.invalid_datapack
            });
            setSourceFiles(files);
            return;
        }

        setSourceFiles(files);
        setSourceData({ version: result.version, name: result.name, isModded: result.isModded, status: "success" });
    };

    const handleTargetUpload = async (files: FileList) => {
        const result = await parseDatapack(files[0]);
        if (typeof result === "string") {
            toast.error(dictionary[result]);
            return;
        }

        if (result.elements.size === 0) {
            toast.error(dictionary.migration.error_types.invalid_datapack);
            setTargetData({
                version: result.version,
                name: result.name,
                isModded: result.isModded,
                status: "error",
                reason: dictionary.migration.error_types.invalid_datapack
            });
            setTargetFiles(files);
            return;
        }

        setTargetFiles(files);
        setTargetData({ version: result.version, name: result.name, isModded: result.isModded, status: "success" });
    };

    return (
        <div className="container mx-auto">
            {renderConfetti()}
            {children}
            <Toaster richColors />

            <Dialog ref={dialogRef} id="migration-success-modal" className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/success.svg" alt="zip" className="size-6" />
                        {dictionary.generic.dialog.success}
                    </DialogTitle>
                    <DialogDescription>
                        {dictionary.migration.success_message}
                        <div className="py-2">
                            <span className="font-semibold text-zinc-400">
                                {targetData && `${targetData.name}.${targetData.isModded ? "jar" : "zip"}`}
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
                        variant="primary-shimmer">
                        {dictionary.generic.donate}
                    </LinkButton>
                </DialogFooter>
            </Dialog>

            <div className="flex flex-col md:grid md:grid-cols-5 items-center justify-center mt-8">
                <div className="col-span-2 h-full">
                    {!sourceFiles ? (
                        <Dropzone
                            id="source-dropzone"
                            onFileUpload={handleSourceUpload}
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
                            files={sourceFiles}
                            version={sourceData?.version ?? 0}
                            onResetAction={() => {
                                setSourceFiles(null);
                                setSourceData(undefined);
                            }}
                            variant={sourceData?.status ?? "error"}
                            reason={sourceData?.reason}
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
                    {!targetFiles ? (
                        <Dropzone
                            id="target-dropzone"
                            onFileUpload={handleTargetUpload}
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
                            files={targetFiles}
                            version={targetData?.version ?? 0}
                            onResetAction={() => {
                                setTargetFiles(null);
                                setTargetData(undefined);
                            }}
                            variant={targetData?.status ?? "error"}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
