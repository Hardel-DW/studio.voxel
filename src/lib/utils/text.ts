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
