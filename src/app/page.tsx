'use client';

import { useState } from 'react';
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

    return (
        <EmailBuilder 
            value={template} 
            onChange={setTemplate}
        />
    );
}
