import React from 'react';
import { EmailBlock } from '../types';

interface ImageBlockProps {
    block: EmailBlock;
}

// Validar que una URL de imagen sea segura
function isValidImageUrl(url: string): boolean {
    try {
        const urlObj = new URL(url, window.location.href);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'data:';
    } catch {
        return false;
    }
}

export function ImageBlock({ block }: ImageBlockProps) {
    const {
        src = 'https://via.placeholder.com/600x200?text=Image+Placeholder',
        alt = 'Image',
        width = '100%',
        align = 'center',
        padding = '10px'
    } = block.props;

    // Validar URL antes de usarla
    const safeSrc = isValidImageUrl(src) ? src : 'https://via.placeholder.com/600x200?text=Image+Placeholder';

    return (
        <div style={{ padding, textAlign: align }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={safeSrc}
                alt={alt}
                style={{
                    maxWidth: '100%',
                    width: width,
                    height: 'auto',
                    display: 'inline-block'
                }}
            />
        </div>
    );
}
