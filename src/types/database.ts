export type Profile = {
    id: string;
    email: string;
    slug: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: 'customer' | 'realtor' | 'inspector' | 'builder' | 'loan_officer' | 'admin';
    is_verified: boolean;
    created_at: string;
};

export type ProfessionalDetails = {
    id: string;
    bio: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    service_radius_miles: number | null;
    license_number: string | null;
    phone: string | null;
    is_phone_public: boolean;
    is_email_public: boolean;
    website: string | null;
    languages: string[] | null;
    services: string[] | null;
    social_links: any | null;
};

export type ProfessionalProfile = Profile & {
    professional_details: ProfessionalDetails | null;
};
