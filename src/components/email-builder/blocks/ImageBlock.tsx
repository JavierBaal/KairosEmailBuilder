import React, { useState } from 'react';
import { EmailBlock } from '../types';

interface ImageBlockProps {
    block: EmailBlock;
}

// Validar que una URL de imagen sea segura
function isValidImageUrl(url: string): boolean {
    if (!url || url.trim() === '') return false;
    try {
        const urlObj = new URL(url, window.location.href);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'data:';
    } catch {
        return false;
    }
}

export function ImageBlock({ block }: ImageBlockProps) {
    const {
        src = '',
        alt = 'Image',
        width = '100%',
        align = 'center',
        padding = '10px'
    } = block.props;

    const [imageError, setImageError] = useState(false);
    const hasValidSrc = src && isValidImageUrl(src);
    const showPlaceholder = !hasValidSrc || imageError;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div style={{ padding, textAlign: align }}>
            {showPlaceholder ? (
                <div
                    style={{
                        width: width === '100%' ? '100%' : width,
                        minHeight: '150px',
                        backgroundColor: '#f3f4f6',
                        border: '2px dashed #d1d5db',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '16px',
                        fontWeight: '500',
                        fontFamily: 'Arial, sans-serif'
                    }}
                >
                    Image
                </div>
            ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    src={src}
                    alt={alt}
                    onError={handleImageError}
                    style={{
                        maxWidth: '100%',
                        width: width,
                        height: 'auto',
                        display: 'inline-block'
                    }}
                />
            )}
        </div>
    );
}
