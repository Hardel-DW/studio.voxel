/**
 * Downloads any content as a file
 */
export const downloadFile = async (content: Response | Blob | string, filename: string, mimeType = "text/plain") => {
    if (typeof window === "undefined") return;

    const blob =
        content instanceof Response ? await content.blob() : content instanceof Blob ? content : new Blob([content], { type: mimeType });

    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
        href: url,
        download: filename
    }).click();
    URL.revokeObjectURL(url);
};

/**
 * Downloads an image from a canvas
 * @param canvas The canvas containing the image
 * @param filename The desired filename (optional)
 * @param format The image format ('png' by default)
 */
export const downloadCanvas = (canvas: HTMLCanvasElement, filename = "image.png", format = "png") => {
    if (typeof window === "undefined" || !canvas) return;

    const mimeType = `image/${format}`;
    const url = canvas.toDataURL(mimeType);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
