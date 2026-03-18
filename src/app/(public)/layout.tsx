import "../globals.css";
import PublicThemeContainer from "@/components/PublicThemeContainer";

import { JsonLd } from "@/components/seo/JsonLd";
import { WebSite, WithContext } from "schema-dts";

// Note: query-input is a valid Schema.org property but not in schema-dts types
// Using type assertion to include it for Google's search box functionality
const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Abdulrahman Ambooka",
    url: "https://ambooka.dev",
    potentialAction: {
        "@type": "SearchAction",
        target: "https://ambooka.dev/search?q={search_term_string}",
    } as WithContext<WebSite>["potentialAction"]
};

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <PublicThemeContainer>
            <JsonLd schema={websiteSchema} />
            {children}
        </PublicThemeContainer>
    );
}
