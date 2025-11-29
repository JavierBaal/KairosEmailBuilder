'use client';

import { useState, useEffect } from 'react';
import { EmailBuilder } from '@/components/email-builder/EmailBuilder';
import { EmailTemplate } from '@/components/email-builder/types';

const initialTemplate: EmailTemplate = {
    version: '1.0',
    root: {
        backgroundColor: '#ffffff',
        fontFamily: 'sans-serif',
        children: []
    }
};

export default function Home() {
    const [template, setTemplate] = useState<EmailTemplate>(initialTemplate);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <EmailBuilder 
            value={template} 
            onChange={setTemplate}
        />
    );
}
