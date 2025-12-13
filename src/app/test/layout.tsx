import "./test-globals.css";

export default function TestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="test-layout-wrapper">
            {children}
        </div>
    );
}
