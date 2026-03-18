'use client';

import StaticNoise from '@/components/ui/StaticNoise';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body className="bg-black text-white">
                <StaticNoise
                    fullscreen={true}
                    title="FATAL ERROR"
                    message="SYSTEM REBOOT REQUIRED"
                    onRetry={reset}
                    showHomeButton={true}
                />
            </body>
        </html>
    );
}
