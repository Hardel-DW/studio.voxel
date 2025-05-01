/**
 * Télécharge un fichier dans le navigateur
 * @param content Le contenu du fichier en Uint8Array
 * @param filename Le nom du fichier
 * @param type Le type MIME du fichier
 */
export const downloadFile = (content: Uint8Array, filename: string, type: string) => {
    if (typeof window === "undefined") return;

    const blob = new Blob([content], { type });
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
export const downloadArchive = (content: Uint8Array, name: string, isModded = false) => {
    const extension = isModded ? "jar" : "zip";
    downloadFile(content, `${name}.${extension}`, `application/${extension}`);
};
