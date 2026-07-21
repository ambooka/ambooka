import "../globals.css";
import PublicThemeContainer from "@/components/PublicThemeContainer";

import { JsonLd } from "@/components/seo/JsonLd";
import { WebSite, WithContext } from "schema-dts";
import { supabase } from "@/integrations/supabase/client";

// Note: query-input is a valid Schema.org property but not in schema-dts types
// Using type assertion to include it for Google's search box functionality
const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Abdulrahman Ambooka Msah",
    url: "https://ambooka.dev",
    potentialAction: {
        "@type": "SearchAction",
        target: "https://ambooka.dev/search?q={search_term_string}",
    } as WithContext<WebSite>["potentialAction"]
};

export default async function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: profile } = await supabase
        .from("personal_info")
        .select("full_name,title,email,location,about_text,summary,github_url,linkedin_url,website_url")
        .limit(1)
        .maybeSingle();

    return (
        <PublicThemeContainer profile={profile}>
            <JsonLd schema={websiteSchema} />
            {children}
        </PublicThemeContainer>
    );
}
