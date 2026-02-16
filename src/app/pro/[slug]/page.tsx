import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ProfessionalProfile } from "@/types/database";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Globe, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { MessageButton } from "@/components/profile/message-button";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("slug", slug)
        .single();

    if (!profile) return { title: "Profile Not Found" };

    return {
        title: `${profile.full_name} (${profile.role}) - MeroGharInUSA`,
        description: `Connect with ${profile.full_name} on MeroGharInUSA.`,
    };
}

export default async function ProfilePage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("profiles")
        .select("*, professional_details(*)")
        .eq("slug", slug)
        .single();

    if (error || !data) {
        notFound();
    }

    const profile = data as unknown as ProfessionalProfile;
    const details = profile.professional_details;
    const location = details?.city && details?.state ? `${details.city}, ${details.state}` : "Location N/A";

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-10">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-zinc-900">
                    {/* Header / Cover Area */}
                    <div className="h-32 bg-red-600 sm:h-48 relative"></div>

                    <div className="px-4 pb-5 sm:px-6 relative">
                        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                            <div className="flex">
                                <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white dark:ring-zinc-900 bg-zinc-200 overflow-hidden">
                                    {profile.avatar_url ? (
                                        <Image
                                            src={profile.avatar_url}
                                            alt={profile.full_name || ""}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xl font-bold text-zinc-500">
                                            {profile.full_name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                                <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                                    <h1 className="truncate text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                        {profile.full_name}
                                    </h1>
                                    <p className="text-zinc-500 capitalize">{profile.role.replace("_", " ")}</p>
                                </div>
                                <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    {user?.id !== profile.id ? (
                                        <MessageButton proId={profile.id} proName={profile.full_name || "Professional"} />
                                    ) : (
                                        <Link
                                            href="/dashboard/profile"
                                            className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-700"
                                        >
                                            Edit Profile
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
                                <h1 className="truncate text-2xl font-bold text-zinc-900 dark:text-zinc-50">{profile.full_name}</h1>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="px-4 py-5 sm:px-6">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
                                {/* Left Column (Details) */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-500">Verified Status</h3>
                                        <div className="mt-2 flex items-center">
                                            {profile.is_verified ? (
                                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    <BadgeCheck className="mr-1.5 h-4 w-4" /> Verified Pro
                                                </span>
                                            ) : (
                                                <span className="text-zinc-500 text-sm">Not Verified</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-500">Location</h3>
                                        <div className="mt-2 flex items-center text-sm text-zinc-900 dark:text-zinc-100">
                                            <MapPin className="mr-1.5 h-4 w-4 text-zinc-400" />
                                            {location}
                                        </div>
                                    </div>

                                    {details?.is_phone_public && details?.phone && (
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-sm font-medium text-zinc-500">Phone</h3>
                                            <div className="flex items-center text-sm text-zinc-900 dark:text-zinc-100">
                                                <Phone className="mr-1.5 h-4 w-4 text-zinc-400" />
                                                <a href={`tel:${details.phone}`} className="hover:underline">
                                                    {details.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {details?.is_email_public && profile.email && (
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-sm font-medium text-zinc-500">Email</h3>
                                            <div className="flex items-center text-sm text-zinc-900 dark:text-zinc-100">
                                                <Mail className="mr-1.5 h-4 w-4 text-zinc-400" />
                                                <a href={`mailto:${profile.email}`} className="hover:underline">
                                                    {profile.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {details?.website && (
                                        <div>
                                            <h3 className="text-sm font-medium text-zinc-500">Website</h3>
                                            <div className="mt-2 text-sm">
                                                <a href={details.website} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
                                                    <Globe className="mr-1.5 h-4 w-4" />
                                                    Visit Website
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column (Bio) */}
                                <div className="lg:col-span-2">
                                    <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-50">About</h3>
                                    <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 space-y-4">
                                        <p>{details?.bio || "No bio available."}</p>
                                    </div>

                                    {details?.services && details.services.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-sm font-medium text-zinc-500">Services</h3>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {details.services.map(service => (
                                                    <span key={service} className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {details?.languages && (
                                        <div className="mt-8">
                                            <h3 className="text-sm font-medium text-zinc-500">Languages</h3>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {details.languages.map(lang => (
                                                    <span key={lang} className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
