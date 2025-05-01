"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import Button from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useMemo } from "react";

export default function SettingsButton() {
    const name = useConfiguratorStore((state) => state.name);
    const setName = useConfiguratorStore((state) => state.setName);
    const minify = useConfiguratorStore((state) => state.minify);
    const setMinify = useConfiguratorStore((state) => state.setMinify);
    const clearSchemaCache = useConfiguratorStore((state) => state.clearSchemaCache);

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

    const store = useConfiguratorStore();
    const storeSizeBytes = useMemo(() => new TextEncoder().encode(JSON.stringify(store)).length, [store]);
    const storeSizeKB = useMemo(() => (storeSizeBytes / 1024).toFixed(2), [storeSizeBytes]);
    const storeSizeMB = useMemo(() => (storeSizeBytes / (1024 * 1024)).toFixed(2), [storeSizeBytes]);

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
                                onClick={clearSchemaCache}
                                className="w-full px-3 py-2 text-sm text-white bg-zinc-950 cursor-pointer hover:bg-zinc-900 transition-colors rounded-lg border border-zinc-700">
                                Clear Schema Cache
                            </button>
                            <p className="text-xs text-zinc-400 mt-2 font-light ">
                                Store size: {storeSizeKB} KB ({storeSizeMB} MB)
                            </p>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
