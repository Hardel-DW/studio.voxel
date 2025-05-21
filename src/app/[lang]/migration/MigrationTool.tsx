"use client";

import { LinkButton } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Dropzone from "@/components/ui/Dropzone";
import { useConfetti } from "@/lib/hook/useConfetti";
import { useDictionary } from "@/lib/hook/useNext18n";
import { trackEvent } from "@/lib/telemetry";
import { downloadArchive } from "@/lib/utils/download";
import { compileDatapack } from "@voxelio/breeze/core";
import { parseDatapack } from "@voxelio/breeze/core";
import { applyActions } from "@voxelio/breeze/core";
import { logToActions } from "@voxelio/breeze/core";
import { Logger } from "@voxelio/breeze/core";
import type { Log } from "@voxelio/breeze/core";
import { voxelDatapacks } from "@voxelio/breeze/core";
import { Datapack } from "@voxelio/breeze/core";
import type React from "react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { StatusBox } from "./StatusBox";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { addConfetti, renderConfetti } = useConfetti();
    const dictionary = useDictionary();

    useEffect(() => {
        if (sourceFiles && targetFiles) handleMigration();
    }, [sourceFiles, targetFiles]);

    const handleMigration = async () => {
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

        const logFile = source.files["voxel/logs.json"];
        if (!logFile) {
            toast.error("No logs found in source datapack");
            return;
        }

        try {
            const logs: Log = JSON.parse(new TextDecoder().decode(logFile));
            const actions = logToActions(logs);
            const modifiedTarget = applyActions(target, actions);
            const finalDatapack = compileDatapack({
                elements: Array.from(modifiedTarget.elements.values()),
                files: modifiedTarget.files
            });

            const modifiedDatapack = await new Datapack(modifiedTarget.files).generate(finalDatapack, {
                isMinified: modifiedTarget.logger.getLogs().isMinified,
                logger: new Logger(logs),
                include: voxelDatapacks
            });

            downloadArchive(modifiedDatapack, `Migrated-${target.name}`, target.isModded);
            toast.success(dictionary.migration.success_message);
            await trackEvent("migrated_datapack");
            setIsDialogOpen(true);
            addConfetti();

            setTimeout(() => {
                setSourceFiles(null);
                setTargetFiles(null);
                setSourceData(undefined);
                setTargetData(undefined);
            }, 3000);
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to parse logs");
        }
    };

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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-x-2">
                            <img src="/icons/success.svg" alt="zip" className="size-6" />
                            {dictionary.generic.dialog.success}
                        </DialogTitle>
                        <DialogDescription>{dictionary.migration.success_message}</DialogDescription>
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
                </DialogContent>
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
