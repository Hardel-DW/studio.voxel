import { useNavigate, useParams } from "@tanstack/react-router";
import { Datapack } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import Dropzone from "@/components/ui/Dropzone";
import { TOAST, toast } from "@/components/ui/Toast";
import { useDictionary } from "@/lib/hook/useNext18n";

export default function DatapackUploader() {
    const dictionary = useDictionary();
    const navigate = useNavigate();
    const { lang } = useParams({ from: "/$lang" });

    const handleFileUpload = async (files: FileList) => {
        try {
            const file = files[0];
            if (files.length === 0) throw new Error(dictionary.studio.error.no_file);
            if (files.length > 1) throw new Error(dictionary.studio.error.multiple_files);
            if (!file.name.endsWith(".zip") && !file.name.endsWith(".jar")) throw new Error(dictionary.studio.error.invalid_file);

            const datapack = await Datapack.from(file);
            const result = datapack.parse();

            useConfiguratorStore.getState().setup(result, file.name.endsWith(".zip"), file.name);
            toast(`Successfully loaded ${file.name}`, TOAST.SUCCESS);
            navigate({ to: "/$lang/studio/editor", params: { lang } });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : dictionary.studio.error.failed_to_upload;
            toast(dictionary.generic.dialog.error, TOAST.ERROR, errorMessage);
        }
    };

    return (
        <Dropzone onFileUpload={handleFileUpload} dropzone={{ accept: ".zip,.jar", maxSize: 100000000, multiple: false }}>
            <div>
                <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">{dictionary.studio.upload.start}</span> {dictionary.studio.upload.drop}
                </p>
                <p className="text-xs text-gray-500">{dictionary.studio.upload.description}</p>
            </div>
        </Dropzone>
    );
}
