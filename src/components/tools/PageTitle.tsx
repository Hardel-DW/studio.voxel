import { usePageTitle } from "@/lib/hook/usePageTitle";

export default function PageTitle() {
    const title = usePageTitle();

    return <h1 className="text-sm text-zinc-400 truncate">{title}</h1>;
}
