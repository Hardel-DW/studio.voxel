"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import type { Locale } from "@/lib/i18n/i18nServer";
import { useParams } from "next/navigation";
import Button from "../ui/Button";

export default function NoConfigFound() {
    const params = useParams<{ lang: Locale }>();
    const hasElements = useConfiguratorStore((state) => state.elements.size > 0);
    if (hasElements) return null;

    return (
        <div className="size-full flex items-center justify-center flex-col gap-y-4">
            <h1 className="text-zinc-400 text-2xl font-bold">Sorry, no config found</h1>
            <div className="text-zinc-400 text-sm text-center">
                It seems like you don't have any config yet.
                <br />
                You probably refreshed the page, which deleted your configuration.
            </div>
            <div className="w-1/2">
                <hr />
            </div>
            <Button variant="white-shimmer" size="sm" href={`/${params.lang}/studio`}>
                Back to home
            </Button>
        </div>
    );
}
