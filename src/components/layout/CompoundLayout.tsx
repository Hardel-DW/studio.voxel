import type { DictionaryType } from "@/lib/i18n/i18nSercer";
import type { Locale } from "@/lib/i18n/i18nSercer";
import Footer from "./footer";
import Navbar from "./Navbar";

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
