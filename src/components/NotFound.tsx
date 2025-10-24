export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-white">404</h1>
                <p className="text-xl text-zinc-400">Page not found</p>
                <a href="/" className="inline-block px-6 py-3 bg-rose-700 hover:bg-rose-600 text-white rounded-lg transition">
                    Go Home
                </a>
            </div>
        </div>
    );
}
