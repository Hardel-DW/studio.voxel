import { Link, useParams } from "@tanstack/react-router";
import { t } from "@/lib/i18n/i18n";

const baseVoxelPath = import.meta.env.VITE_BASE_VOXEL_PATH;
export default function Footer() {
    const { lang } = useParams({ from: "/$lang" });
    const translate = t(lang);
    const footerContent = [
        {
            name: translate("footer.content.navigation.self"),
            links: [
                {
                    title: translate("footer.content.navigation.home"),
                    to: "/$lang"
                },
                {
                    title: translate("footer.content.navigation.datapacks"),
                    href: `${baseVoxelPath}/${lang}/packs/neoenchant`
                },
                {
                    title: translate("footer.content.navigation.contact"),
                    href: `${baseVoxelPath}/${lang}/contact`
                }
            ]
        },
        {
            name: translate("footer.content.other.self"),
            links: [
                {
                    title: translate("footer.content.other.news"),
                    href: `${baseVoxelPath}/${lang}/blog`
                },
                {
                    title: translate("footer.content.other.faq"),
                    href: `${baseVoxelPath}/${lang}`
                },
                {
                    title: translate("footer.content.other.about"),
                    href: `${baseVoxelPath}/${lang}/soon`
                }
            ]
        },
        {
            name: translate("footer.content.support.self"),
            links: [
                {
                    title: translate("footer.content.support.help_center"),
                    href: `${baseVoxelPath}/${lang}/contact`
                },
                {
                    title: translate("footer.content.support.term_of_service"),
                    href: `${baseVoxelPath}/${lang}/terms`
                },
                {
                    title: translate("footer.content.support.legal"),
                    href: `${baseVoxelPath}/${lang}/legal`
                },
                {
                    title: translate("footer.content.support.privacy"),
                    href: `${baseVoxelPath}/${lang}/privacy`
                }
            ]
        },
        {
            name: translate("footer.content.voxel_studio"),
            links: [
                {
                    title: translate("footer.content.voxel_studio.studio"),
                    to: "/$lang/studio"
                },
                {
                    title: translate("footer.content.voxel_studio.harmonization"),
                    to: "/$lang/harmonization"
                },
                {
                    title: translate("footer.content.voxel_studio.converter"),
                    to: "/$lang/converter"
                },
                {
                    title: translate("footer.content.voxel_studio.migration"),
                    to: "/$lang/migration"
                }
            ]
        }
    ];

    const socialLinks = [
        {
            name: translate("footer.social.github"),
            path: "https://github.com/Hardel-DW",
            icon: "github.svg"
        },
        {
            name: translate("footer.social.twitter"),
            path: "https://x.com/Hardel7401",
            icon: "x.svg"
        },
        {
            name: translate("footer.social.discord"),
            path: "https://discord.gg/TAmVFvkHep",
            icon: "discord.svg"
        }
    ];

    return (
        <footer className="w-full px-4 pb-4 bg-linear-to-b from-transparent to-black/70">
            <div className="max-w-(--breakpoint-2xl) mx-auto border-t border-zinc-900 pt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-6 md:px-20">
                <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
                    <Link to="/$lang" params={{ lang }} className="text-lg flex items-center">
                        <img loading="lazy" src="/icons/logo.svg" alt="Voxel Logo" className="w-6 h-6 brightness-90 mr-2" />
                        <div className="flex">
                            <span className="text-lg text-white font-bold">VOXEL</span>
                            <span className="text-s text-zinc-300 font-semibold">Labs</span>
                        </div>
                    </Link>
                    <p className="mt-4 text-sm text-zinc-400 tracking-tight font-light max-w-xs">{translate("footer.description")}</p>
                    <div className="flex gap-3 mt-4 items-center">
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-zinc-950 hover:bg-zinc-900 rounded-xs w-6 h-6 inline-flex items-center justify-center text-zinc-200"
                                aria-label={item.name}>
                                <img loading="lazy" src={`/icons/company/${item.icon}`} alt={item.name} className="w-8 h-8 invert" />
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
                                <FooterLink key={link.title} {...link} lang={lang} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center text-zinc-400 text-sm">
                <p className="text-sm mt-2 tracking-tight">
                    {translate("footer.copyright_left")} {new Date().getFullYear()} {translate("footer.copyright_right")}
                </p>
            </div>
        </footer>
    );
}

const FooterLink = ({ title, href, lang, to }: { title: string; href?: string; lang: string; to?: string }) => {
    if (to) {
        return (
            <Link to={to} params={{ lang }} className="py-1 text-sm text-zinc-400 hover:text-zinc-200">
                {title}
            </Link>
        );
    }

    return (
        <a href={href} className="py-1 text-sm text-zinc-400 hover:text-zinc-200">
            {title}
        </a>
    );
};
