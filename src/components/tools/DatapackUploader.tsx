import { useNavigate, useParams } from "@tanstack/react-router";
import { Datapack } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import Dropzone from "@/components/ui/Dropzone";
import { TOAST, toast } from "@/components/ui/Toast";
import { useServerDictionary } from "@/lib/hook/useServerDictionary";

export default function DatapackUploader() {
    const dictionary = useServerDictionary();
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
        <Dropzone
            onFileUpload={handleFileUpload}
            dropzone={{ accept: ".zip,.jar", maxSize: 100000000, multiple: false }}
            className="gap-6 p-12 min-h-[300px]"
        >
            <div className="size-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <img
                    src="/icons/upload.svg"
                    className="size-10 opacity-50 group-hover:opacity-100 transition-opacity invert"
                    alt="Upload"
                />
            </div>
            <div className="text-center space-y-2">
                <p className="text-zinc-200 font-medium text-xl group-hover:text-white transition-colors">
                    {dictionary.studio.upload.start}
                </p>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {dictionary.studio.upload.description}
                </p>
            </div>
        </Dropzone>
    );
}
