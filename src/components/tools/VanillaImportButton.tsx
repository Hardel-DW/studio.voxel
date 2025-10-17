import { useNavigate, useParams } from "@tanstack/react-router";
import { Datapack, Logger } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { useDictionary } from "@/lib/hook/useNext18n";
import { Button } from "../ui/Button";

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
                <Button variant="shimmer">
                    {dictionary.studio.import_vanilla}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleVanillaImport(88)}>Minecraft - Version 1.21.10</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVanillaImport(61)}>Minecraft - Version 1.21.4</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVanillaImport(57)}>Minecraft - Version 1.21.2 to 1.21.3</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVanillaImport(48)}>Minecraft - Version 1.21 to 1.21.1</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
