import type { ModMetadata } from "@voxelio/converter";
import { extractMetadata } from "@voxelio/converter";
import { extractZip } from "@voxelio/zip";
import { useState } from "react";
import ConverterForm from "@/components/pages/converter/ConverterForm";
import ConverterUpload from "@/components/pages/converter/ConverterUpload";

interface PackData {
    id: string;
    file: File;
    iconUrl: string | null;
    initialMetadata: ModMetadata;
}

async function processFile(uploadedFile: File): Promise<PackData> {
    const fileName = uploadedFile.name.replace(/\.zip$/i, "");
    const extractedMetadata = await extractMetadata(uploadedFile, fileName);
    const extractedFiles = await extractZip(new Uint8Array(await uploadedFile.arrayBuffer()));

    let iconUrl: string | null = null;
    const iconData = extractedFiles["pack.png"];
    if (iconData) {
        const iconBlob = new Blob([new Uint8Array(iconData)], { type: "image/png" });
        iconUrl = URL.createObjectURL(iconBlob);
    }

    return {
        id: crypto.randomUUID(),
        file: uploadedFile,
        iconUrl,
        initialMetadata: extractedMetadata
    };
}

export default function ConverterEditor() {
    const [packs, setPacks] = useState<PackData[]>([]);

    const handleFileUpload = async (files: FileList) => {
        const fileArray = Array.from(files);
        const processedPacks = await Promise.all(fileArray.map(processFile));
        setPacks((prev) => [...prev, ...processedPacks]);
    };

    const handleRemovePack = (id: string) => {
        setPacks((prev) => {
            const pack = prev.find((p) => p.id === id);
            if (pack?.iconUrl) URL.revokeObjectURL(pack.iconUrl);
            return prev.filter((p) => p.id !== id);
        });
    };

    if (packs.length === 0) {
        return (
            <div className="relative w-full min-h-[500px]">
                <div className="max-w-2xl mx-auto h-[400px]">
                    <ConverterUpload onFileUpload={handleFileUpload} multiple />
                </div>
            </div>
        );
    }

    if (packs.length === 1) {
        const pack = packs[0];
        return (
            <div className="relative w-full space-y-8">
                <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
                    <ConverterForm
                        file={pack.file}
                        onFileChange={() => handleRemovePack(pack.id)}
                        initialMetadata={pack.initialMetadata}
                        iconUrl={pack.iconUrl}
                    />
                </div>
                <div className="max-w-md mx-auto h-[200px]">
                    <ConverterUpload onFileUpload={handleFileUpload} multiple compact />
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {packs.map((pack) => (
                    <div key={pack.id} className="animate-in fade-in zoom-in duration-300">
                        <ConverterForm
                            file={pack.file}
                            onFileChange={() => handleRemovePack(pack.id)}
                            initialMetadata={pack.initialMetadata}
                            iconUrl={pack.iconUrl}
                        />
                    </div>
                ))}
            </div>

            <div className="max-w-md mx-auto h-[200px]">
                <ConverterUpload onFileUpload={handleFileUpload} multiple compact />
            </div>
        </div>
    );
}
