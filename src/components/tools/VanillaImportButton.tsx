import { useNavigate, useParams } from "@tanstack/react-router";
import { Datapack, Logger } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { useDictionary } from "@/lib/hook/useNext18n";

export default function VanillaImportButton() {
    const dictionary = useDictionary();
    const { lang } = useParams({ from: "/$lang" });
    const navigate = useNavigate();
    const handleVanillaImport = async (version: number) => {
        const mcmeta = { pack: { pack_format: version, description: "No Description, please change this - Voxel Configurator" } };
        const files = new Datapack({ "pack.mcmeta": new TextEncoder().encode(JSON.stringify(mcmeta)) }).getFiles();
        const elements = new Map();
        const logger = new Logger(files);

        useConfiguratorStore.getState().setup({ files, elements, version, logger }, false, "Change This Name - Voxel Configurator");
        navigate({ to: "/$lang/studio/editor", params: { lang } });
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
