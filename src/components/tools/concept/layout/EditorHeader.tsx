import { Identifier, type IdentifierObject } from "@voxelio/breeze";
import type { ReactNode } from "react";
import Translate from "@/components/ui/Translate";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import { EditorBreadcrumb } from "./EditorBreadcrumb";

interface EditorHeaderProps {
    fallbackTitle: string;
    descriptionKey: string;
    identifier?: IdentifierObject;
    filterPath?: string;
    isOverview: boolean;
    onBack?: () => void;
    children?: ReactNode;
}

export function EditorHeader({ fallbackTitle, descriptionKey, identifier, filterPath, isOverview, onBack, children }: EditorHeaderProps) {
    const title = isOverview
        ? filterPath ? Identifier.toDisplay(filterPath.split("/").pop() || "") : "All"
        : identifier ? new Identifier(identifier).toResourceName() : fallbackTitle;

    const bgColor = hueToHsl(stringToColor(title));

    return (
        <header className="relative shrink-0 overflow-hidden border-b border-zinc-800/50 bg-zinc-900/50">
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 mix-blend-overlay opacity-40 transition-colors duration-500"
                    style={{ backgroundColor: bgColor }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[20px_20px]" />
            </div>

            <div className="relative z-10 flex flex-col justify-end p-8 pb-6">
                <div className="flex items-end justify-between gap-8 relative z-20">
                    <div className="space-y-2">
                        <EditorBreadcrumb
                            rootLabel={fallbackTitle}
                            identifier={identifier}
                            filterPath={filterPath}
                            isOverview={isOverview}
                            onBack={onBack}
                        />
                        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-xl font-minecraft">{title}</h1>
                        <div
                            className="h-px w-24 my-3 transition-colors duration-500"
                            style={{ background: `linear-gradient(90deg, ${bgColor}, transparent)` }}
                        />
                        <p className="text-zinc-300 max-w-2xl line-clamp-1 drop-shadow-md font-light text-sm opacity-90">
                            <Translate content={descriptionKey} />
                        </p>
                    </div>

                    {isOverview && <div className="flex items-center gap-3">{children}</div>}
                </div>
            </div>
        </header>
    );
}
