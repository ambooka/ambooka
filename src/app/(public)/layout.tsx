import "../globals.css";
import PublicThemeContainer from "@/components/PublicThemeContainer";

import { JsonLd } from "@/components/seo/JsonLd";
import { WebSite, WithContext } from "schema-dts";

const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Abdulrahman Ambooka",
    url: "https://ambooka.dev",
    potentialAction: {
        "@type": "SearchAction",
        target: "https://ambooka.dev/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
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
