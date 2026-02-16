import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - MeroGharInUSA",
    description: "Terms of Service for MeroGharInUSA.",
};

export default function TermsPage() {
    return (
        <div className="bg-white px-6 py-32 lg:px-8 dark:bg-black">
            <div className="mx-auto max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">Terms of Service</h1>
                <p className="mt-6 text-xl leading-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <div className="mt-10 max-w-2xl space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">1. Agreement to Terms</h2>
                        <p className="mt-4">
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and MeroGharInUSA ("we", "us", or "our"), concerning your access to and use of the merogharinusa.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">2. MeroGharInUSA is Not a Real Estate Broker</h2>
                        <p className="mt-4">
                            You acknowledge and agree that MeroGharInUSA is a technology platform that connects users with independent real estate professionals. We are not a real estate broker, mortgage lender, or insurer. We do not represent you or the professionals in any transaction. Any agreement you enter into with a professional found on our Site is solely between you and that professional.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">3. User Representations</h2>
                        <p className="mt-4">
                            By using the Site, you represent and warrant that:
                        </p>
                        <ul className="mt-4 list-disc list-inside space-y-2">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">4. Prohibited Activities</h2>
                        <p className="mt-4">
                            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">5. Limitation of Liability</h2>
                        <p className="mt-4">
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
