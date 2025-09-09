import { useParams, useRouter } from "@tanstack/react-router";
import { DatapackError, parseDatapack } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import Dropzone from "@/components/ui/Dropzone";
import useAsyncError from "@/lib/hook/useAsyncError";
import { useDictionary } from "@/lib/hook/useNext18n";

export default function DatapackUploader() {
    const dictionary = useDictionary();
    const router = useRouter();
    const { lang } = useParams({ from: "/$lang" });
    const throwError = useAsyncError();

    const handleFileUpload = async (files: FileList) => {
        try {
            if (files.length === 0) throw new DatapackError("tools.enchantments.warning.no_file");
            if (files.length > 1) throw new DatapackError("tools.enchantments.warning.multiple_files");
            if (!files[0].name.endsWith(".zip") && !files[0].name.endsWith(".jar"))
                throw new DatapackError("tools.enchantments.warning.invalid_file");

            const result = await parseDatapack(files[0]);
            const version = result.version;
            if (!version) throw new DatapackError("tools.enchantments.warning.no_version");
            useConfiguratorStore.getState().setup(result);
            router.navigate({ to: "/$lang/studio/editor", params: { lang } });
        } catch (e: unknown) {
            if (e instanceof DatapackError) {
                throwError(e.message);
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
