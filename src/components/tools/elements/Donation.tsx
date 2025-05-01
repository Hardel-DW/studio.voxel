import Button from "@/components/ui/Button";
import type { ToolDonationType } from "@voxelio/breeze/core";
import Translate from "@/components/tools/Translate";

export default function Donation({ component }: { component: ToolDonationType }) {
    return (
        <div className="bg-black/50 border-t-2 border-l-2 rounded-2xl border-stone-900 ring-0 ring-zinc-800 overflow-hidden backdrop-blur-2xl mt-auto relative">
            <img className="absolute -top-24 -right-24 size-96 opacity-20" src={component.icon} alt="Voxel Labs" />

            <div className="flex flex-col justify-between h-full p-8 pl-12">
                <div>
                    <h1 className="text-white text-3xl tracking-wide font-semibold">
                        <Translate content={component.title} schema={true} />
                    </h1>
                    <p className="text-zinc-400 text-sm pt-2 w-full lg:w-3/4">
                        <Translate content={component.description} schema={true} />
                    </p>
                </div>
                <div className="xl:flex justify-between gap-4 mt-4">
                    <div>
                        <h3 className="text-white font-bold text-xl pb-4 pt-6">
                            <Translate content={component.subTitle} schema={true} />
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-8 items-center *:flex *:items-center *:gap-2 gap-y-4">
                            {component.extra.map((item, index) => (
                                <li key={index.toString()}>
                                    <img src="/icons/check.svg" alt="check" className="w-4 h-4 invert" />
                                    <span className="text-zinc-300 text-sm font-semibold">
                                        <Translate content={item} schema={true} />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex lg:flex-row flex-col lg:flex-none self-end relative z-10 gap-4 pt-8">
                        <Button
                            className="w-full flex-1 px-8"
                            target="_blank"
                            rel="noreferrer"
                            href={component.tipText.link}
                            variant="white-shimmer">
                            <Translate content={component.tipText.text} schema={true} />
                        </Button>
                        <Button
                            className="w-full flex-1 px-8"
                            variant="patreon-shimmer"
                            href={component.patreon.link}
                            target="_blank"
                            rel="noreferrer">
                            <img src="/icons/company/patreon.svg" alt="Patreon" className="w-4 h-4" />
                            <Translate content={component.patreon.text} schema={true} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 -z-10 hue-rotate-90 brightness-15">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
