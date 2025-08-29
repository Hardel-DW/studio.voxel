import { useEffect, useState } from "react";
import { cleanPalette, extractPalette, quantizeImage, type RGB } from "@/lib/utils/color";

export default function useImageProcessor() {
    const [palette, setPalette] = useState({
        original: [] as RGB[],
        cleaned: [] as RGB[]
    });
    const [imageState, setImageState] = useState({
        hasQuantizedData: false,
        isLoading: false,
        processingTimeout: null as NodeJS.Timeout | null
    });

    const resetPalette = () => setPalette({ original: [], cleaned: [] });

    const processImage = async (image: HTMLImageElement, threshold: number) => {
        try {
            const originalPalette = await extractPalette(image, 128);
            const cleanedPalette = cleanPalette(originalPalette, threshold);
            const quantized = await quantizeImage(image, cleanedPalette);

            setPalette({ original: originalPalette, cleaned: cleanedPalette });
            return { quantizedData: quantized, success: true };
        } catch (error) {
            console.error("Error processing image:", error);
            resetPalette();
            return { quantizedData: null, success: false };
        }
    };

    const startLoading = () => {
        const timeout = setTimeout(() => {
            setImageState((prev) => ({ ...prev, isLoading: true }));
        }, 150);

        setImageState((prev) => ({
            ...prev,
            processingTimeout: timeout
        }));

        return timeout;
    };

    const stopLoading = () => {
        setImageState((prev) => {
            if (prev.processingTimeout) {
                clearTimeout(prev.processingTimeout);
            }
            return { ...prev, isLoading: false, processingTimeout: null };
        });
    };

    const setHasQuantizedData = (value: boolean) => {
        setImageState((prev) => ({ ...prev, hasQuantizedData: value }));
    };

    const deleteColor = (indexToDelete: number) => {
        setPalette((prev) => {
            if (indexToDelete < 0 || indexToDelete >= prev.original.length) return prev;
            const newOriginal = prev.original.filter((_, i) => i !== indexToDelete);
            return { ...prev, original: newOriginal };
        });
        return palette.original.filter((_, i) => i !== indexToDelete);
    };

    const updateCleanedPalette = (newCleanedPalette: RGB[]) => {
        setPalette((prev) => ({
            ...prev,
            cleaned: newCleanedPalette
        }));
    };

    useEffect(() => {
        return () => {
            if (imageState.processingTimeout) {
                clearTimeout(imageState.processingTimeout);
            }
        };
    }, [imageState.processingTimeout]);

    return {
        palette,
        imageState: {
            hasQuantizedData: imageState.hasQuantizedData,
            isLoading: imageState.isLoading
        },
        actions: {
            processImage,
            startLoading,
            stopLoading,
            setHasQuantizedData,
            deleteColor,
            resetPalette,
            updateCleanedPalette
        }
    };
}
