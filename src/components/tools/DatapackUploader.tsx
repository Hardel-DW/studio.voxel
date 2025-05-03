"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import Dropzone from "@/components/ui/Dropzone";
import useAsyncError from "@/lib/hook/useAsyncError";
import { useDictionary } from "@/lib/hook/useNext18n";
import type { Locale } from "@/lib/i18n/i18nSercer";
import { parseDatapack } from "@voxelio/breeze/core";
import { DatapackError } from "@voxelio/breeze/core";
import { useParams, useRouter } from "next/navigation";

export default function DatapackUploader() {
    const dictionary = useDictionary();
    const router = useRouter();
    const params = useParams<{ lang: Locale }>();
    const throwError = useAsyncError();

    const handleFileUpload = async (files: FileList) => {
        try {
            if (files.length === 0) throw new DatapackError("tools.enchantments.warning.no_file");
            if (files.length > 1) throw new DatapackError("tools.enchantments.warning.multiple_files");
            if (!files[0].name.endsWith(".zip") && !files[0].name.endsWith(".jar"))
                throw new DatapackError("tools.enchantments.warning.invalid_file");

            // TODO: Add support for other tools
            const result = await parseDatapack("enchantment", files[0]);

            useConfiguratorStore.getState().setup(result);
            const version = result.version;
            if (!version) throw new DatapackError("tools.enchantments.warning.no_version");

            useConfiguratorStore.getState().setRoadmap(version);
            router.push(`/${params.lang}/studio/editor`);
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
