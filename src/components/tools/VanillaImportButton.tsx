"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import useAsyncError from "@/lib/hook/useAsyncError";
import { useDictionary } from "@/lib/hook/useNext18n";
import type { Locale } from "@/lib/i18n/i18nServer";
import { DatapackError, parseDatapack } from "@voxelio/breeze/core";
import { useParams, useRouter } from "next/navigation";

export default function VanillaImportButton() {
    const dictionary = useDictionary();
    const params = useParams<{ lang: Locale }>();
    const router = useRouter();
    const throwError = useAsyncError();
    const handleVanillaImport = async (version: number) => {
        try {
            const response = await fetch(`/api/preset/${version}`);
            if (!response.ok) throw new DatapackError("tools.error.failed_to_fetch_datapack");

            const blob = await response.blob();
            const file = new File([blob], `Enchantment-${version}.zip`, { type: "application/zip" });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const fileList = dataTransfer.files;
            const result = await parseDatapack("enchantment", fileList[0]);

            if (typeof result === "string") {
                throw new DatapackError("tools.error.failed_to_parse_datapack");
            }

            useConfiguratorStore.getState().setup({ ...result, name: "Vanilla Enchantment - Voxel Configurator" });
            router.push(`/${params.lang}/studio/editor`);
        } catch (e: unknown) {
            if (e instanceof DatapackError) {
                throwError(e.message);
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    type="button"
                    className="h-10 px-4 py-2 rounded-md inline-flex items-center justify-center whitespace-nowrap cursor-pointer truncate text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 animate-shimmer bg-[linear-gradient(110deg,#FCFCFC,45%,#d0d0d0,55%,#FCFCFC)] bg-[length:200%_100%] text-black font-medium border-t border-l border-zinc-900 hover:opacity-75 transition">
                    {dictionary.studio.import_vanilla}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleVanillaImport(61)}>Minecraft - Version 1.21.4</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVanillaImport(57)}>Minecraft - Version 1.21.2 to 1.21.3</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVanillaImport(48)}>Minecraft - Version 1.21 to 1.21.1</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
