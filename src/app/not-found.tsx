'use client';

import StaticNoise from '@/components/ui/StaticNoise';

export default function NotFound() {
    return (
        <StaticNoise
            fullscreen={true}
            title="NO SIGNAL"
            message="ERROR 404: PAGE MISSING"
        />
    );
}
