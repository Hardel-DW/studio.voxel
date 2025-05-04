export default function GridPattern() {
    return (
        <svg className="absolute -z-10 bg-black/20 size-full stroke-zinc-300/10" aria-hidden="true">
            <defs>
                <pattern id="grids" width="200" height="200" x="100%" y="-1" patternUnits="userSpaceOnUse">
                    <path d="M130 200V.5M.5 .5H200" fill="none" />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                strokeWidth="0"
                fill="url(#grids)"
                style={{ maskImage: "radial-gradient(100% 100% at top right, #fffb, #fff4)" }}
            />
        </svg>
    );
}
