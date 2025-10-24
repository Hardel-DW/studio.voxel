import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/session";

export type AuthSession = {
    authenticated: true;
    user: {
        login: string;
        id: number;
        avatar_url: string;
    };
    token: string;
} | {
    authenticated: false;
};

export const getSessionFn = createServerFn({ method: "GET" }).handler(async (): Promise<AuthSession> => {
    const session = await useAppSession();
    const data = session.data;

    if (!data.userId || !data.userLogin || !data.githubToken) {
        return { authenticated: false };
    }

    return {
        authenticated: true,
        user: {
            login: data.userLogin,
            id: data.userId,
            avatar_url: data.userAvatar || "",
        },
        token: data.githubToken,
    };
});

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
    const session = await useAppSession();
    await session.clear();
    return { success: true };
});
