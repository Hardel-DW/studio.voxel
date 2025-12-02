import { useQuery } from "@tanstack/react-query";
import { Identifier } from "@voxelio/breeze";
import { cn } from "@/lib/utils";

const user = "Hardel-DW";
const repo = "voxel.atlas";
const branch = "archives";
const path = `refs/heads/${branch}/items/data.min.json`;
const version = "1.21.11";

const getItems = async () => {
    const response = await fetch(`https://raw.githubusercontent.com/${user}/${repo}/${path}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    return response.json();
};

type Response = Record<string, [number, number, number, number]>;

export default function TextureRenderer(props: { id: string; className?: string }) {
    const processId = Identifier.of(props.id, "item").toString();
    const { data, isLoading, error } = useQuery<Response>({
        queryKey: ["items", version],
        queryFn: getItems
    });

    if (isLoading) {
        return <div className="h-full w-full relative shrink-0 bg-gray-200 animate-pulse rounded-md" />;
    }

    if (error || !data || !(processId in data)) {
        return (
            <div className="h-full w-full relative shrink-0 border-2 border-red-500 rounded-md flex items-center justify-center">
                <img src="/icons/error.svg" alt="Error" width={24} height={24} />
            </div>
        );
    }

    const asset = data[processId];
    const maxSize = Math.max(asset[2], asset[3]);
    const scale = 40 / maxSize;
    return (
        <div className={cn("size-full relative flex items-center justify-center shrink-0", props.className)}>
            <div
                className="atlas absolute pixelated"
                style={{
                    backgroundPosition: `${-asset[0]}px ${-asset[1]}px`,
                    width: `${asset[2]}px`,
                    height: `${asset[3]}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "center"
                }}
            />
        </div>
    );
}
