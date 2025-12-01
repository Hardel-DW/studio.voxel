import { DEFAULT_MOD_METADATA, extractMetadata } from "@voxelio/converter";
import { useState } from "react";
import ConverterForm from "../converter/ConverterForm";
import ConverterUpload from "../converter/ConverterUpload";

export default function ConverterEditor() {
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
        <div className="relative w-full min-h-[500px]">
            {!file ? (
                <div className="max-w-2xl mx-auto h-[400px]">
                    <ConverterUpload onFileUpload={handleFileUpload} />
                </div>
            ) : (
                <div className="animate-in fade-in zoom-in duration-300">
                    <ConverterForm file={file} onFileChange={handleClear} initialMetadata={initialMetadata} iconUrl={iconUrl} />
                </div>
            )}
        </div>
    );
}
