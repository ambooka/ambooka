import "../globals.css";
import PublicThemeContainer from "@/components/PublicThemeContainer";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <PublicThemeContainer>
            {children}
        </PublicThemeContainer>
    );
}
