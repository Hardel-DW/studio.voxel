import { useEffect, useState } from "react";

export default function ButtonDownload(props: { snippet: string }) {
    const [pending, setPending] = useState<boolean>(false);

    const download = () => {
        const element = document.createElement("a");
        const file = new Blob([props.snippet], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "snippet.json";
        document.body.appendChild(element);
        element.click();
        setPending(true);
    };

    useEffect(() => {
        if (pending) {
            setTimeout(() => setPending(false), 3000);
        }
    }, [pending]);

    return (
        <div
            className={
                "w-12 h-12 p-2 hover:bg-zinc-800/50  cursor-pointer transition bg-black/10 border border-white/10 rounded-md flex justify-center items-center"
            }>
            {pending ? (
                <img className="invert" alt="checked" src="/icons/check.svg" width={24} height={24} />
            ) : (
                <img
                    onKeyDown={download}
                    onClick={download}
                    className="invert"
                    alt="download"
                    src="/icons/download.svg"
                    width={24}
                    height={24}
                />
            )}
        </div>
    );
}
