import { createFileRoute, Outlet } from "@tanstack/react-router";
import NotFound from "@/components/NotFound";

export const Route = createFileRoute("/$lang")({
    component: LangLayout,
    notFoundComponent: NotFound
});

function LangLayout() {

    return (
        <div className="antialiased">
            <Outlet />
        </div>
    );
}
