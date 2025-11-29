import React from 'react';
import { EmailBlock } from '../types';

interface TextBlockProps {
    block: EmailBlock;
}

export function TextBlock({ block }: TextBlockProps) {
    const {
        text = 'Edit this text',
        align = 'left',
        color = '#000000',
        fontSize = '16px',
        lineHeight = '1.5',
        padding = '10px'
    } = block.props;

    return (
        <div style={{ padding }}>
            <div style={{
                textAlign: align,
                color,
                fontSize,
                lineHeight,
                width: '100%'
            }}>
                {text}
            </div>
        </div>
    );
}
