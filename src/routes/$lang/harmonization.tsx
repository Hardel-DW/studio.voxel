import { createFileRoute } from '@tanstack/react-router'
import CompoundLayout from '@/components/layout/CompoundLayout'
import ShiningStars from '@/components/ui/ShiningStars'
import Star from '@/components/ui/Star'
import HarmonizeEditor from '@/components/pages/HarmonizeEditor'
import PageLoading from '@/components/loading/PageLoading'
import { useDictionary } from '@/lib/hook/useNext18n'
import type { Locale } from "@/lib/i18n/i18nServer"

export const Route = createFileRoute('/$lang/harmonization')({
    component: HarmonizationPage,
    pendingComponent: PageLoading,
})

function HarmonizationPage() {
    const { lang } = Route.useParams()
    const dictionary = useDictionary()

    return (
        <CompoundLayout dictionary={dictionary} lang={lang as Locale}>
            <div className="fixed inset-0 -z-10">
                <ShiningStars />
            </div>
            <div className="absolute rounded-full w-3/4 h-1/2 bg-linear-to-r from-[#830335] to-[#311e7696] opacity-20 blur-[10rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <section className="mt-32 relative w-3/4 mx-auto">
                <div className="w-full text-center mt-12 mb-12">
                    <h2 className="text-5xl font-bold mb-4">{dictionary.harmonization.title}</h2>
                    <Star />
                </div>

                <div className="mb-12 px-12">
                    <p className="text-zinc-300 tracking-wide">{dictionary.harmonization.description}</p>
                    <p className="text-zinc-400 text-xs mt-2 tracking-wide">{dictionary.harmonization.small}</p>
                </div>

                <HarmonizeEditor />
            </section>
        </CompoundLayout>
    )
}