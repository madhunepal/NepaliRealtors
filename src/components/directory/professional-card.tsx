import Link from "next/link";
import { BadgeCheck, MapPin, Languages } from "lucide-react";
import { ProfessionalProfile } from "@/types/database";

export function ProfessionalCard({ profile }: { profile: ProfessionalProfile }) {
    const details = profile.professional_details;
    const location = details?.city && details?.state ? `${details.city}, ${details.state}` : "Location N/A";

    return (
        <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div>
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name || ""} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs font-medium text-zinc-500">
                                    {profile.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-50">
                                <Link href={`/pro/${profile.slug}`} className="hover:underline">
                                    {profile.full_name}
                                </Link>
                            </h3>
                            <p className="text-sm text-zinc-500 capitalize">{profile.role.replace("_", " ")}</p>
                        </div>
                    </div>
                    {profile.is_verified && (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/10 dark:text-blue-400">
                            <BadgeCheck className="mr-1 h-3 w-3" /> Verified
                        </span>
                    )}
                </div>

                <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-zinc-400" />
                        <span>{location}</span>
                    </div>
                    {details?.languages && details.languages.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Languages className="h-4 w-4 text-zinc-400" />
                            <span>{details.languages.join(", ")}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6">
                <Link
                    href={`/pro/${profile.slug}`}
                    className="block w-full rounded-md bg-zinc-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}
