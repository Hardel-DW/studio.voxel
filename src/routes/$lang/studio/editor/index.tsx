import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/tools/concept/home/HomePage";

export const Route = createFileRoute("/$lang/studio/editor/")({
    component: EditorHomepage
});

function EditorHomepage() {
    return <HomePage />;
}
