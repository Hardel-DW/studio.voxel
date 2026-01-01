import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import SettingsDialog from "@/components/tools/sidebar/SettingsDialog";
import DownloadButton from "@/components/tools/sidebar/export/DownloadButton";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/Dialog";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import Translate from "@/components/ui/Translate";

type ExportView = "main" | "success";

export default function ExportButton() {
    const isModded = useConfiguratorStore((state) => state.isModded);
    const setIsModded = useConfiguratorStore((state) => state.setIsModded);
    const [view, setView] = useState<ExportView>("main");

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // small delay to reset view after animation
            setTimeout(() => setView("main"), 200);
        }
    };

    return (
        <Dialog id="export-dialog" onOpenChange={handleOpenChange}>
            <DialogTrigger className="size-10 in-data-pinned:w-full in-data-pinned:flex-1">
                <Button
                    type="button"
                    className="size-full p-0 in-data-pinned:w-full in-data-pinned:items-center in-data-pinned:gap-2"
                    variant="shimmer"
                    size="default">
                    <img src="/icons/upload.svg" alt="Export" className="size-5 block in-data-pinned:hidden" />
                    <span className="text-sm hidden in-data-pinned:block whitespace-nowrap">
                        <Translate content="export" />
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-xl min-w-0 bg-zinc-950 border border-zinc-800 p-0 overflow-hidden gap-0">
                {view === "main" ? (
                    <>
                        <DialogHeader className="px-6 pt-6 pb-2">
                            <DialogTitle className="flex items-center gap-x-3 text-xl">
                                <div className="size-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner">
                                    <img src="/icons/upload.svg" alt="Export" className="size-5 invert opacity-75" />
                                </div>
                                <span className="text-zinc-100 font-semibold tracking-tight">
                                    <Translate content="export" />
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-sm">
                                <Translate content="export.description" />
                            </DialogDescription>
                        </DialogHeader>

                        <DialogBody className="p-6 space-y-8">
                            {/* Format Selection */}
                            <div className="space-y-3">
                                <label htmlFor="format" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Format</label>
                                <ToggleGroup
                                    value={isModded ? "jar" : "zip"}
                                    onChange={(v) => setIsModded(v === "jar")}
                                    className="w-full grid grid-cols-2 gap-2 bg-transparent border-0 p-0">
                                    <ToggleGroupOption
                                        className="h-24 w-full justify-center bg-zinc-900/30 border border-zinc-800 data-[state=on]:bg-zinc-800 data-[state=on]:border-zinc-700 data-[state=on]:text-zinc-100 flex flex-col items-center gap-2 hover:bg-zinc-900/50 transition-all"
                                        value="zip">
                                        <div className="size-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                            <img src="/icons/folder.svg" className="size-4 invert opacity-50" alt="" />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-zinc-300 font-medium">Datapack</span>
                                            <span className="text-zinc-500 text-xs font-mono">.ZIP Archive</span>
                                        </div>
                                    </ToggleGroupOption>
                                    <ToggleGroupOption
                                        className="h-24 w-full justify-center bg-zinc-900/30 border border-zinc-800 data-[state=on]:bg-zinc-800 data-[state=on]:border-zinc-700 data-[state=on]:text-zinc-100 flex flex-col items-center gap-2 hover:bg-zinc-900/50 transition-all"
                                        value="jar">
                                        <div className="size-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                            <img src="/icons/tools/weight.svg" className="size-4 invert opacity-50" alt="" />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-zinc-300 font-medium">Mod</span>
                                            <span className="text-zinc-500 text-xs font-mono">.JAR File</span>
                                        </div>
                                    </ToggleGroupOption>
                                </ToggleGroup>
                            </div>

                            <div className="h-px w-full bg-zinc-800/50" />

                            {/* Download */}
                            <div>
                                <DownloadButton onSuccess={() => setView("success")} />
                            </div>
                        </DialogBody>
                    </>
                ) : (
                    <>
                        <div className="relative w-full h-32 bg-green-500/10 flex items-center justify-center overflow-hidden border-b border-green-500/20">
                            <div className="absolute inset-0 bg-[url('/images/shine.avif')] opacity-20 bg-cover bg-center mix-blend-overlay" />
                            <div className="relative z-10 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
                                <div className="size-12 rounded-full bg-green-500/20 flex items-center justify-center ring-4 ring-green-500/10">
                                    <img src="/icons/success.svg" alt="Success" className="size-6 text-green-400" />
                                </div>
                                <h3 className="text-lg font-bold text-green-100 tracking-tight">Export Successful</h3>
                            </div>
                        </div>

                        <DialogBody className="p-6 space-y-6">
                            <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
                                <SettingsDialog />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label htmlFor="support" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1 text-center">
                                    Support the Development
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <a
                                        href="https://discord.gg/TAmVFvkHep"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 h-10 rounded-lg bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 border border-[#5865F2]/20 transition-all font-medium text-sm">
                                        <img src="/icons/company/discord.svg" alt="Discord" className="size-4" />
                                        Discord
                                    </a>
                                    <a
                                        href="https://streamelements.com/hardoudou/tip"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 h-10 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/20 transition-all font-medium text-sm">
                                        <img src="/icons/company/patreon.svg" alt="Donate" className="size-4" />
                                        Donate
                                    </a>
                                </div>
                            </div>

                            <DialogCloseButton className="w-full bg-zinc-100 text-zinc-950 font-bold hover:bg-white h-12 rounded-xl">
                                Done
                            </DialogCloseButton>
                        </DialogBody>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
