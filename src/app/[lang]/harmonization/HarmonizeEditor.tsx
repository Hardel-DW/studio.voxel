"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/ui/Dropzone";
import { extractPalette, loadImage, quantizeImage, type RGB, cleanPalette } from "@/lib/utils/color";
import { useDictionary } from "@/lib/hook/useNext18n";

export default function HarmonizeEditor() {
    const dictionary = useDictionary();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
    const originalPaletteRef = useRef<RGB[]>([]);
    const [cleanedPalette, setCleanedPalette] = useState<RGB[]>([]);
    const [similarityThreshold, setSimilarityThreshold] = useState<number>(30);
    const [hasQuantizedData, setHasQuantizedData] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const processAndQuantizeImage = async (file: File, threshold: number) => {
        if (!file) return;
        setHasQuantizedData(false);
        try {
            const image = await loadImage(file);
            originalPaletteRef.current = await extractPalette(image, 128);
            const cleaned = cleanPalette(originalPaletteRef.current, threshold);
            setCleanedPalette(cleaned);
            const quantized = await quantizeImage(image, cleaned);
            setHasQuantizedData(true);
            drawCanvas(quantized);
        } catch (error) {
            console.error("Error processing image:", error);
            originalPaletteRef.current = [];
            setCleanedPalette([]);
            setHasQuantizedData(false);
            drawCanvas(null);
            throw error;
        }
    };

    const cleanAndQuantizePalette = async (paletteToClean: RGB[], threshold: number) => {
        if (!uploadedFiles[currentFileIndex] || paletteToClean.length === 0) return;
        setHasQuantizedData(false);
        try {
            const cleaned = cleanPalette(paletteToClean, threshold);
            setCleanedPalette(cleaned);
            const image = await loadImage(uploadedFiles[currentFileIndex]);
            const quantized = await quantizeImage(image, cleaned);
            setHasQuantizedData(true);
            drawCanvas(quantized);
        } catch (error) {
            console.error("Error cleaning/quantizing palette:", error);
            setCleanedPalette([]);
            setHasQuantizedData(false);
            drawCanvas(null);
            throw error;
        }
    };

    const handleFileUpload = (fileList: FileList) => {
        const acceptedFiles = Array.from(fileList);
        if (!acceptedFiles.length) return;

        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

        const newFiles = [...uploadedFiles, ...acceptedFiles];
        setUploadedFiles(newFiles);
        const newIndex = newFiles.length - 1;
        setCurrentFileIndex(newIndex);
        const newUrls: Record<string, string> = {};
        for (const file of acceptedFiles) {
            const url = URL.createObjectURL(file);
            newUrls[file.name + file.lastModified] = url;
        }
        setObjectUrls((prev) => ({ ...prev, ...newUrls }));

        loadingTimeoutRef.current = setTimeout(() => {
            setIsLoading(true);
        }, 150);

        processAndQuantizeImage(acceptedFiles[0], similarityThreshold)
            .catch(() => {})
            .finally(() => {
                if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
                setIsLoading(false);
            });
    };

    const handleSelectImage = (index: number) => {
        if (index === currentFileIndex || !uploadedFiles[index]) return;
        setCurrentFileIndex(index);

        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = setTimeout(() => {
            setIsLoading(true);
        }, 150);

        processAndQuantizeImage(uploadedFiles[index], similarityThreshold)
            .catch(() => {})
            .finally(() => {
                if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
                setIsLoading(false);
            });
    };

    const handleDeleteImage = (indexToDelete: number) => {
        const fileToDelete = uploadedFiles[indexToDelete];
        const keyToDelete = fileToDelete.name + fileToDelete.lastModified;

        if (objectUrls[keyToDelete]) {
            URL.revokeObjectURL(objectUrls[keyToDelete]);
            setObjectUrls((prev) => {
                const next = { ...prev };
                delete next[keyToDelete];
                return next;
            });
        }

        const remainingFiles = uploadedFiles.filter((_, i) => i !== indexToDelete);
        setUploadedFiles(remainingFiles);

        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        setIsLoading(false);

        if (remainingFiles.length === 0) {
            setCurrentFileIndex(-1);
            originalPaletteRef.current = [];
            setCleanedPalette([]);
            setHasQuantizedData(false);
            drawCanvas(null);
        } else if (currentFileIndex === indexToDelete) {
            const newIndex = 0;
            setCurrentFileIndex(newIndex);
            loadingTimeoutRef.current = setTimeout(() => setIsLoading(true), 150);
            processAndQuantizeImage(remainingFiles[newIndex], similarityThreshold)
                .catch(() => {})
                .finally(() => {
                    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
                    setIsLoading(false);
                });
        } else if (currentFileIndex > indexToDelete) {
            setCurrentFileIndex(currentFileIndex - 1);
        }
    };

    const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newThreshold = Number.parseInt(event.target.value, 10);
        setSimilarityThreshold(newThreshold);

        if (originalPaletteRef.current.length > 0 && currentFileIndex !== -1) {
            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(true);
            }, 150);

            cleanAndQuantizePalette(originalPaletteRef.current, newThreshold)
                .catch(() => {})
                .finally(() => {
                    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
                    setIsLoading(false);
                });
        }
    };

    const handleDeleteColor = (indexToDelete: number) => {
        if (!originalPaletteRef.current || indexToDelete < 0 || indexToDelete >= originalPaletteRef.current.length) return;
        const newOriginal = originalPaletteRef.current.filter((_, i) => i !== indexToDelete);
        originalPaletteRef.current = newOriginal;

        if (currentFileIndex !== -1 && newOriginal.length > 0) {
            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = setTimeout(() => setIsLoading(true), 150);

            cleanAndQuantizePalette(newOriginal, similarityThreshold)
                .catch(() => {})
                .finally(() => {
                    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
                    setIsLoading(false);
                });
        } else if (currentFileIndex !== -1) {
            setCleanedPalette([]);
            setHasQuantizedData(false);
            drawCanvas(null);
            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!hasQuantizedData || !outputCanvasRef.current || currentFileIndex === -1 || !uploadedFiles[currentFileIndex]) return;
        const canvas = outputCanvasRef.current;
        const link = document.createElement("a");
        link.download = uploadedFiles[currentFileIndex].name.replace(/(\.[^.]+)$/, "-harmonized$1") || "harmonized-image.png";
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const clearLoaderTimeout = () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
        const cleanupUrls = () => {
            Object.values(objectUrls).forEach(URL.revokeObjectURL);
        };

        return () => {
            clearLoaderTimeout();
            cleanupUrls();
        };
    }, [objectUrls]);

    const showOutput = uploadedFiles.length > 0 && currentFileIndex !== -1;

    return (
        <>
            <style>{`
                ${showOutput ? "#initial-description, #initial-gallery { display: none; }" : ""}
            `}</style>

            <div className={`mb-8 w-full ${!showOutput ? "hidden" : ""}`}>
                <div id="imageGallery" className="flex gap-4 overflow-x-auto pb-4 min-h-25 items-center">
                    {uploadedFiles.map((file, index) => {
                        const key = file.name + file.lastModified;
                        const imageUrl = objectUrls[key] || "";
                        return (
                            <div key={key} className="relative group shrink-0" onClick={() => handleSelectImage(index)}>
                                <img
                                    src={imageUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-24 h-24 p-2 object-cover rounded-lg border-2 border-zinc-700 cursor-pointer transition-all duration-200 pixelated ${index === currentFileIndex ? "border-pink-600" : ""}`}
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
                            </div>
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
                            <input
                                type="range"
                                id="similarityThreshold"
                                min="0"
                                max="150"
                                value={similarityThreshold}
                                onChange={handleThresholdChange}
                                className="w-full"
                                disabled={isLoading}
                            />

                            <div className="w-full mt-4">
                                <p className="text-zinc-400 font-semibold mb-2">{dictionary.harmonization.colors}</p>
                                <div id="paletteDisplay" className="flex flex-wrap gap-2">
                                    {cleanedPalette.map((color, index) => (
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
                                onClick={handleDownload}
                                className="w-12 h-12 p-2 z-20 relative hover:bg-zinc-800/50 cursor-pointer transition bg-black/10 border border-white/10 rounded-md flex justify-center items-center"
                                disabled={isLoading || !hasQuantizedData}
                                aria-label="Download harmonized image">
                                <img alt="" src="/icons/download.svg" width="24" height="24" className="invert" />
                            </button>
                        </div>
                        <canvas ref={outputCanvasRef} id="output" className="pixelated size-full" />
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/50 flex justify-center items-center rounded-[calc(1.5rem-1px)]">
                                <p className="text-white text-lg font-semibold animate-pulse">Processing...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
