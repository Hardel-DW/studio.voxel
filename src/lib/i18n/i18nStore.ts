import { create } from "zustand";
import enUsDefault from "@/i18n/studio/en-us.json";
import frFrDefault from "@/i18n/studio/fr-fr.json";

interface I18nState {
    language: string;
    translations: Map<string, string>; // en-us@tools:foo.bar
    namespaceStatus: Map<string, "loading" | "loaded" | "error">; // en-us@tools
    setLanguage: (lang: string) => Promise<void>;
    getTranslation: (key: string) => string;
    loadNamespace: (namespace: string) => Promise<void>;
}

const getInitialTranslations = (): Map<string, string> => {
    const translations = new Map<string, string>();

    for (const [k, v] of Object.entries(enUsDefault)) {
        if (typeof v === "string") translations.set(`en-us@${k}`, v);
    }

    for (const [k, v] of Object.entries(frFrDefault)) {
        if (typeof v === "string") translations.set(`fr-fr@${k}`, v);
    }

    return translations;
};

const getInitialNamespaceStatus = (): Map<string, "loading" | "loaded" | "error"> => {
    const status = new Map<string, "loading" | "loaded" | "error">();
    status.set("en-us@default", "loaded");
    status.set("fr-fr@default", "loaded");
    return status;
};

export const useI18nStore = create<I18nState>((set, get) => ({
    language: "en-us",
    translations: getInitialTranslations(),
    namespaceStatus: getInitialNamespaceStatus(),
    setLanguage: async (lang: string) => set({ language: lang }),
    getTranslation: (key: string) => {
        const state = get();
        const namespace = key.includes(":") ? key.split(":")[0] : "default";
        const nsKey = `${state.language}@${namespace}`;

        if (state.namespaceStatus.get(nsKey) !== "loaded" && state.namespaceStatus.get(nsKey) !== "loading") {
            state.loadNamespace(namespace);
            return key;
        }

        return state.translations.get(`${state.language}@${key}`) ?? key;
    },
    loadNamespace: async (namespace: string) => {
        const state = get();
        const nsKey = `${state.language}@${namespace}`;

        if (namespace === "default" || state.namespaceStatus.get(nsKey) === "loaded" || state.namespaceStatus.get(nsKey) === "loading")
            return;
        set((current) => ({
            namespaceStatus: new Map(current.namespaceStatus).set(nsKey, "loading")
        }));

        try {
            let module: any;
            switch (state.language) {
                case "en-us":
                    module = await import(`@/i18n/studio/en-us/${namespace}.json`);
                    break;
                case "fr-fr":
                    module = await import(`@/i18n/studio/fr-fr/${namespace}.json`);
                    break;
                default:
                    module = await import(`@/i18n/studio/en-us/${namespace}.json`);
            }

            set((current) => {
                const newTranslations = new Map(current.translations);
                const newNamespaceStatus = new Map(current.namespaceStatus);

                for (const [k, v] of Object.entries(module.default)) {
                    if (typeof v === "string") {
                        const fullKey = `${namespace}:${k}`;
                        newTranslations.set(`${state.language}@${fullKey}`, v);
                    }
                }
                newNamespaceStatus.set(nsKey, "loaded");

                return {
                    translations: newTranslations,
                    namespaceStatus: newNamespaceStatus
                };
            });
        } catch {
            console.warn(`Namespace ${namespace} not found`);
            set((current) => ({
                namespaceStatus: new Map(current.namespaceStatus).set(nsKey, "error")
            }));
        }
    }
}));

if (typeof window !== "undefined") {
    useI18nStore.getState().loadNamespace("default");
}
