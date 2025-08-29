import QueryProvider from "@/components/QueryProvider";
import ShiningStars from "@/components/ui/ShiningStars";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface StudioLayoutProps {
    children: React.ReactNode;
}

export default function StudioLayout({ children }: StudioLayoutProps) {
    return (
        <div className="flex relative md:p-4 h-dvh">
            <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-[10rem] bg-gradient-to-br from-red-900/20 to-blue-900/20" />
            <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-[4rem] bg-gradient-to-br from-pink-900/20 to-blue-900/20" />
            <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-[10rem] bg-gradient-to-br from-purple-900/20 to-red-900/20" />
            <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-[4rem] bg-gradient-to-br from-pink-900/20 to-blue-900/20" />

            <div className="fixed inset-0 -z-10">
                <ShiningStars />
            </div>

            <QueryProvider>
                <ReactQueryDevtools />
                {children}
            </QueryProvider>
        </div>
    );
}