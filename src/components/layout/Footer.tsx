import { useParams } from "@tanstack/react-router";
import { useDictionary } from "@/lib/hook/useNext18n";

export default function Footer() {
    const { lang } = useParams({ from: "/$lang" });
    const dictionary = useDictionary();
    const basePath = "https://voxel.hardel.io";
    const footerContent = [
        {
            name: dictionary.footer.content.navigation.self,
            links: [
                {
                    title: dictionary.footer.content.navigation.home,
                    path: `${basePath}/${lang}`
                },
                {
                    title: dictionary.footer.content.navigation.datapacks,
                    path: `${basePath}/${lang}/datapacks/neoenchant`
                },
                {
                    title: dictionary.footer.content.navigation.guides,
                    path: `${basePath}/${lang}/soon`
                },
                {
                    title: dictionary.footer.content.navigation.enchantment_tool,
                    path: `/${lang}/studio`
                },
                {
                    title: dictionary.footer.content.navigation.contact,
                    path: `${basePath}/${lang}/contact`
                }
            ]
        },
        {
            name: dictionary.footer.content.other.self,
            links: [
                {
                    title: dictionary.footer.content.other.news,
                    path: `${basePath}/${lang}/blog`
                },
                {
                    title: dictionary.footer.content.other.faq,
                    path: `${basePath}/${lang}`
                },
                {
                    title: dictionary.footer.content.other.about,
                    path: `${basePath}/${lang}/soon`
                }
            ]
        },
        {
            name: dictionary.footer.content.support.self,
            links: [
                {
                    title: dictionary.footer.content.support.help_center,
                    path: `${basePath}/${lang}/contact`
                },
                {
                    title: dictionary.footer.content.support.term_of_service,
                    path: `${basePath}/terms`
                },
                {
                    title: dictionary.footer.content.support.legal,
                    path: `${basePath}/legal`
                },
                {
                    title: dictionary.footer.content.support.privacy,
                    path: `${basePath}/privacy`
                }
            ]
        }
    ];

    const socialLinks = [
        {
            name: dictionary.footer.social.github,
            path: "https://github.com/Hardel-DW",
            icon: "github.svg"
        },
        {
            name: dictionary.footer.social.twitter,
            path: "https://twitter.com/Hardel7401",
            icon: "twitter.svg"
        },
        {
            name: dictionary.footer.social.discord,
            path: "https://discord.gg/8z3tkQhay7",
            icon: "discord.svg"
        }
    ];

    return (
        <footer className="w-full px-4 pb-4 bg-linear-to-b from-transparent to-black/70">
            <div className="max-w-[theme(screens.2xl)] mx-auto border-t border-zinc-900 pt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-6 md:px-20">
                <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
                    <a href={`/${lang}`} className="text-lg flex items-center">
                        <img loading="lazy" src="/icons/logo.svg" alt="Voxel Logo" className="w-6 h-6 brightness-90 mr-2" />
                        <div className="flex">
                            <span className="text-lg text-white font-bold">VOXEL</span>
                            <span className="text-s text-zinc-300 font-semibold">Labs</span>
                        </div>
                    </a>
                    <p className="mt-4 text-sm text-zinc-400 tracking-tight font-light max-w-xs">{dictionary.footer.description}</p>
                    <div className="flex gap-3 mt-4 items-center">
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-zinc-950 hover:bg-zinc-900 rounded-xs w-6 h-6 inline-flex items-center justify-center text-zinc-200"
                                aria-label={item.name}>
                                <img loading="lazy" src={`/icons/company/${item.icon}`} alt="" className="w-8 h-8 invert" />
                                <span className="sr-only">{item.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {footerContent.map((section) => (
                    <div key={section.name}>
                        <h3 className="font-medium text-sm text-zinc-200">{section.name}</h3>
                        <div className="flex flex-col mt-2">
                            {section.links.map((link) => (
                                <a key={link.title} href={link.path || "#"} className="py-1 text-sm text-zinc-400 hover:text-zinc-200">
                                    {link.title}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center text-zinc-400 text-sm">
                <p className="text-sm mt-2 tracking-tight">
                    {dictionary.footer.copyright_left} {new Date().getFullYear()} {dictionary.footer.copyright_right}
                </p>
            </div>
        </footer>
    );
}
