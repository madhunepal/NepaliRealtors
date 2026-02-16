"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // 1. Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role, // Metadata for triggers if needed
                },
            },
        });

        if (authError) {
            setMessage({ type: "error", text: authError.message });
            setLoading(false);
            return;
        }

        if (authData.user) {
            // Profile is created via Postgres Trigger
            setMessage({ type: "success", text: "Account created! Redirecting..." });

            if (role === 'customer') {
                router.push('/dashboard');
            } else {
                router.push('/onboarding');
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black px-6 pt-20">
            <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create an Account</h1>

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

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                            placeholder="John Doe"
                        />
                    </div>
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
                            required
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                            placeholder="********"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">I am a...</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                        >
                            <option value="customer">Customer (Looking for pros)</option>
                            <option value="realtor">Realtor</option>
                            <option value="loan_officer">Loan Officer</option>
                            <option value="inspector">Inspector</option>
                            <option value="builder">Builder</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign Up"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-red-600 hover:text-red-500">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
