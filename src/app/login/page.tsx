"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage({ type: "error", text: error.message });
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    const handleMagicLink = async () => {
        if (!email) {
            setMessage({ type: "error", text: "Please enter your email first." });
            return;
        }
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback?next=/dashboard`,
            },
        });

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setMessage({ type: "success", text: "Check your email for the magic link!" });
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black px-6">
            <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sign In</h1>

                {message && (
                    <div
                        className={`mb-4 rounded p-3 text-sm ${message.type === "error"
                                ? "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400"
                                : "bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                            placeholder="********"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
                    </button>
                </form>

                <div className="mt-4 flex flex-col gap-3">
                    <button
                        onClick={handleMagicLink}
                        disabled={loading}
                        className="w-full text-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:underline"
                    >
                        Or sign in with Magic Link
                    </button>

                    <div className="text-center text-sm text-zinc-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-semibold text-red-600 hover:text-red-500">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
