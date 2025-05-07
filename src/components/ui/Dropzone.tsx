"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import { useState } from "react";

export interface Props {
    children: React.ReactNode;
    dropzone: {
        accept: string;
        maxSize: number;
        multiple: boolean;
    };
    onFileUpload: (files: FileList) => void;
    id?: string;
    disabled?: boolean;
}

const Dropzone: React.FC<Props> = ({ dropzone, onFileUpload, children, id, disabled }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileUpload(event.target.files);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            onFileUpload(files);
        }
    };

    return (
        <div className="mx-auto">
            <div className="flex items-center justify-center h-full w-full">
                <div
                    id={id}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "w-full h-64 flex flex-col items-center justify-center bg-radial from-zinc-950/20 to-zinc-900/20 backdrop-blur-sm border border-b-zinc-950 border-r-zinc-950 border-t-zinc-900 border-l-zinc-900 rounded-3xl shadow-2xl shadow-black transition",
                        isDragging ? "opacity-100 scale-[1.02] border-pink-700" : "hover:border-zinc-700",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}>
                    <label
                        htmlFor="dropzone-file"
                        className="cursor-pointer flex flex-col items-center justify-center w-full !h-full p-10 sm:p-16">
                        <div className="flex flex-col items-center justify-center gap-y-8 w-full">
                            <img alt="upload" src="/icons/upload.svg" className="w-16 h-16 invert" />
                            {children}
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept={dropzone.accept}
                            multiple={dropzone.multiple}
                            onChange={handleFileChange}
                            disabled={disabled}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Dropzone;
