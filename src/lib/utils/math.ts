/**
 * Calculate the median of an array of numbers
 * @param values - array of numbers
 * @returns the median of the array
 */
export function calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[half - 1] + sorted[half]) / 2;
    }

    return sorted[half];
}
