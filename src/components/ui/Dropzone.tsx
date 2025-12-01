import type React from "react";
import { useId, useState } from "react";

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
    const [_isDragging, setIsDragging] = useState(false);
    const uniqueId = useId();
    const fileInputId = `dropzone-file-${uniqueId}`;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileUpload(event.target.files);
            event.target.value = "";
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
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
                <label htmlFor={fileInputId} id={id} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                    {children}
                    <input
                        id={fileInputId}
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
    );
};

export default Dropzone;
