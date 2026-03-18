'use client';

import StaticNoise from './StaticNoise';

interface ErrorPlaceholderProps {
    title?: string;
    message?: string;
    className?: string;
    onRetry?: () => void;
}

export default function ErrorPlaceholder({
    title = "COMPONENT ERROR",
    message = "This component failed to load.",
    className,
    onRetry
}: ErrorPlaceholderProps) {
    return (
        <div className={`relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden ${className}`}>
            <StaticNoise
                fullscreen={false}
                title={title}
                message={message}
                onRetry={onRetry}
                showHomeButton={false}
            />
        </div>
    );
}
