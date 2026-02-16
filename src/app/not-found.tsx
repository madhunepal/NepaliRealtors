import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-black">
            <h1 className="text-9xl font-black text-zinc-200 dark:text-zinc-800">404</h1>
            <div className="absolute flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Page not found</h2>
                <p className="max-w-md text-zinc-600 dark:text-zinc-400">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>
                <div className="flex gap-4">
                    <Button asChild variant="outline">
                        <Link href="/">
                            <MoveLeft className="mr-2 h-4 w-4" />
                            Back Home
                        </Link>
                    </Button>
                    <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                        <Link href="/directory">Browse Professionals</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
