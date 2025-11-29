import React from 'react';
import { EmailBlock } from '../types';

interface ButtonBlockProps {
    block: EmailBlock;
}

// Validar que una URL sea segura
function isValidUrl(url: string): boolean {
    try {
        const urlObj = new URL(url, window.location.href);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'mailto:';
    } catch {
        return false;
    }
}

export function ButtonBlock({ block }: ButtonBlockProps) {
    const {
        text = 'Click Me',
        url = '#',
        backgroundColor = '#007bff',
        color = '#ffffff',
        borderRadius = '4px',
        padding = '12px 24px',
        align = 'center',
        width = 'auto'
    } = block.props;

    // Validar URL antes de usarla
    const safeUrl = isValidUrl(url) ? url : '#';

    return (
        <div style={{ textAlign: align, padding: '10px' }}>
            <a
                href={safeUrl}
                style={{
                    display: 'inline-block',
                    backgroundColor,
                    color,
                    borderRadius,
                    padding,
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    width: width === 'full' ? '100%' : 'auto',
                    boxSizing: 'border-box',
                    textAlign: 'center'
                }}
                onClick={(e) => e.preventDefault()} // Prevent navigation in editor
            >
                {text}
            </a>
        </div>
    );
}
