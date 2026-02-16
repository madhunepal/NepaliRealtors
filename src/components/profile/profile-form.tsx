"use client";

import { useActionState, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { US_STATES, LANGUAGES } from "@/lib/data";
import { MultiSelect } from "@/components/ui/multi-select";

const SERVICES = ["Realtor", "Loan Officer", "Inspector", "Builder", "Handyman", "Plumber", "Electrician", "Pest Controller", "Other"];

type ProfileFormProps = {
    initialData?: {
        fullName: string;
        bio?: string | null;
        city?: string | null;
        state?: string | null;
        licenseNumber?: string | null;
        website?: string | null;
        phone?: string | null;
        languages?: string[] | null;
        services?: string[] | null;
        isPhonePublic?: boolean;
        isEmailPublic?: boolean;
        email?: string;
    };
    action: (prevState: any, formData: FormData) => Promise<any>;
    submitLabel?: string;
};

const initialState = {
    error: null as string | object | null,
    success: null as string | null, // Added success state
};

export function ProfileForm({ initialData, action, submitLabel = "Save Profile" }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(action, initialState);
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

    const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.services || []);

    const handleServicesChange = (newSelected: string[]) => {
        setSelectedServices(newSelected);
    };

    return (
        <form action={formAction} className="space-y-6">
            {state?.success && (
                <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    {state.success}
                </div>
            )}
            {/* ... rest of form */}

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
                            defaultValue={initialData?.fullName || ""}
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
                            defaultValue={initialData?.bio || ""}
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
                            defaultValue={initialData?.city || ""}
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
                            defaultValue={initialData?.state || ""}
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
                        License Number <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="licenseNumber"
                            id="licenseNumber"
                            defaultValue={initialData?.licenseNumber || ""}
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        Phone Number
                    </label>
                    <div className="mt-2 flex gap-4">
                        <div className="flex-grow">
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                defaultValue={initialData?.phone || ""}
                                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="isPhonePublic"
                                name="isPhonePublic"
                                type="checkbox"
                                defaultChecked={initialData?.isPhonePublic ?? false}
                                className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-900"
                            />
                            <label htmlFor="isPhonePublic" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300">
                                Display Publicly
                            </label>
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <div className="flex items-center">
                        <input
                            id="isEmailPublic"
                            name="isEmailPublic"
                            type="checkbox"
                            defaultChecked={initialData?.isEmailPublic ?? false}
                            className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-900"
                        />
                        <label htmlFor="isEmailPublic" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300">
                            Display my Email Address Publicly
                        </label>
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="website" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        Website URL <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="website"
                            id="website"
                            defaultValue={initialData?.website || ""}
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700"
                            placeholder="www.example.com"
                        />
                    </div>
                </div>


                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-3">
                        Services Provided
                    </label>
                    <MultiSelect
                        options={SERVICES.map(s => ({ label: s, value: s }))}
                        selected={selectedServices}
                        onChange={handleServicesChange}
                        placeholder="Select services..."
                    />
                    {/* Hidden inputs for form submission */}
                    <div id="services-container">
                        {selectedServices.map(s => (
                            <input key={s} type="hidden" name="services" value={s} />
                        ))}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-3">
                        Languages Spoken
                    </label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {LANGUAGES.map((lang) => (
                            <div key={lang} className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input
                                        id={`lang-${lang}`}
                                        name="languages"
                                        type="checkbox"
                                        value={lang}
                                        defaultChecked={initialData?.languages?.includes(lang) ?? false}
                                        className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-900"
                                    />
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                    <label htmlFor={`lang-${lang}`} className="font-medium text-zinc-900 dark:text-zinc-300">
                                        {lang}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : submitLabel}
                </button>
            </div>
            {state?.error && (
                <div className="text-sm text-red-600">
                    {typeof state.error === 'string' ? state.error : 'Please check the form for errors.'}
                </div>
            )}
        </form>
    );
}
