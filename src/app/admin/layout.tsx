import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Users, LayoutDashboard } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 pt-16">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                        Admin Panel
                    </h2>
                </div>
                <nav className="space-y-1 px-4">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Overview
                    </Link>
                    <Link
                        href="/admin/reports"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        <ShieldAlert className="h-4 w-4" />
                        Reports
                    </Link>
                    {/* Placeholder for future features */}
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 opacity-50 cursor-not-allowed"
                    >
                        <Users className="h-4 w-4" />
                        Users (Soon)
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
