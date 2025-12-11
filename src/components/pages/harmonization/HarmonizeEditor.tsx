import { useRef, useState } from "react";
import HarmonizeControls from "@/components/pages/harmonization/HarmonizeControls";
import HarmonizeGallery from "@/components/pages/harmonization/HarmonizeGallery";
import HarmonizePreview from "@/components/pages/harmonization/HarmonizePreview";
import HarmonizeUpload from "@/components/pages/harmonization/HarmonizeUpload";
import useFileManager from "@/lib/hook/useFileManager";
import useImageProcessor from "@/lib/hook/useImageProcessor";
import { cleanPalette, loadImage, quantizeImage, type RGB } from "@/lib/utils/color";
import { downloadCanvas } from "@/lib/utils/download";
import { t } from "@/lib/i18n/i18n";
import { useParams } from "@tanstack/react-router";

export default function HarmonizeEditor() {
    const [similarityThreshold, setSimilarityThreshold] = useState<number>(30);
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);
    const { files, actions: fileActions } = useFileManager();
    const { palette, imageState, actions: imageActions } = useImageProcessor();
    const { lang } = useParams({ from: "/$lang" });
    const translate = t(lang);

    const drawCanvas = (imageData: ImageData | null) => {
        const canvas = outputCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (imageData) {
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            ctx.putImageData(imageData, 0, 0);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleFileUpload = async (fileList: FileList) => {
        const acceptedFiles = Array.from(fileList);
        if (!acceptedFiles.length) return;

        fileActions.addFiles(acceptedFiles);

        imageActions.resetPalette();
        imageActions.setHasQuantizedData(false);
        imageActions.startLoading();

        try {
            const image = await loadImage(acceptedFiles[0]);
            const result = await imageActions.processImage(image, similarityThreshold);

            if (result.success) {
                imageActions.setHasQuantizedData(true);
                drawCanvas(result.quantizedData);
            } else {
                drawCanvas(null);
            }
        } finally {
            imageActions.stopLoading();
        }
    };

    const handleSelectImage = async (index: number) => {
        if (!fileActions.selectFile(index)) return;

        imageActions.resetPalette();
        imageActions.setHasQuantizedData(false);
        imageActions.startLoading();

        try {
            const image = await loadImage(files.items[index]);
            const result = await imageActions.processImage(image, similarityThreshold);

            if (result.success) {
                imageActions.setHasQuantizedData(true);
                drawCanvas(result.quantizedData);
            } else {
                drawCanvas(null);
            }
        } finally {
            imageActions.stopLoading();
        }
    };

    const handleDeleteImage = (indexToDelete: number) => {
        const { remaining, newIndex } = fileActions.deleteFile(indexToDelete);

        if (remaining.length === 0) {
            imageActions.resetPalette();
            imageActions.setHasQuantizedData(false);
            drawCanvas(null);
        } else if (newIndex !== files.currentIndex) {
            handleSelectImage(newIndex);
        }
    };

    const handleThresholdChange = async (value: number) => {
        const newThreshold = value;
        setSimilarityThreshold(newThreshold);

        if (palette.original.length > 0 && files.current) {
            imageActions.startLoading();

            try {
                const image = await loadImage(files.current);
                const cleanedPalette = cleanPalette(palette.original, value);
                const quantized = await quantizeImage(image, cleanedPalette);

                imageActions.updateCleanedPalette(cleanedPalette);
                imageActions.setHasQuantizedData(true);
                drawCanvas(quantized);
            } catch (error) {
                console.error("Error updating threshold:", error);
                drawCanvas(null);
            } finally {
                imageActions.stopLoading();
            }
        }
    };

    const handleDeleteColor = async (colorToDelete: RGB) => {
        const newPalette = imageActions.deleteColorFromCleaned(colorToDelete);

        if (files.current && newPalette.length > 0) {
            imageActions.startLoading();

            try {
                const image = await loadImage(files.current);
                const quantized = await quantizeImage(image, newPalette);

                imageActions.setHasQuantizedData(true);
                drawCanvas(quantized);
            } catch (error) {
                console.error("Error after deleting color:", error);
                drawCanvas(null);
            } finally {
                imageActions.stopLoading();
            }
        } else if (files.current) {
            imageActions.setHasQuantizedData(false);
            drawCanvas(null);
        }
    };

    const handleDownload = () => {
        if (imageState.hasQuantizedData && outputCanvasRef.current && files.current) {
            const filename = files.current.name.replace(/(\.[^.]+)$/, "-harmonized$1") || "harmonized-image.png";
            downloadCanvas(outputCanvasRef.current, filename);
        }
    };

    const hasImage = files.items.length > 0 && files.currentIndex !== -1;

    return (
        <div className="relative w-full h-full flex flex-col lg:flex-row gap-8 items-start">
            <div className="absolute -inset-4 bg-zinc-900/20 backdrop-blur-sm rounded-[3rem] -z-10 border border-white/5" />

            <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col gap-6 relative z-10">
                <div className="bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl flex flex-col gap-6 min-h-[300px]">
                    {!hasImage ? (
                        <div className="flex-1 flex flex-col">
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-1">{translate("harmonization.uploaded_images")}</p>
                            <HarmonizeUpload onFileUpload={handleFileUpload} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <HarmonizeGallery files={files} onSelect={handleSelectImage} onDelete={handleDeleteImage} />
                            {files.items.length < 5 && <HarmonizeUpload onFileUpload={handleFileUpload} isCompact />}
                        </div>
                    )}
                </div>

                {hasImage ? (
                    <HarmonizeControls
                        similarityThreshold={similarityThreshold}
                        setSimilarityThreshold={handleThresholdChange}
                        palette={palette.cleaned}
                        onDeleteColor={handleDeleteColor}
                        isLoading={imageState.isLoading}
                    />
                ) : (
                    <HarmonizeControls disabled />
                )}
            </div>

            <div className="flex-1 w-full min-h-[500px] lg:h-[calc(100vh-200px)] sticky top-24 bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-2 shadow-2xl overflow-hidden group">
                <HarmonizePreview
                    canvasRef={outputCanvasRef}
                    isLoading={imageState.isLoading}
                    hasData={imageState.hasQuantizedData}
                    hasImage={hasImage}
                    onDownload={handleDownload}
                />
            </div>
        </div>
    );
}
