import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <nav className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-red-600">
                        MeroGhar
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {profile?.full_name} ({profile?.role})
                        </span>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                            >
                                <LogOut className="h-4 w-4" /> Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-10">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Welcome back, {profile?.full_name}!
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Directory */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Browse Directory</h3>
                        <p className="mt-2 text-sm text-zinc-500">Find professionals near you.</p>
                        <Link
                            href="/directory"
                            className="mt-4 block w-full rounded-md bg-zinc-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
                        >
                            Go to Directory
                        </Link>
                    </div>

                    {/* Card 2: Messages (Placeholder) */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Messages</h3>
                        <p className="mt-2 text-sm text-zinc-500">Check your inbox for inquiries.</p>
                        <Link
                            href="/dashboard/messages"
                            className="mt-4 block w-full rounded-md bg-white border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
                        >
                            Go to Messages
                        </Link>
                    </div>

                    {/* Card 3: Profile (if Pro) */}
                    {profile?.role !== "customer" && (
                        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">My Profile</h3>
                            <p className="mt-2 text-sm text-zinc-500">Edit your public profile and settings.</p>
                            <Link
                                href={`/pro/${profile?.slug || "edit"}`}
                                className="mt-4 block w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                            >
                                View Profile
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
