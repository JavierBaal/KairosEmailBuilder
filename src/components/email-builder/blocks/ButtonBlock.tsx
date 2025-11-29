import React from 'react';
import { EmailBlock } from '../types';

interface ButtonBlockProps {
    block: EmailBlock;
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

    return (
        <div style={{ textAlign: align, padding: '10px' }}>
            <a
                href={url}
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
