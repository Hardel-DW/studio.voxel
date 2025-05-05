/**
 * Type représentant une couleur RGB sous forme de tuple de 3 nombres
 */
export type RGB = [number, number, number];

/**
 * Type représentant une palette de couleurs RGB
 */
export type Palette = RGB[];

/**
 * Trouve la couleur la plus proche dans une palette donnée en utilisant la distance euclidienne
 * @param {Palette} colors - Palette de couleurs dans laquelle chercher
 * @param {RGB} color - Couleur à comparer
 * @returns {RGB} La couleur de la palette la plus proche de la couleur donnée
 * @example
 * const palette = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];
 * const color = [240, 10, 10];
 * const closest = closest(palette, color); // Retourne [255, 0, 0]
 */
export const closest = (colors: Palette, color: RGB): RGB => {
    return colors.reduce((nearest, current) => {
        const currentDistance = Math.sqrt((current[0] - color[0]) ** 2 + (current[1] - color[1]) ** 2 + (current[2] - color[2]) ** 2);

        const nearestDistance = Math.sqrt((nearest[0] - color[0]) ** 2 + (nearest[1] - color[1]) ** 2 + (nearest[2] - color[2]) ** 2);

        return currentDistance < nearestDistance ? current : nearest;
    });
};

/**
 * Calcule la distance entre deux couleurs RGB
 * @param {RGB} color1 - Première couleur
 * @param {RGB} color2 - Deuxième couleur
 * @returns {number} Distance entre les deux couleurs
 */
export const colorDistance = (color1: RGB, color2: RGB): number => {
    return Math.sqrt((color1[0] - color2[0]) ** 2 + (color1[1] - color2[1]) ** 2 + (color1[2] - color2[2]) ** 2);
};

/**
 * Nettoie une palette en retirant les couleurs trop similaires
 * @param {Palette} palette - Palette à nettoyer
 * @param threshold - Seuil de similarité (0-442 où 0 = identique, 442 = très différent)
 * @returns {Palette} Nouvelle palette sans les couleurs trop similaires
 */
export const cleanPalette = (palette: Palette, threshold = 30): Palette => {
    return palette.reduce((acc: Palette, color) => {
        const isTooSimilar = acc.some((existingColor) => colorDistance(color, existingColor) < threshold);

        if (!isTooSimilar) {
            acc.push(color);
        }
        return acc;
    }, []);
};

/**
 * Extrait une palette de couleurs d'une image en comptant la fréquence des couleurs
 * @param {HTMLImageElement} image - L'image source
 * @param {number} numColors - Nombre de couleurs à extraire
 * @returns {Promise<Palette>} Une promesse contenant la palette de couleurs extraite
 * @throws {Error} Si le contexte 2D ne peut pas être obtenu
 * @example
 * const image = new Image();
 * image.src = "path/to/image.png";
 * const palette = await extractPalette(image, 8);
 */
export const extractPalette = async (image: HTMLImageElement, numColors: number): Promise<Palette> => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");

    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const colorMap = new Map<string, { color: RGB; count: number }>();

    for (let i = 0; i < imageData.data.length; i += 4) {
        const color: RGB = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];
        const key = color.join(",");

        const existing = colorMap.get(key);
        if (existing) {
            existing.count++;
        } else {
            colorMap.set(key, { color, count: 1 });
        }
    }

    return Array.from(colorMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, numColors)
        .map((item) => item.color);
};

/**
 * Quantifie une image en réduisant sa palette de couleurs
 * @param {HTMLImageElement} image - L'image source à quantifier
 * @param {Palette} palette - La palette de couleurs à utiliser
 * @returns {Promise<ImageData>} Une promesse contenant les données de l'image quantifiée
 * @throws {Error} Si le contexte 2D ne peut pas être obtenu
 * @example
 * const palette = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];
 * const quantized = await quantizeImage(image, palette);
 */
export const quantizeImage = async (image: HTMLImageElement, palette: Palette): Promise<ImageData> => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");

    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = ctx.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const originalColor: RGB = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];
        const closestColor = closest(palette, originalColor);

        newImageData.data[i] = closestColor[0];
        newImageData.data[i + 1] = closestColor[1];
        newImageData.data[i + 2] = closestColor[2];
        newImageData.data[i + 3] = imageData.data[i + 3];
    }

    return newImageData;
};

/**
 * Charge une image à partir d'un fichier
 * @param {File} file - Le fichier image à charger
 * @returns {Promise<HTMLImageElement>} Une promesse contenant l'élément Image chargé
 * @example
 * const fileInput = document.querySelector('input[type="file"]');
 * const image = await loadImage(fileInput.files[0]);
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            URL.revokeObjectURL(image.src); // Libérer la mémoire
            resolve(image);
        };
        image.onerror = reject;
    });
};
/**
 * Traite une image en réduisant sa palette de couleurs
 * @param {File} file - Le fichier image à traiter
 * @param {number} numColors - Nombre de couleurs dans la palette finale
 * @param {HTMLCanvasElement} canvas - Le canvas où afficher le résultat
 * @returns {Promise<void>}
 * @throws {Error} Si le contexte 2D ne peut pas être obtenu
 * @example
 * const canvas = document.getElementById('output');
 * await processImage(file, 8, canvas);
 */
export const processImage = async (file: File, numColors: number, canvas: HTMLCanvasElement): Promise<void> => {
    const image = await loadImage(file);

    // Ajuster la taille du canvas
    canvas.width = image.width;
    canvas.height = image.height;

    // Extraire et appliquer la palette
    const palette = await extractPalette(image, numColors);
    const quantizedImageData = await quantizeImage(image, palette);

    // Afficher le résultat
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.putImageData(quantizedImageData, 0, 0);
};
