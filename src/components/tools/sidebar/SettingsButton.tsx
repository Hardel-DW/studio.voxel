import { lazy, Suspense } from "react";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import Translate from "@/components/ui/Translate";
import { useTranslate } from "@/lib/hook/useTranslation";

const DebugPanel = lazy(() => import("@/components/tools/debug/DebugPanel"));

export default function SettingsButton() {
    const { isDebugModalOpen, openDebugModal } = useDebugStore();
    const name = useConfiguratorStore((state) => state.name);
    const setName = useConfiguratorStore((state) => state.setName);
    const translateKey = useTranslate("settings.datapack_name_placeholder");

    const handleClick = () => {
        const store = useConfiguratorStore.getState();
        console.debug(store);
    };

    const handleDebugModalOpen = () => {
        const store = useConfiguratorStore.getState();
        const compiledDatapack = store.compile();
        openDebugModal(compiledDatapack);
    };

    const calculateStoreSize = () => {
        const store = useConfiguratorStore.getState();
        const storeSizeBytes = new TextEncoder().encode(JSON.stringify(store)).length;
        const storeSizeKB = (storeSizeBytes / 1024).toFixed(2);
        const storeSizeMB = (storeSizeBytes / (1024 * 1024)).toFixed(2);
        return `${storeSizeKB} KB (${storeSizeMB} MB)`;
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Button type="button" variant="transparent" size="square" className="bg-zinc-900 border border-zinc-800 select-none">
                    <img src="/icons/settings.svg" alt="settings" className="size-8 invert" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
                <div>
                    <p className="text-xs font-semibold border-b border-zinc-700">
                        <Translate content="settings.external_configuration" />
                    </p>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                name="datapackName"
                                id="datapackName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                                placeholder={translateKey}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleDebugModalOpen}
                                className="w-full px-3 py-2 text-sm text-white bg-zinc-950 cursor-pointer hover:bg-zinc-900 transition-colors rounded-lg border border-zinc-700">
                                <Translate content="settings.debug_mode" />
                            </button>
                            <button
                                type="button"
                                onClick={handleClick}
                                className="w-full px-3 py-2 text-sm text-white bg-zinc-950 cursor-pointer hover:bg-zinc-900 transition-colors rounded-lg border border-zinc-700">
                                <Translate content="settings.log_developer_data" />
                            </button>
                            <p className="text-xs text-zinc-400 mt-2 font-light ">
                                <Translate content="settings.store_size" /> {calculateStoreSize()}
                            </p>
                        </div>
                    </div>
                </div>
            </PopoverContent>

            {isDebugModalOpen && (
                <Suspense
                    fallback={
                        <div className="fixed inset-4 bg-header-cloudy rounded-2xl flex items-center justify-center z-200">
                            <p className="text-white">
                                <Translate content="loading" />
                            </p>
                        </div>
                    }>
                    <DebugPanel />
                </Suspense>
            )}
        </Popover>
    );
}
