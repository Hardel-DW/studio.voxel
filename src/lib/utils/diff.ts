export type DiffLineType = "unchanged" | "added" | "removed";
export interface DiffLine {
    type: DiffLineType;
    content: string;
}

export function computeLineDiff(original: string, modified: string): DiffLine[] {
    const originalLines = original.split("\n");
    const modifiedLines = modified.split("\n");
    const result: DiffLine[] = [];

    let i = 0;
    let j = 0;

    while (i < originalLines.length || j < modifiedLines.length) {
        if (i >= originalLines.length) {
            result.push({ type: "added", content: modifiedLines[j] });
            j++;
        } else if (j >= modifiedLines.length) {
            result.push({ type: "removed", content: originalLines[i] });
            i++;
        } else if (originalLines[i] === modifiedLines[j]) {
            result.push({ type: "unchanged", content: originalLines[i] });
            i++;
            j++;
        } else {
            const lookAheadOriginal = originalLines.slice(i, i + 5).indexOf(modifiedLines[j]);
            const lookAheadModified = modifiedLines.slice(j, j + 5).indexOf(originalLines[i]);

            if (lookAheadOriginal !== -1 && (lookAheadModified === -1 || lookAheadOriginal <= lookAheadModified)) {
                for (let k = 0; k < lookAheadOriginal; k++) {
                    result.push({ type: "removed", content: originalLines[i + k] });
                }
                i += lookAheadOriginal;
            } else if (lookAheadModified !== -1) {
                for (let k = 0; k < lookAheadModified; k++) {
                    result.push({ type: "added", content: modifiedLines[j + k] });
                }
                j += lookAheadModified;
            } else {
                result.push({ type: "removed", content: originalLines[i] });
                result.push({ type: "added", content: modifiedLines[j] });
                i++;
                j++;
            }
        }
    }

    return result;
}