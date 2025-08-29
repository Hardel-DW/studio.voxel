/**
 * Télécharge un fichier dans le navigateur
 * @param content Le contenu du fichier en Uint8Array
 * @param filename Le nom du fichier
 * @param type Le type MIME du fichier
 */
export const downloadFile = async (content: Response, filename: string) => {
    if (typeof window === "undefined") return;

    const blob = await content.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

/**
 * Télécharge un fichier ZIP ou JAR
 * @param content Le contenu du fichier
 * @param name Le nom du fichier sans extension
 * @param isModded Si true, utilise l'extension .jar, sinon .zip
 */
export const downloadArchive = (content: Response, name: string, isModded = false) => {
    const extension = isModded ? "jar" : "zip";
    downloadFile(content, `${name}.${extension}`);
};

/**
 * Télécharge une image à partir d'un canvas
 * @param canvas Le canvas contenant l'image
 * @param filename Le nom de fichier souhaité (optionnel)
 * @param format Le format de l'image ('png' par défaut)
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
