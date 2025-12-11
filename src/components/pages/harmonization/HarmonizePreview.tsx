import { useParams } from "@tanstack/react-router";
import { type RefObject, useState } from "react";
import { t } from "@/lib/i18n/i18n";

interface HarmonizePreviewProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    isLoading: boolean;
    hasData: boolean;
    hasImage: boolean;
    onDownload: () => void;
}

export default function HarmonizePreview({ canvasRef, isLoading, hasData, hasImage, onDownload }: HarmonizePreviewProps) {
    const [zoom, setZoom] = useState(1);
    const { lang } = useParams({ from: "/$lang" });
    const translate = t(lang);

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 5));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#151515]">
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}></div>

            <canvas
                ref={canvasRef}
                style={{
                    transform: `scale(${isLoading ? 0.95 : zoom})`
                }}
                className={`max-w-full max-h-full object-contain pixelated transition-transform duration-300 ease-out ${isLoading ? "opacity-50 blur-lg grayscale" : "opacity-100"}`}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-4 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="size-12 border-4 border-white/10 border-t-pink-500 rounded-full animate-spin" />
                        <p className="text-base font-medium text-white tracking-wide animate-pulse">
                            {translate("harmonization.processing")}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State - Only show if we truly have no image selected */}
            {!hasImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="text-center p-12 text-zinc-600 flex flex-col items-center gap-6 max-w-md">
                        <div className="size-24 rounded-4xl bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-700 shadow-2xl shadow-black/50 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img src="/icons/image.svg" className="size-10 opacity-30 invert" alt="" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-zinc-300">{translate("harmonization.no_image_selected")}</h3>
                            <p className="text-sm text-zinc-500">{translate("harmonization.no_image_selected_description")}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls Overlay - Show if we have an image, even if processing or result not ready yet */}
            <div className={`transition-opacity duration-200 ${hasImage ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                {/* Zoom Controls - Bottom Left */}
                <div className="absolute bottom-8 left-8 z-30 flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-xl shadow-black/50">
                    <button
                        type="button"
                        onClick={handleZoomOut}
                        className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
                        disabled={zoom <= 0.5}
                        aria-label={translate("generic.zoom_out")}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>

                    <span className="w-14 text-center font-mono text-sm font-medium text-zinc-200 select-none">
                        {Math.round(zoom * 100)}%
                    </span>

                    <button
                        type="button"
                        onClick={handleZoomIn}
                        className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
                        disabled={zoom >= 5}
                        aria-label={translate("generic.zoom_in")}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>

                {/* Download Button - Bottom Right */}
                <div
                    className={`absolute bottom-8 right-8 z-30 transition-all duration-300 ${hasData && !isLoading ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}>
                    <button
                        type="button"
                        onClick={onDownload}
                        className="group flex items-center justify-center gap-0 px-4 py-4 hover:px-6 bg-white text-black rounded-full shadow-xl shadow-black/50 hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-zinc-100 font-bold min-w-[56px] h-[56px] cursor-pointer"
                        title={translate("generic.download")}>
                        <img src="/icons/download.svg" className="size-5 shrink-0" alt="" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] group-hover:ml-3 transition-all duration-500 whitespace-nowrap text-sm">
                            {translate("generic.download")}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
