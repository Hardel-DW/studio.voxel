import type { DictionaryType } from "@/lib/i18n/i18nServer";
import type { Locale } from "@/lib/i18n/i18nServer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CompoundLayout({
    children,
    dictionary,
    lang
}: { children: React.ReactNode; dictionary: DictionaryType; lang: Locale }) {
    return (
        <>
            <Navbar dictionary={dictionary} lang={lang} />
            {children}
            <Footer dictionary={dictionary} lang={lang} />
        </>
    );
}
