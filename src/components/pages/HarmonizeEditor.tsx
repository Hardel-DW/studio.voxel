import { useRef, useState } from "react";
import Dropzone from "@/components/ui/Dropzone";
import useFileManager from "@/lib/hook/useFileManager";
import useImageProcessor from "@/lib/hook/useImageProcessor";
import { useDictionary } from "@/lib/hook/useNext18n";
import { cleanPalette, loadImage, quantizeImage } from "@/lib/utils/color";
import { downloadCanvas } from "@/lib/utils/download";
import Range from "@/components/ui/Range";

export default function HarmonizeEditor() {
    const dictionary = useDictionary();
    const [similarityThreshold, setSimilarityThreshold] = useState<number>(30);
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);

    const { files, actions: fileActions } = useFileManager();

    const { palette, imageState, actions: imageActions } = useImageProcessor();

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
            imageActions.setHasQuantizedData(false);
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

    const handleDeleteColor = async (indexToDelete: number) => {
        const newPalette = imageActions.deleteColor(indexToDelete);

        if (files.current && newPalette.length > 0) {
            imageActions.setHasQuantizedData(false);
            imageActions.startLoading();

            try {
                const image = await loadImage(files.current);
                const cleanedPalette = cleanPalette(newPalette, similarityThreshold);
                const quantized = await quantizeImage(image, cleanedPalette);

                imageActions.updateCleanedPalette(cleanedPalette);
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

    const showOutput = files.items.length > 0 && files.currentIndex !== -1;

    return (
        <div className="relative mb-24">
            <div className={`mb-8 w-full ${!showOutput ? "hidden" : ""}`}>
                <div id="imageGallery" className="flex gap-4 overflow-x-auto pb-4 min-h-25 items-center">
                    {files.items.map((file, index) => {
                        const key = file.name + file.lastModified;
                        const imageUrl = files.objectUrls[key] || "";
                        return (
                            <button type="button" key={key} className="relative group shrink-0" onClick={() => handleSelectImage(index)}>
                                <img
                                    src={imageUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-24 h-24 p-2 object-cover rounded-lg border-2 border-zinc-700 cursor-pointer transition-all duration-200 pixelated ${index === files.currentIndex ? "border-pink-600" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteImage(index);
                                    }}
                                    className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5 hidden group-hover:flex items-center justify-center text-white leading-none size-5 z-10 hover:bg-red-700"
                                    aria-label={`Delete image ${index + 1}`}>
                                    <img alt="close button" src="/icons/close.svg" className="w-3 h-3 invert" />
                                </button>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={`grid ${showOutput ? "grid-cols-2" : "grid-cols-1"} gap-x-16`}>
                <div className={`flex flex-col gap-4 ${!showOutput ? "col-span-1" : ""}`}>
                    <Dropzone dropzone={{ accept: "image/*", maxSize: 5242880, multiple: true }} onFileUpload={handleFileUpload}>
                        <p className="text-center text-zinc-400">{dictionary.harmonization.drop}</p>
                    </Dropzone>

                    {showOutput && (
                        <div className="flex flex-col items-start gap-4 mt-6">
                            <div className="flex justify-between items-center gap-4 w-full">
                                <label htmlFor="similarityThreshold" className="text-zinc-400 font-semibold">
                                    {dictionary.harmonization.similarity}
                                </label>
                                <span id="similarityThresholdValue" className="text-zinc-400 font-semibold">
                                    {similarityThreshold}
                                </span>
                            </div>
                            <Range
                                id="similarityThreshold"
                                min={0}
                                max={150}
                                value={similarityThreshold}
                                step={1}
                                onChange={handleThresholdChange}
                                className="w-full"
                                disabled={imageState.isLoading}
                            />

                            <div className="w-full mt-4">
                                <p className="text-zinc-400 font-semibold mb-2">{dictionary.harmonization.colors}</p>
                                <div id="paletteDisplay" className="flex flex-wrap gap-2">
                                    {palette.cleaned.map((color, index) => (
                                        <div
                                            key={`${color.join("-")}-${index}`}
                                            className="size-8 rounded-md border border-zinc-700 relative group cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125 hover:z-10"
                                            style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteColor(index)}
                                                className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/50 rounded-xs"
                                                aria-label={`Remove color ${index + 1}`}>
                                                <img
                                                    alt="close button"
                                                    src="/icons/close.svg"
                                                    className="w-4 h-4 invert opacity-0 group-hover:opacity-100"
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {showOutput && (
                    <div className="border-2 border-zinc-700 border-dashed rounded-3xl p-16 aspect-square relative">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                type="button"
                                onClick={() => {
                                    if (imageState.hasQuantizedData && outputCanvasRef.current && files.current) {
                                        const filename =
                                            files.current.name.replace(/(\.[^.]+)$/, "-harmonized$1") || "harmonized-image.png";
                                        downloadCanvas(outputCanvasRef.current, filename);
                                    }
                                }}
                                className="w-12 h-12 p-2 z-20 relative hover:bg-zinc-800/50 cursor-pointer transition bg-black/10 border border-white/10 rounded-md flex justify-center items-center"
                                disabled={imageState.isLoading || !imageState.hasQuantizedData}
                                aria-label="Download harmonized image">
                                <img alt="" src="/icons/download.svg" width="24" height="24" className="invert" />
                            </button>
                        </div>
                        <canvas ref={outputCanvasRef} id="output" className="pixelated size-full" />
                        {imageState.isLoading && (
                            <div className="absolute inset-0 bg-black/50 flex justify-center items-center rounded-[calc(1.5rem-1px)]">
                                <p className="text-white text-lg font-semibold animate-pulse">Processing...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
