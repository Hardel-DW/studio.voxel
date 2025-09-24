import { useQuery } from "@tanstack/react-query";
import { Identifier } from "@voxelio/breeze";
import { cn } from "@/lib/utils";

const user = "Hardel-DW";
const repo = "voxel.atlas";
const path = "refs/heads/main/atlas/1.21.9/data.min.json";

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
        queryKey: ["items", "1.21.9"],
        queryFn: getItems
    });

    if (isLoading) {
        return <div className="h-10 w-10 relative shrink-0 bg-gray-200 animate-pulse rounded-md" />;
    }

    if (error || !data || !(processId in data)) {
        return (
            <div className="h-10 w-10 relative shrink-0 border-2 border-red-500 rounded-md flex items-center justify-center">
                <img src="/icons/error.svg" alt="Error" width={24} height={24} />
            </div>
        );
    }

    const asset = data[processId];
    return (
        <div className={cn("h-10 w-10 relative shrink-0", props.className)}>
            <div
                className="atlas absolute inset-0 pixelated"
                style={{
                    backgroundPosition: `${-asset[0]}px ${-asset[1]}px`,
                    width: `${asset[2]}px`,
                    height: `${asset[3]}px`,
                    transform: `scale(${40 / asset[2]})`,
                    transformOrigin: "top left"
                }}
            />
        </div>
    );
}
