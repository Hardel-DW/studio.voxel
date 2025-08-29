import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DictionaryProvider } from "@/components/layout/DictionaryProvider";
import { getDictionary, type Locale } from "@/lib/i18n/i18nServer";

export const Route = createFileRoute("/$lang")({
    component: LangLayout,
    loader: async ({ params }) => {
        const dictionary = await getDictionary(params.lang as Locale);
        return { dictionary };
    }
});

function LangLayout() {
    const { dictionary } = Route.useLoaderData();

    return (
        <div className="antialiased">
            <DictionaryProvider dictionary={dictionary}>
                <Outlet />
            </DictionaryProvider>
        </div>
    );
}
