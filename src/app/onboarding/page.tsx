"use client";

import { completeOnboarding } from "./actions";
import { useActionState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { US_STATES } from "@/lib/data";

const initialState = {
    error: null as string | object | null,
};

export default function OnboardingPage() {
    const [state, formAction, isPending] = useActionState(completeOnboarding, initialState);

    // Disclaimer for MVP: Image upload is visual only for now until Storage is connected
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Complete Your Profile
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Tell us more about your services to get verified.
                    </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <form action={formAction} className="space-y-6">

                        {/* Profile Picture Placeholder */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Profile Photo
                            </label>
                            <div className="mt-2 flex items-center gap-x-3">
                                <div className="h-16 w-16 overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="photo-upload"
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700"
                                >
                                    Change
                                    <input
                                        id="photo-upload"
                                        name="photo"
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            <p className="mt-2 text-xs text-zinc-500">
                                *Photo upload not fully connected in MVP yet.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="fullName" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="bio" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    Bio / About
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                                        placeholder="Tell clients about your experience..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    City
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    State
                                </label>
                                <div className="mt-2">


                                    <select
                                        name="state"
                                        id="state"
                                        required
                                        defaultValue=""
                                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                                    >
                                        <option value="" disabled>Select a State</option>
                                        {US_STATES.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="licenseNumber" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    License Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        id="licenseNumber"
                                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    Phone Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="website" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    Website URL
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="url"
                                        name="website"
                                        id="website"
                                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Profile"}
                            </button>
                        </div>
                        {state?.error && (
                            <div className="text-sm text-red-600">
                                {typeof state.error === 'string' ? state.error : 'Please check the form for errors.'}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
