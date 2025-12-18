import { createFileRoute, Outlet } from "@tanstack/react-router";
import QueryProvider from "@/components/QueryProvider";
import DebugPanel from "@/components/tools/debug/DebugPanel";
import { FloatingBarProvider } from "@/components/tools/floatingbar/FloatingBarContext";
import ShiningStars from "@/components/ui/ShiningStars";
import { useLocalStorage } from "@/lib/hook/useLocalStorage";

export const Route = createFileRoute("/$lang/studio")({
    component: StudioLayout
});

function StudioLayout() {
    const [disableEffects] = useLocalStorage("studio:disable-effects", false);

    return (
        <div className="flex relative h-dvh">
            <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-3xl bg-linear-to-br from-red-900/20 to-blue-900/20" />
            <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />
            <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-3xl bg-linear-to-br from-purple-900/20 to-red-900/20" />
            <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />


            <div className="-z-10 absolute inset-0 overflow-hidden">
                <svg
                    className="size-full stroke-white/15 [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-2 scale-110"
                    style={{ transform: "skewY(-12deg)" }}>
                    <title>Grid</title>
                    <defs>
                        <pattern id="grid" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                            <path d="M64 0H0V64" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {disableEffects && (
                <div className="fixed inset-0 -z-10">
                    <ShiningStars />
                </div>
            )}

            <QueryProvider>
                <DebugPanel />
                <FloatingBarProvider>
                    <Outlet />
                </FloatingBarProvider>
            </QueryProvider>
        </div>
    );
}
