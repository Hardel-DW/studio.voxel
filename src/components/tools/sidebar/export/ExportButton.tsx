import { useConfiguratorStore } from "@/components/tools/Store";
import DownloadButton from "@/components/tools/sidebar/export/DownloadButton";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import Translate from "@/components/ui/Translate";

export default function ExportButton() {
    const isModded = useConfiguratorStore((state) => state.isModded);
    const setIsModded = useConfiguratorStore((state) => state.setIsModded);

    return (
        <Dialog id="export-dialog">
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

                <DialogBody className="p-6 space-y-6">
                    {/* Format Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Format</label>
                        <ToggleGroup
                            value={isModded ? "jar" : "zip"}
                            onChange={(v) => setIsModded(v === "jar")}
                            className="w-full grid grid-cols-2 gap-2 bg-transparent border-0 p-0">
                            <ToggleGroupOption
                                className="h-14 w-full justify-center bg-zinc-900/30 border border-zinc-800 data-[state=on]:bg-zinc-800 data-[state=on]:border-zinc-700 data-[state=on]:text-zinc-100"
                                value="zip">
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-300 font-medium">Datapack</span>
                                    <span className="text-zinc-500 text-xs font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800/50">
                                        .ZIP
                                    </span>
                                </div>
                            </ToggleGroupOption>
                            <ToggleGroupOption
                                className="h-14 w-full justify-center bg-zinc-900/30 border border-zinc-800 data-[state=on]:bg-zinc-800 data-[state=on]:border-zinc-700 data-[state=on]:text-zinc-100"
                                value="jar">
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-300 font-medium">Mod</span>
                                    <span className="text-zinc-500 text-xs font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800/50">
                                        .JAR
                                    </span>
                                </div>
                            </ToggleGroupOption>
                        </ToggleGroup>
                    </div>

                    <div className="h-px w-full bg-zinc-800/50" />

                    {/* Download */}
                    <div>
                        <DownloadButton />
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
