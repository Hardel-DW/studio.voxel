export default function SimpleStudio({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full overflow-y-auto">
            <div className="px-8 pt-12 pb-8">{children}</div>
        </div>
    );
}
