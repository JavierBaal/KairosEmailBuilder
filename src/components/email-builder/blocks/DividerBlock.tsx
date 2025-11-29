import React from 'react';
import { EmailBlock } from '../types';

interface DividerBlockProps {
    block: EmailBlock;
}

export function DividerBlock({ block }: DividerBlockProps) {
    const {
        color = '#cccccc',
        height = '1px',
        padding = '10px 0'
    } = block.props;

    return (
        <div style={{ padding }}>
            <hr style={{ border: 'none', borderTop: `${height} solid ${color}`, margin: 0 }} />
        </div>
    );
}
