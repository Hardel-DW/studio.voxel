import { getDictionary, type Locale } from "@/lib/i18n/i18nSercer";
import Footer from "@/components/layout/footer";
export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <div>
            Hello {lang}
            <p>{dictionary.navbar.item.blog}</p>
            <Footer dictionary={dictionary} lang={lang} />
        </div>
    );
}
