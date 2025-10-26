import { useI18nStore } from "@/lib/i18n/i18nStore";

/**
 * Hook to get all translations for a specific namespace as a real dictionary object
 * Returns a Proxy that fetches translations on-demand using getTranslation
 * This avoids calling loadNamespace directly and lets the store handle loading
 *
 * @param namespace - The namespace to use (e.g., "tools", "registry")
 * @returns A proxy object that returns translations for any key accessed
 *
 * @example
 * const t = useClientDictionary("tools");
 * const title = t["foo.bar"]; // Returns translation for "tools:foo.bar"
 * const description = t["baz.qux"]; // Returns translation for "tools:baz.qux"
 */
export function useClientDictionary(namespace = "default") {
    const getTranslation = useI18nStore((state) => state.getTranslation);

    return new Proxy({} as Record<string, string>, {
        get: (_, key: string) => {
            const fullKey = namespace === "default" ? key : `${namespace}:${key}`;
            return getTranslation(fullKey);
        }
    });
}
