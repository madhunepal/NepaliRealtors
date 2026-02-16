import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <Link href="/directory" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
                        Find a Pro
                    </Link>
                    <Link href="/signup" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
                        Join as Pro
                    </Link>
                    <Link href="/login" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
                        Log in
                    </Link>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-zinc-500">
                        &copy; {new Date().getFullYear()} MeroGharInUSA.
                    </p>
                    <div className="mt-2 flex justify-center space-x-4 text-xs text-zinc-400">
                        <Link href="/privacy" className="hover:text-zinc-500">Privacy</Link>
                        <Link href="/terms" className="hover:text-zinc-500">Terms</Link>
                        <Link href="/disclaimer" className="hover:text-zinc-500">Disclaimer</Link>
                        <Link href="/report" className="hover:text-zinc-500">Report Issue</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
