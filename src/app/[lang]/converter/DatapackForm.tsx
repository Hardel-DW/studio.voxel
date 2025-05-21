"use client";

import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/lib/hook/useNext18n";
import { trackEvent } from "@/lib/telemetry";
import { cn } from "@/lib/utils";
import type { ModMetadata } from "@voxelio/breeze/converter";
import { ModPlatforms, convertDatapack } from "@voxelio/breeze/converter";
import { useState } from "react";

interface Props {
    file: File | null;
    onFileChange: (file: File | null) => void;
    initialMetadata: ModMetadata;
    iconUrl: string | null;
}

const DatapackForm: React.FC<Props> = ({ file, initialMetadata, iconUrl }) => {
    const [metadata, setMetadata] = useState<ModMetadata>(initialMetadata);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newAuthor, setNewAuthor] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const dictionary = useDictionary();

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

            if (!result) {
                throw new Error("La conversion n'a pas généré de fichier valide");
            }

            const blob = await result.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name.replace(/\.zip$/i, ".jar");
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            await trackEvent("converted_datapack");
        } catch (error) {
            console.error("Conversion error:", error);
            setError(error instanceof Error ? error.message : dictionary.converter.error);
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="w-full bg-gradient-to-br from-zinc-950 to-zinc-950/50 p-4 rounded-lg border border-zinc-900">
            <div className="flex gap-4 mb-4">
                {iconUrl && <img src={iconUrl} alt="Pack icon" className="size-48 object-contain rounded-lg border border-zinc-700 p-2" />}

                <div className="flex items-center flex-col gap-2 h-48  w-full">
                    <div className="flex flex-col p-2 w-full border-y border-zinc-900 has-focus:border-zinc-700 transition-colors duration-200 rounded-lg">
                        <label htmlFor="mod-name" className="!h-fit text-xs text-zinc-400 font-medium">
                            {dictionary.converter.form.name}
                        </label>
                        <input
                            id="mod-name"
                            type="custom"
                            value={metadata.name}
                            onChange={(e) => setMetadata((prev) => ({ ...prev, name: e.target.value }))}
                            className="focus:outline-none rounded-md h-full"
                            required
                        />
                    </div>

                    <div className="flex flex-col p-2 flex-1 w-full border-y border-zinc-900 has-focus:border-zinc-700 transition-colors duration-200 rounded-lg">
                        <label htmlFor="mod-description" className="!h-fit text-xs text-zinc-400 font-medium">
                            {dictionary.converter.form.description}
                        </label>
                        <textarea
                            id="mod-description"
                            autoCorrect="off"
                            autoComplete="off"
                            value={metadata.description}
                            onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
                            className="focus:outline-none rounded-md h-full"
                            rows={3}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col p-2 w-1/2 border-y border-zinc-900 has-focus:border-zinc-700 transition-colors duration-200 rounded-lg">
                        <label htmlFor="mod-id" className="!h-fit text-xs text-zinc-400 font-medium">
                            {dictionary.converter.form.id}
                        </label>
                        <input
                            id="mod-id"
                            type="custom"
                            value={metadata.id}
                            onChange={(e) => setMetadata((prev) => ({ ...prev, id: e.target.value }))}
                            className="focus:outline-none rounded-md"
                            required
                        />
                    </div>

                    <div className="flex flex-col p-2 w-1/2 border-y border-zinc-900 has-focus:border-zinc-700 transition-colors duration-200 rounded-lg">
                        <label htmlFor="mod-version" className="!h-fit text-xs text-zinc-400 font-medium">
                            {dictionary.converter.form.version}
                        </label>
                        <input
                            id="mod-version"
                            type="custom"
                            value={metadata.version}
                            onChange={(e) => setMetadata((prev) => ({ ...prev, version: e.target.value }))}
                            className="focus:outline-none rounded-md"
                            required
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                    <span className={`transform transition-transform duration-200 ${showAdvanced ? "rotate-90" : ""}`}>›</span>
                    {dictionary.converter.form.advanced}
                </button>

                <div
                    className={cn("grid gap-4 transition-all duration-200 ease-in-out overflow-hidden", {
                        "grid-rows-[1fr] opacity-100": showAdvanced,
                        "grid-rows-[0fr] opacity-0": !showAdvanced
                    })}>
                    <div className="overflow-hidden">
                        <div className="grid gap-4">
                            <div className="flex flex-col p-2 w-full border-y border-zinc-900 has-focus:border-zinc-700 transition-colors duration-200 rounded-lg">
                                <label htmlFor="mod-authors" className="!h-fit text-xs text-zinc-400 font-medium">
                                    {dictionary.converter.form.authors}
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {metadata.authors.map((author) => (
                                        <span key={author} className="flex items-center gap-1 px-2 py-1 border-zinc-800 border rounded-md">
                                            <span className="text-sm">{author}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAuthor(author)}
                                                className="text-zinc-400 hover:text-rose-500">
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    id="mod-authors"
                                    type="custom"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    onKeyDown={handleAddAuthor}
                                    placeholder={dictionary.converter.form.authors_placeholder}
                                    className="focus:outline-none rounded-md"
                                />
                            </div>

                            <div className="flex flex-col p-2 w-full border-y border-zinc-900 has-focus:border-zinc-700 transition-colors duration-200 rounded-lg">
                                <label htmlFor="mod-github" className="!h-fit text-xs text-zinc-400 font-medium">
                                    {dictionary.converter.form.sources}
                                </label>
                                <input
                                    id="mod-github"
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
                                    placeholder="https://github.com/username/repository"
                                    className="focus:outline-none rounded-md"
                                />
                            </div>

                            <div className="flex flex-col p-2 w-full border-y border-zinc-900 has-focus:border-zinc-700 transition-colors duration-200 rounded-lg">
                                <label htmlFor="mod-homepage" className="!h-fit text-xs text-zinc-400 font-medium">
                                    {dictionary.converter.form.homepage}
                                </label>
                                <input
                                    id="mod-homepage"
                                    type="url"
                                    value={metadata.homepage}
                                    onChange={(e) => setMetadata((prev) => ({ ...prev, homepage: e.target.value }))}
                                    className="focus:outline-none rounded-md"
                                    placeholder="https://modrinth.com/mod/datapack"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center space-x-4 mt-4">
                <div className="flex flex-col gap-2 flex-1">
                    <p className="text-xs text-zinc-500">{dictionary.converter.form.advanced_description}</p>
                    {error && <p className="text-sm text-rose-500">{error}</p>}
                </div>
                <Button onClick={handleConvert} type="button" variant="white-shimmer" disabled={!file || isConverting}>
                    {isConverting ? dictionary.converter.form.download_disabled : dictionary.converter.form.download}
                </Button>
            </div>
        </div>
    );
};

export default DatapackForm;
