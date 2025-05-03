import Footer from "@/components/layout/footer";
import { type Locale, getDictionary } from "@/lib/i18n/i18nSercer";
export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <div>
            <Footer dictionary={dictionary} lang={lang} />
        </div>
    );
}
