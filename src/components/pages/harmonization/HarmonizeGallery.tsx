import type { FileState } from "@/lib/hook/useFileManager";
import { useTranslate } from "@/lib/i18n";

interface HarmonizeGalleryProps {
    files: FileState;
    onSelect: (index: number) => void;
    onDelete: (index: number) => void;
}

export default function HarmonizeGallery({ files, onSelect, onDelete }: HarmonizeGalleryProps) {
    const t = useTranslate();
    if (files.items.length === 0) return null;

    return (
        <div className="w-full overflow-hidden">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-1">{t("harmonization.uploaded_images")}</p>
            <div className="flex gap-3 overflow-x-auto pb-4 min-h-24 items-center scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent px-1">
                {files.items.map((file, index) => {
                    const key = file.name + file.lastModified;
                    const imageUrl = files.objectUrls[key] || "";
                    const isActive = index === files.currentIndex;

                    return (
                        <div
                            key={key}
                            className={`
                                relative group shrink-0 rounded-xl overflow-hidden transition-all duration-300 border
                                ${
                                    isActive
                                        ? "border-white/80 shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] scale-100 ring-1 ring-white/50"
                                        : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100 scale-95 hover:scale-100"
                                }
                            `}>
                            <button
                                type="button"
                                onClick={() => onSelect(index)}
                                className="block w-full h-full cursor-pointer focus:outline-none"
                                aria-label={t("harmonization.select_image", { index: index + 1 })}>
                                <img
                                    src={imageUrl}
                                    alt={t("harmonization.thumbnail", { index: index + 1 })}
                                    className="size-20 object-cover pixelated bg-zinc-900/50"
                                />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(index);
                                }}
                                className="absolute top-1 right-1 p-1.5 rounded-lg bg-black/60 hover:bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer shadow-sm"
                                aria-label={t("harmonization.remove_image", { index: index + 1 })}>
                                <img src="/icons/close.svg" className="size-3 invert" alt="Close" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
