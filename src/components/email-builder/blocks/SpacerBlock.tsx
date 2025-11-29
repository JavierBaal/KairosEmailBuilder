import React from 'react';
import { EmailBlock } from '../types';

interface SpacerBlockProps {
    block: EmailBlock;
}

export function SpacerBlock({ block }: SpacerBlockProps) {
    const {
        height = '20px'
    } = block.props;

    return (
        <div style={{ height, width: '100%' }} />
    );
}
