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

    // Check if text contains HTML tags
    const isHtml = typeof text === 'string' && (text.includes('<') && text.includes('>'));
    
    // If text is empty or just whitespace/empty tags, show placeholder
    const isEmpty = !text || text.trim() === '' || text.trim() === '<p></p>' || text.trim() === '<p><br></p>';

    return (
        <div style={{ padding }}>
            <div 
                style={{
                    textAlign: align,
                    color,
                    fontSize,
                    lineHeight,
                    width: '100%'
                }}
                className="text-block-content"
            >
                {isEmpty ? (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                        Edit this text
                    </span>
                ) : isHtml ? (
                    <div 
                        dangerouslySetInnerHTML={{ __html: text }}
                        style={{
                            // Ensure HTML content respects the container styles
                            color: 'inherit',
                            fontSize: 'inherit',
                            lineHeight: 'inherit',
                        }}
                    />
                ) : (
                    text
                )}
            </div>
        </div>
    );
}
