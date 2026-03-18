'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import StaticNoise from '@/components/ui/StaticNoise';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <StaticNoise
            fullscreen={true}
            title="SYSTEM FAILURE"
            message="CRITICAL ERROR ENCOUNTERED"
            onRetry={reset}
            showHomeButton={true}
        />
    );
}
