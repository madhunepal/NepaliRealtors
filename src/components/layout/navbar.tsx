import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogOut } from "lucide-react";

export async function Navbar() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let userWidthName = null;
    if (user) {
        const { data } = await supabase.from("profiles").select("full_name, slug, role").eq("id", user.id).single();
        userWidthName = data;
    }

    return (
        <nav className="absolute top-0 z-50 w-full border-b border-white/10 bg-white/50 backdrop-blur-md dark:border-white/5 dark:bg-black/50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-xl font-bold text-red-600">
                    MeroGharInUSA
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/directory" className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-50">
                        Find a Pro
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            {userWidthName?.role === "admin" && (
                                <Link
                                    href="/admin"
                                    className="text-sm font-semibold text-red-600 hover:text-red-500"
                                >
                                    Admin
                                </Link>
                            )}
                            <Link
                                href="/dashboard"
                                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
                            >
                                Dashboard
                            </Link>
                            <Link href="/dashboard/messages" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors">
                                Messages
                            </Link>
                            <Link href={userWidthName?.slug ? `/pro/${userWidthName.slug}` : "/dashboard/profile"} className="hidden md:block text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors">
                                {userWidthName?.full_name || "User"}
                            </Link>
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-red-600 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-50">
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
