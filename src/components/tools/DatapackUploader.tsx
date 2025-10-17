import { useNavigate, useParams } from "@tanstack/react-router";
import { Datapack, DatapackError } from "@voxelio/breeze";
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
            if (files.length === 0) {
                toast(dictionary.studio.error.no_file, TOAST.ERROR);
                return;
            }
            if (files.length > 1) {
                toast(dictionary.studio.error.multiple_files, TOAST.ERROR);
                return;
            }
            if (!files[0].name.endsWith(".zip") && !files[0].name.endsWith(".jar")) {
                toast(dictionary.studio.error.invalid_file, TOAST.ERROR);
                return;
            }

            const file = files[0];
            const datapack = await Datapack.from(file);
            const result = datapack.parse();
            if (!result.version) {
                toast(dictionary.studio.error.no_version, TOAST.ERROR);
                return;
            }

            useConfiguratorStore.getState().setup(result, file.name.endsWith(".zip"), file.name);
            toast(`Successfully loaded ${file.name}`, TOAST.SUCCESS);
            navigate({ to: "/$lang/studio/editor", params: { lang } });
        } catch (e: unknown) {
            console.error("Failed to upload datapack:", e);
            if (e instanceof DatapackError) {
                const errorKey = e.message as keyof typeof dictionary.studio.error;
                const errorMessage = dictionary.studio.error[errorKey] || e.message;
                toast(dictionary.generic.dialog.error, TOAST.ERROR, errorMessage);
            } else if (e instanceof Error) {
                toast(e.message, TOAST.ERROR, e.message);
            } else {
                toast(dictionary.studio.error.failed_to_upload, TOAST.ERROR);
            }
        }
    };

    return (
        <Dropzone
            onFileUpload={handleFileUpload}
            dropzone={{
                accept: ".zip,.jar",
                maxSize: 100000000,
                multiple: false
            }}>
            <div>
                <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">{dictionary.studio.upload.start}</span> {dictionary.studio.upload.drop}
                </p>
                <p className="text-xs text-gray-500">{dictionary.studio.upload.description}</p>
            </div>
        </Dropzone>
    );
}
