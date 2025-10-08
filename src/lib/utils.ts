import { twMerge } from "tailwind-merge";

export type ClassDictionary = Record<string, unknown>;
export type ClassArray = ClassValue[];
export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;

function toVal(mix: ClassValue): string {
    if (typeof mix === "string" || typeof mix === "number") {
        return String(mix);
    }

    if (Array.isArray(mix)) {
        return mix
            .map((item: ClassValue) => toVal(item))
            .filter(Boolean)
            .join(" ");
    }

    if (typeof mix === "object" && mix !== null) {
        return Object.keys(mix)
            .filter((key) => mix[key])
            .join(" ");
    }

    return "";
}

export const clsx = (...args: ClassValue[]) =>
    args
        .map((arg) => toVal(arg))
        .filter(Boolean)
        .join(" ");
export const cn = (...args: ClassValue[]) => twMerge(clsx(args));

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

/**
 * Replace underscores with spaces and capitalize the first letter of each word
 * @param str - The input string
 * @returns The string with spaces and capitalized first letters
 */
export function ruwsc(str: string): string {
    return str
        .replace(/[_/]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim();
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    }) as T;
}
