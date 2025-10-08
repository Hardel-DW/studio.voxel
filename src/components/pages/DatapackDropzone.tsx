import { DEFAULT_MOD_METADATA, extractMetadata } from "@voxelio/converter";
import { useState } from "react";
import DatapackForm from "@/components/pages/DatapackForm";
import Dropzone from "@/components/ui/Dropzone";

export default function DatapackDropzone({ children }: { children?: React.ReactNode }) {
    const [file, setFile] = useState<File | null>(null);
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const [initialMetadata, setInitialMetadata] = useState(DEFAULT_MOD_METADATA);

    const handleFileUpload = async (files: FileList) => {
        const uploadedFile = files[0];
        if (!uploadedFile) return;

        try {
            const fileName = uploadedFile.name.replace(/\.zip$/i, "");
            const extractedMetadata = await extractMetadata(uploadedFile, fileName);

            if (extractedMetadata.icon) {
                const iconBlob = new Blob([uploadedFile], { type: "image/png" });
                setIconUrl(URL.createObjectURL(iconBlob));
            }

            setInitialMetadata(extractedMetadata);
            setFile(uploadedFile);
        } catch (error) {
            console.error("Error reading datapack:", error);
        }
    };

    const handleClear = () => {
        if (iconUrl) URL.revokeObjectURL(iconUrl);
        setFile(null);
        setIconUrl(null);
        setInitialMetadata(DEFAULT_MOD_METADATA);
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <Dropzone
                    id="dropzone"
                    dropzone={{ accept: "application/zip", maxSize: 10000000, multiple: false }}
                    onFileUpload={handleFileUpload}>
                    {children}
                </Dropzone>
            ) : (
                <DatapackForm file={file} onFileChange={handleClear} initialMetadata={initialMetadata} iconUrl={iconUrl} />
            )}
        </div>
    );
}
