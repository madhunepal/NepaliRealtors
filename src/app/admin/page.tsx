import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const supabase = createAdminClient();

    // Fetch stats
    let reportCount = 0;
    let userCount = 0;

    try {
        const { count: reports, error: reportError } = await supabase
            .from("reports")
            .select("*", { count: 'exact', head: true })
            .eq("status", "pending");

        if (reportError) console.error("Admin Dashboard: Report Fetch Error", reportError);
        reportCount = reports || 0;

        const { count: users, error: userError } = await supabase
            .from("profiles")
            .select("*", { count: 'exact', head: true });

        if (userError) console.error("Admin Dashboard: User Fetch Error", userError);
        userCount = users || 0;
    } catch (err) {
        console.error("Admin Dashboard Unexpected Error:", err);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{reportCount || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{userCount || 0}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
