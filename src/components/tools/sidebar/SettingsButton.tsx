"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function SettingsButton() {
    const [isSyncing, setIsSyncing] = useState(false);
    const name = useConfiguratorStore((state) => state.name);
    const setName = useConfiguratorStore((state) => state.setName);
    const minify = useConfiguratorStore((state) => state.minify);
    const setMinify = useConfiguratorStore((state) => state.setMinify);
    const queryClient = useQueryClient();
    const COOLDOWN_PERIOD_MS = 30000;

    const handleRefetchSchemas = () => {
        if (isSyncing) return;
        queryClient.invalidateQueries({ queryKey: ["schema"] });
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), COOLDOWN_PERIOD_MS);
    };

    const handleClick = () => {
        const store = useConfiguratorStore.getState();
        if (!store.version) {
            console.error("Version or configuration is missing");
            return;
        }

        const assembleDatapack = store.compile();
        console.info("------------ Datapack ---------------");
        console.debug(assembleDatapack);
        console.info("------------- Store ----------------");
        console.debug(store);
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
            <PopoverContent>
                <div>
                    <p className="text-xs font-semibold border-b border-zinc-700">External Configuration</p>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                name="datapackName"
                                id="datapackName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                                placeholder="Enter datapack name..."
                            />
                        </div>

                        <label htmlFor="minify" className="flex items-center justify-between w-full h-16">
                            <div className="flex flex-col w-3/4">
                                <span className="text-white text-sm line-clamp-1">Minify Code</span>
                                <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                    Minify the generated code to reduce the size.
                                </span>
                            </div>
                            <div className="flex items-center gap-4 h-full">
                                <input
                                    type="checkbox"
                                    name="minify"
                                    id="minify"
                                    checked={minify}
                                    onChange={(e) => setMinify(e.target.checked)}
                                />
                            </div>
                        </label>

                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleClick}
                                className="w-full px-3 py-2 text-sm text-white bg-zinc-950 cursor-pointer hover:bg-zinc-900 transition-colors rounded-lg border border-zinc-700">
                                Log Developer Data
                            </button>
                            <button
                                type="button"
                                onClick={handleRefetchSchemas}
                                disabled={isSyncing}
                                className="w-full px-3 py-2 text-sm text-white bg-zinc-950 cursor-pointer hover:bg-zinc-900 transition-colors rounded-lg border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSyncing ? "30s cooldown..." : "Re-Sync"}
                            </button>
                            <p className="text-xs text-zinc-400 mt-2 font-light ">Store size: {calculateStoreSize()}</p>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
