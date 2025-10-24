import { useSession } from "@tanstack/react-start/server";

export type SessionData = {
    userId?: number;
    userLogin?: string;
    userAvatar?: string;
    githubToken?: string;
    oauthState?: string;
    returnTo?: string;
};

export function useAppSession() {
    return useSession({
        name: 'app-session',
        password: process.env.SESSION_SECRET,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
        },
    })
}
