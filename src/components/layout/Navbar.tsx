import { Link, useParams } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";
import { useDictionary } from "@/lib/hook/useNext18n";
import HeroCard from "./navbar/HeroCard";
import Internalization from "./navbar/internalization";
import ListItem from "./navbar/ListItem";
import MobileMenuButton from "./navbar/MobileMenuButton";
import MobileNavigationContainer from "./navbar/MobileNavigationContainer";
import NavbarScrollFade from "./navbar/NavbarScrollFade";
import Navigation from "./navbar/Navigation";
import NavigationDropdown from "./navbar/NavigationDropdown";
import NavigationList from "./navbar/NavigationList";

const baseVoxelPath = "https://voxel.hardel.io";

export default function Navbar() {
    const { lang } = useParams({ from: "/$lang" });
    const dictionary = useDictionary();
    const { isAuthenticated, user, logout } = useGitHubAuth();

    const links = [
        { name: dictionary.navbar.item.blog, href: `${baseVoxelPath}/${lang}/blog` },
        { name: dictionary.navbar.item.data_pack, href: `${baseVoxelPath}/${lang}/datapacks/neoenchant` },
        { name: dictionary.navbar.item.resources, href: `${baseVoxelPath}/${lang}/soon` },
        { name: dictionary.navbar.item.contact, href: `${baseVoxelPath}/${lang}/contact` }
    ];

    const socials = [
        { name: "x", href: "https://x.com/VoxelioStudio", label: "Visit our X profile" },
        { name: "bluesky", href: "https://bsky.app/profile/voxelstudio.bsky.social", label: "Visit our Bluesky profile" },
        { name: "discord", href: "https://discord.gg/TAmVFvkHep", label: "Join our Discord server" }
    ];

    return (
        <header id="header" className="mt-8 fixed left-0 right-0 z-50 group">
            <NavbarScrollFade>
                <div className="flex items-center gap-4 pl-2">
                    <Link to="/$lang" params={{ lang }} className="flex items-center gap-x-4">
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
                                    <a
                                        href={`${baseVoxelPath}/${lang}/blog`}
                                        className="px-4 py-2 rounded-3xl cursor-pointer text-[16px] tracking-wide transition text-zinc-400 hover:text-white inline-flex h-10 w-max items-center justify-center bg-transparent hover:bg-zinc-900 focus:bg-zinc-700 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                        {dictionary.navbar.item.blog}
                                    </a>
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
                                                href={`${baseVoxelPath}/${lang}/datapacks/neoenchant`}
                                                title={dictionary.navbar.datapack.neoenchant.title}
                                                image="/images/features/title/ne.png">
                                                {dictionary.navbar.datapack.neoenchant.description}
                                            </ListItem>
                                            <ListItem
                                                href={`${baseVoxelPath}/${lang}/datapacks/yggdrasil`}
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
                                            href={`/${lang}/studio`}
                                            title={dictionary.navbar.resources.studio.title}
                                            description={dictionary.navbar.resources.studio.description}
                                            image="/images/background/tools/configurator.webp"
                                        />
                                        <ul className="grid gap-3 mt-3 lg:grid-cols-[.75fr_1fr]">
                                            <ListItem
                                                href={`/${lang}/harmonization`}
                                                title={dictionary.navbar.resources.harmonization.title}>
                                                {dictionary.navbar.resources.harmonization.description}
                                            </ListItem>
                                            <ListItem
                                                href={`${baseVoxelPath}/${lang}/resources/asset`}
                                                title={dictionary.navbar.resources.asset.title}>
                                                {dictionary.navbar.resources.asset.description}
                                            </ListItem>
                                            <ListItem href={`/${lang}/converter`} title={dictionary.navbar.resources.converter.title}>
                                                {dictionary.navbar.resources.converter.description}
                                            </ListItem>
                                            <ListItem href={`/${lang}/migration`} title={dictionary.navbar.resources.migration.title}>
                                                {dictionary.navbar.resources.migration.description}
                                            </ListItem>
                                        </ul>
                                    </div>
                                </NavigationDropdown>

                                <li>
                                    <a
                                        href={`${baseVoxelPath}/${lang}/contact`}
                                        className="px-4 py-2 rounded-3xl cursor-pointer text-[16px] tracking-wide transition text-zinc-400 hover:text-white inline-flex h-10 w-max items-center justify-center bg-transparent hover:bg-zinc-900 focus:bg-zinc-700 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                        {dictionary.navbar.item.contact}
                                    </a>
                                </li>
                            </NavigationList>
                        </Navigation>
                    </div>
                </div>

                <div>
                    <div className="hidden lg:flex items-center gap-2 px-4">
                        <Internalization />
                        {isAuthenticated && user ? (
                            <Popover>
                                <PopoverTrigger>
                                    <button type="button" className="mx-1 select-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear">
                                        <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-3 overflow-hidden relative">
                                    <div className="absolute -top-8 -right-8 w-16 h-16 bg-purple-400/25 rounded-full blur-2xl" />
                                    <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-purple-400/35 rounded-full blur-2xl" />
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-200 truncate">{user.login}</p>
                                                <p className="text-xs text-zinc-400 truncate">ID: {user.id}</p>
                                            </div>
                                        </div>
                                        <div className="border-t border-zinc-800 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => logout()}
                                                className="w-full px-3 py-2 cursor-pointer text-sm text-zinc-200 hover:bg-zinc-700/20 rounded-lg transition-colors flex items-center justify-between">
                                                {dictionary.navbar.logout}
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div className="flex items-center gap-2">
                                {socials.map((social) => (
                                    <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                        <img src={`/icons/company/${social.name}.svg`} alt="" className="w-6 h-6 invert mx-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:hidden inline-block">
                        <MobileMenuButton />
                    </div>
                </div>
            </NavbarScrollFade>

            <MobileNavigationContainer>
                <div className="size-full flex flex-col gap-y-2">
                    <div className="py-2">
                        {links.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-3xl px-4 py-3 leading-none flex justify-between transition-colors text-zinc-400 hover:bg-zinc-700/10 hover:text-white">
                                <span>{item.name}</span>
                                <img src="/icons/chevron-right.svg" alt="" className="w-4 h-4 invert" />
                            </a>
                        ))}
                    </div>
                    <div className="mb-4 flex justify-center gap-x-4 sm:gap-x-8 pt-2 border-t border-zinc-700/50">
                        {socials.map((social) => (
                            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                <img
                                    src={`/icons/company/${social.name}.svg`}
                                    alt=""
                                    className="w-6 h-6 invert mx-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-150 ease-linear"
                                />
                            </a>
                        ))}
                    </div>
                    <div className="flex justify-center pb-2">
                        <Internalization />
                    </div>
                </div>
            </MobileNavigationContainer>
        </header>
    );
}
