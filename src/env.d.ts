/// <reference types="vite/client" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly GITHUB_CLIENT: string;
            readonly GITHUB_SECRET: string;
            readonly SESSION_SECRET: string;
            readonly APP_URL: string;
            readonly VITE_DISABLE_GITHUB_ACTIONS: string;
        }
    }
}

export {};
