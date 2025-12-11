import { useParams } from "@tanstack/react-router";
import type { ModMetadata } from "@voxelio/converter";
import { convertDatapack, ModPlatforms } from "@voxelio/converter";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n/i18n";
import { cn } from "@/lib/utils";
import { downloadFile } from "@/lib/utils/download";
import { trackEvent } from "@/lib/utils/telemetry";

interface Props {
    file: File;
    onFileChange: () => void;
    initialMetadata: ModMetadata;
    iconUrl: string | null;
}

export default function ConverterForm({ file, onFileChange, initialMetadata, iconUrl }: Props) {
    const { lang } = useParams({ from: "/$lang" });
    const [metadata, setMetadata] = useState<ModMetadata>(initialMetadata);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newAuthor, setNewAuthor] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const translate = t(lang);

    const handleAddAuthor = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newAuthor.trim()) {
            e.preventDefault();
            setMetadata((prev) => ({
                ...prev,
                authors: [...prev.authors, newAuthor.trim()]
            }));
            setNewAuthor("");
        }
    };

    const removeAuthor = (authorToRemove: string) => {
        setMetadata((prev) => ({
            ...prev,
            authors: prev.authors.filter((author) => author !== authorToRemove)
        }));
    };

    const handleConvert = async () => {
        if (!file) return;

        setIsConverting(true);
        setError(null);

        try {
            const platforms = [ModPlatforms.FORGE, ModPlatforms.FABRIC, ModPlatforms.QUILT, ModPlatforms.NEOFORGE];
            const result = await convertDatapack(file, platforms, metadata);
            if (!result) throw new Error("The conversion did not generate a valid file");

            const blob = await result.blob();
            await downloadFile(blob, file.name.replace(/\.zip$/i, ".jar"));
            await trackEvent("converted_datapack");
        } catch (error) {
            console.error("Conversion error:", error);
            setError(error instanceof Error ? error.message : translate("converter.error"));
        } finally {
            setIsConverting(false);
        }
    };

    const InputGroup = ({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) => (
        <div className={cn("flex flex-col gap-2", className)}>
            <span className="text-xs font-medium text-zinc-400 ml-1">{label}</span>
            {children}
        </div>
    );

    const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input
            {...props}
            className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50 transition-all placeholder:text-zinc-600"
        />
    );

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Header Card */}
            <div className="bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl flex items-start gap-6">
                <div className="shrink-0 size-24 rounded-2xl bg-zinc-950/50 border border-white/5 flex items-center justify-center overflow-hidden">
                    {iconUrl ? (
                        <img src={iconUrl} alt="Icon" className="w-full h-full object-contain pixelated" />
                    ) : (
                        <img src="/icons/folder.svg" className="size-10 opacity-20 invert" alt="Default Icon" />
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                            <p className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            type="button"
                            onClick={onFileChange}
                            className="text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors">
                            {translate("converter.form.change_file")}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label={translate("converter.form.name")}>
                            <StyledInput
                                value={metadata.name}
                                onChange={(e) => setMetadata((prev) => ({ ...prev, name: e.target.value }))}
                            />
                        </InputGroup>
                        <InputGroup label={translate("converter.form.version")}>
                            <StyledInput
                                value={metadata.version}
                                onChange={(e) => setMetadata((prev) => ({ ...prev, version: e.target.value }))}
                            />
                        </InputGroup>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-xl space-y-6">
                <InputGroup label={translate("converter.form.description")}>
                    <textarea
                        value={metadata.description}
                        onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50 transition-all placeholder:text-zinc-600 min-h-[100px] resize-none"
                    />
                </InputGroup>

                <div className="grid grid-cols-2 gap-6">
                    <InputGroup label={translate("converter.form.id")}>
                        <StyledInput value={metadata.id} onChange={(e) => setMetadata((prev) => ({ ...prev, id: e.target.value }))} />
                    </InputGroup>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-zinc-300 transition-all border border-white/5">
                            <span>{translate("converter.form.advanced")}</span>
                            <span
                                className={`transform transition-transform duration-200 text-zinc-500 ${showAdvanced ? "rotate-90" : ""}`}>
                                ›
                            </span>
                        </button>
                    </div>
                </div>

                {/* Advanced Section */}
                <div
                    className={cn("grid transition-all duration-300 ease-in-out overflow-hidden", {
                        "grid-rows-[1fr] opacity-100": showAdvanced,
                        "grid-rows-[0fr] opacity-0": !showAdvanced
                    })}>
                    <div className="overflow-hidden space-y-6 pt-2">
                        <InputGroup label={translate("converter.form.authors")}>
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {metadata.authors.map((author) => (
                                        <span
                                            key={author}
                                            className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                                            <span className="text-xs font-medium text-pink-200">{author}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAuthor(author)}
                                                className="text-pink-300/50 hover:text-pink-300 cursor-pointer">
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <StyledInput
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    onKeyDown={handleAddAuthor}
                                    placeholder={translate("converter.form.authors_placeholder")}
                                />
                            </div>
                        </InputGroup>

                        <div className="grid grid-cols-2 gap-6">
                            <InputGroup label={translate("converter.form.sources")}>
                                <StyledInput
                                    type="url"
                                    value={metadata.sources}
                                    onChange={(e) => {
                                        const url = e.target.value;
                                        setMetadata((prev) => ({
                                            ...prev,
                                            sources: url,
                                            issues: `${url}/issues`
                                        }));
                                    }}
                                    placeholder="https://github.com/..."
                                />
                            </InputGroup>
                            <InputGroup label={translate("converter.form.homepage")}>
                                <StyledInput
                                    type="url"
                                    value={metadata.homepage}
                                    onChange={(e) => setMetadata((prev) => ({ ...prev, homepage: e.target.value }))}
                                    placeholder="https://modrinth.com/..."
                                />
                            </InputGroup>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        {error ? (
                            <p className="text-sm text-red-400 flex items-center gap-2">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </p>
                        ) : (
                            <p className="text-xs text-zinc-500 max-w-xs">{translate("converter.form.advanced_description")}</p>
                        )}
                    </div>

                    <Button
                        onClick={handleConvert}
                        type="button"
                        variant="shimmer"
                        disabled={!file || isConverting}
                        className="px-8 cursor-pointer">
                        {isConverting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin size-4" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                {translate("converter.form.converting")}
                            </span>
                        ) : (
                            translate("converter.form.download")
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
