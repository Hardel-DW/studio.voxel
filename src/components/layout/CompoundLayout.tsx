import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar.tsx";
import type { DictionaryType, Locale } from "@/lib/i18n/i18nServer";

export default function CompoundLayout({
    children,
    dictionary,
    lang
}: {
    children: React.ReactNode;
    dictionary: DictionaryType;
    lang: Locale;
}) {
    return (
        <>
            <Navbar dictionary={dictionary} lang={lang} />
            {children}
            <Footer dictionary={dictionary} lang={lang} />
        </>
    );
}
