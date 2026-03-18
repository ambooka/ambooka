import React from 'react';
import { Thing, WithContext } from 'schema-dts';

interface JsonLdProps {
    schema: WithContext<Thing>;
}

export function JsonLd({ schema }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
