import { Link, useParams } from "@tanstack/react-router";
import StudioSidebar from "@/components/tools/sidebar/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { lang } = useParams({ from: "/$lang" });

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-editor">
            <aside className="shrink-0 w-16 flex flex-col">
                <div className="h-16 flex items-center justify-center">
                    <Link to="/$lang/studio" params={{ lang }} className="hover:opacity-80 transition-opacity">
                        <img src="/icons/logo.svg" alt="Voxel" className="size-5" />
                    </Link>
                </div>
                <StudioSidebar />
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 relative min-h-0 h-full ml-0 bg-content overflow-hidden border-t border-l border-zinc-900 rounded-tl-3xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
