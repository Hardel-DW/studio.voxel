import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/studio/editor/loot/overview")({
    component: RouteComponent
});

function RouteComponent() {
    return <div>Hello "/$lang/studio/editor/loot/overview"!</div>;
}
