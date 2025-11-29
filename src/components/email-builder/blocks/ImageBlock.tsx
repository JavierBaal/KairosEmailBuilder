import React from 'react';
import { EmailBlock } from '../types';

interface ImageBlockProps {
    block: EmailBlock;
}

export function ImageBlock({ block }: ImageBlockProps) {
    const {
        src = 'https://via.placeholder.com/600x200?text=Image+Placeholder',
        alt = 'Image',
        width = '100%',
        align = 'center',
        padding = '10px'
    } = block.props;

    return (
        <div style={{ padding, textAlign: align }}>
            <img
                src={src}
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
