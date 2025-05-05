import Button from "@/components/ui/Button";
import type { DictionaryType, Locale } from "@/lib/i18n/i18nServer";
import Link from "next/link";
import type React from "react";
import HeroCard from "./navbar/HeroCard";
import ListItem from "./navbar/ListItem";
import NavbarScrollFade from "./navbar/NavbarScrollFade";
import Navigation from "./navbar/Navigation";
import NavigationDropdown from "./navbar/NavigationDropdown";
import NavigationList from "./navbar/NavigationList";
import Internalization from "./navbar/internalization";

interface Props {
    dictionary: DictionaryType;
    lang: Locale;
    className?: string;
}

export default function Navbar({ dictionary, lang }: Props) {
    const links = [
        { name: dictionary.navbar.item.blog, href: `/${lang}/blog` },
        { name: dictionary.navbar.item.data_pack, href: `/${lang}/datapacks/neoenchant` },
        { name: dictionary.navbar.item.resources, href: `/${lang}/soon` },
        { name: dictionary.navbar.item.contact, href: `/${lang}/contact` }
    ];

    return (
        <header id="header" aria-expanded="false" className="mt-8 fixed left-0 right-0 z-50 group">
            <NavbarScrollFade>
                <div className="flex items-center gap-4 pl-2">
                    <Link href={`/${lang}`} className="flex items-center gap-x-4">
                        <img src="/icons/logo.svg" alt="Voxel Logo" className="w-6 h-6 brightness-90 mx-2" />
                        <div className="flex">
                            <span className="text-lg text-white font-bold">VOXEL</span>
                            <span className="text-s text-zinc-300 font-semibold">Labs</span>
                        </div>
                    </Link>

                    <div className="hidden md:block">
                        <Navigation>
                            <NavigationList>
                                <li>
                                    <Link
                                        href={`/${lang}/blog`}
                                        className="px-4 py-2 rounded-3xl cursor-pointer text-[16px] tracking-wide transition text-zinc-400 hover:text-white inline-flex h-10 w-max items-center justify-center bg-transparent hover:bg-zinc-900 focus:bg-zinc-700 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                        {dictionary.navbar.item.blog}
                                    </Link>
                                </li>

                                <NavigationDropdown label={dictionary.navbar.item.data_pack}>
                                    <div className="p-6 space-y-6 md:w-[400px] lg:w-[500px]">
                                        <HeroCard
                                            title={dictionary.navbar.datapack.modrinth.title}
                                            description={dictionary.navbar.datapack.modrinth.description}
                                            image="/images/background/modrinth.webp"
                                            href="https://modrinth.com/user/Hardel-DW"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                        <ul className="grid gap-3 mt-3">
                                            <ListItem
                                                href={`/${lang}/datapacks/neoenchant`}
                                                title={dictionary.navbar.datapack.neoenchant.title}
                                                image="/images/features/title/ne.png">
                                                {dictionary.navbar.datapack.neoenchant.description}
                                            </ListItem>
                                            <ListItem
                                                href={`/${lang}/datapacks/yggdrasil`}
                                                title={dictionary.navbar.datapack.yggdrasil.title}
                                                image="/images/features/title/yg.webp">
                                                {dictionary.navbar.datapack.yggdrasil.description}
                                            </ListItem>
                                        </ul>
                                    </div>
                                </NavigationDropdown>

                                <NavigationDropdown label={dictionary.navbar.item.resources}>
                                    <div className="p-6 md:w-[400px] lg:w-[500px]">
                                        <HeroCard
                                            href={`/${lang}/tools/studio`}
                                            title={dictionary.navbar.resources.tool.enchant.title}
                                            description={dictionary.navbar.resources.tool.enchant.description}
                                            image="/images/background/tools/enchant-configurator.webp"
                                        />
                                        <ul className="grid gap-3 mt-3 lg:grid-cols-[.75fr_1fr]">
                                            <ListItem
                                                href={`/${lang}/tools/harmonization`}
                                                title={dictionary.navbar.resources.harmonization.title}>
                                                {dictionary.navbar.resources.harmonization.description}
                                            </ListItem>
                                            <ListItem href={`/${lang}/resources/asset`} title={dictionary.navbar.resources.asset.title}>
                                                {dictionary.navbar.resources.asset.description}
                                            </ListItem>
                                            <ListItem href={`/${lang}/tools/converter`} title={dictionary.navbar.resources.converter.title}>
                                                {dictionary.navbar.resources.converter.description}
                                            </ListItem>
                                            <ListItem href={`/${lang}/tools/migration`} title={dictionary.navbar.resources.migration.title}>
                                                {dictionary.navbar.resources.migration.description}
                                            </ListItem>
                                        </ul>
                                    </div>
                                </NavigationDropdown>

                                <li>
                                    <Link
                                        href={`/${lang}/contact`}
                                        className="px-4 py-2 rounded-3xl cursor-pointer text-[16px] tracking-wide transition text-zinc-400 hover:text-white inline-flex h-10 w-max items-center justify-center bg-transparent hover:bg-zinc-900 focus:bg-zinc-700 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                        {dictionary.navbar.item.contact}
                                    </Link>
                                </li>
                            </NavigationList>
                        </Navigation>
                    </div>
                </div>

                <div>
                    <div className="hidden lg:flex items-center gap-2 px-4">
                        <Internalization />
                        <a href="https://x.com/VoxelioStudio" target="_blank" rel="noopener noreferrer" aria-label="Visit our X profile">
                            <img
                                src="/icons/company/x.svg"
                                alt=""
                                className="w-6 h-6 invert mx-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear"
                            />
                        </a>
                        <a
                            href="https://bsky.app/profile/voxelstudio.bsky.social"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit our Bluesky profile">
                            <img
                                src="/icons/company/bluesky.svg"
                                alt=""
                                className="w-6 h-6 invert mx-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear"
                            />
                        </a>
                        <a
                            href="https://discord.gg/TAmVFvkHep"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Join our Discord server">
                            <img
                                src="/icons/company/discord.svg"
                                alt=""
                                className="w-6 h-6 invert mx-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear"
                            />
                        </a>
                    </div>

                    <div className="lg:hidden inline-block">
                        <Button size="icon" variant="link" rounded="full" aria-label="Menu" id="menu">
                            <img src="/icons/menu.svg" alt="" className="w-6 h-6 invert" />
                        </Button>
                    </div>
                </div>
            </NavbarScrollFade>

            <nav className="flex md:hidden mt-2 shadow-zinc-800/20 shadow-2xl border-zinc-800 border-t border-l bg-header-translucent flex-col gap-2 rounded-3xl backdrop-blur-md p-2 mx-auto w-11/12 md:w-3/4">
                <div className="size-full flex flex-col gap-y-2">
                    <div className="py-2">
                        {links.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-3xl px-4 py-3 leading-none flex justify-between transition-colors text-zinc-400 hover:bg-zinc-700/10 hover:text-white">
                                <span>{item.name}</span>
                                <img src="/icons/chevron-right.svg" alt="" className="w-4 h-4 invert" />
                            </Link>
                        ))}
                    </div>
                    <div className="mb-4 flex justify-center gap-x-4 sm:gap-x-8 pt-2 border-t border-zinc-700/50">
                        <a href="https://x.com/VoxelioStudio" target="_blank" rel="noopener noreferrer" aria-label="Visit our X profile">
                            <img
                                src="/icons/company/x.svg"
                                alt=""
                                className="w-6 h-6 invert mx-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear"
                            />
                        </a>
                        <a
                            href="https://bsky.app/profile/voxelstudio.bsky.social"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit our Bluesky profile">
                            <img
                                src="/icons/company/bluesky.svg"
                                alt=""
                                className="w-6 h-6 invert mx-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear"
                            />
                        </a>
                        <a
                            href="https://discord.gg/TAmVFvkHep"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Join our Discord server">
                            <img
                                src="/icons/company/discord.svg"
                                alt=""
                                className="w-6 h-6 invert mx-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear"
                            />
                        </a>
                    </div>
                    <div className="flex justify-center pb-2">
                        <Internalization />
                    </div>
                </div>
            </nav>
        </header>
    );
}
