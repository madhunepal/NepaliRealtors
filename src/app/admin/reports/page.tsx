import { createAdminClient } from "@/lib/supabase/admin";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateReportStatus } from "../actions";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
    const supabase = createAdminClient();

    // Fetch reports with related profile data
    // Note: Supabase JS join syntax is tricky with foreign keys if not explicitly named or if standard join.
    // For MVP, we'll fetch reports and then manually fetch profiles if needed, or rely on a simple join if relations are clear
    // RLS policies are irrelevant here since we use admin client.

    const { data: reports, error } = await supabase
        .from("reports")
        .select(`
            *,
            reporter:reporter_id (full_name, email),
            reported:reported_id (full_name, email)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching reports:", error);
        return <div className="p-4 text-red-600">Failed to load reports.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Content Moderation</h1>

            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Reported User</TableHead>
                            <TableHead>Reporter</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No reports found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports?.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                report.status === "pending"
                                                    ? "outline" // Using outline for pending to match default or create yellow variant later
                                                    : report.status === "resolved"
                                                        ? "default" // default is black/white usually
                                                        : "secondary"
                                            }
                                            className={
                                                report.status === "pending"
                                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                    : report.status === "resolved"
                                                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
                                                        : "bg-zinc-100 text-zinc-500"
                                            }
                                        >
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{report.reason}</TableCell>
                                    <TableCell className="max-w-xs truncate" title={report.details || ""}>
                                        {report.details || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{(report.reported as any)?.full_name || "Unknown"}</span>
                                            <span className="text-xs text-zinc-500">{(report.reported as any)?.email}</span>
                                            <Link href={`/pro/${report.reported_id}`} className="text-xs text-blue-600 hover:underline">
                                                View Profile
                                            </Link>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{(report.reporter as any)?.full_name || "Unknown"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-500">
                                        {new Date(report.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {report.status === "pending" && (
                                            <div className="flex justify-end gap-2">
                                                <form
                                                    action={async () => {
                                                        "use server";
                                                        await updateReportStatus(report.id, "dismissed");
                                                    }}
                                                >
                                                    <Button variant="ghost" size="icon" title="Dismiss">
                                                        <XCircle className="h-4 w-4 text-zinc-500 hover:text-red-600" />
                                                    </Button>
                                                </form>
                                                <form
                                                    action={async () => {
                                                        "use server";
                                                        await updateReportStatus(report.id, "resolved");
                                                    }}
                                                >
                                                    <Button variant="ghost" size="icon" title="Resolve">
                                                        <CheckCircle className="h-4 w-4 text-zinc-500 hover:text-green-600" />
                                                    </Button>
                                                </form>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
