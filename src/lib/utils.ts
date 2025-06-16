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

/**
 * A utility function to merge classnames
 * @param args
 */
export function clsx(...args: ClassValue[]): string {
    return args
        .map((arg) => toVal(arg))
        .filter(Boolean)
        .join(" ");
}

export function cn(...args: ClassValue[]) {
    return twMerge(clsx(args));
}

/**
 * Get the formatted date in the format "dd MMM yyyy"
 * @param date
 * @param regions
 */
export const getFormattedDate = (date: string | number | Date, regions = "fr-fr") =>
    date
        ? new Date(date).toLocaleDateString(regions, {
              year: "numeric",
              month: "short",
              day: "numeric"
          })
        : "";

/**
 * Capitalize the first letter of a string
 * @param s - string
 * @returns string with the first letter capitalized
 */
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Converts a snake_case string to Title Case
 * @param str The input string in snake_case
 * @returns The string in Title Case with spaces
 * @example
 * snakeToTitleCase("hello_world") // returns "Hello World"
 * snakeToTitleCase("my_cool_string") // returns "My Cool String"
 */
export function snakeToTitleCase(str: string): string {
    return str
        .split("_")
        .map((word) => capitalize(word))
        .join(" ");
}

export const PACK_VERSION = {
    "1": "1.12",
    "4": "1.13 - 1.14.4",
    "5": "1.15 - 1.16.1",
    "6": "1.16.2 - 1.16.5",
    "7": "1.17 - 1.17.1",
    "8": "1.18",
    "9": "1.18.2",
    "10": "1.19",
    "12": "1.19.4",
    "15": "1.20",
    "18": "1.20.2",
    "26": "1.20.3",
    "41": "1.20.5",
    "48": "1.21 - 1.21.1",
    "57": "1.21.2 - 1.21.3",
    "61": "1.21.4"
};

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
