/// <reference types="vite/client" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly SESSION_SECRET: string;
            readonly GITHUB_CLIENT: string;
            readonly GITHUB_SECRET: string;
        }
    }
}

export {};
