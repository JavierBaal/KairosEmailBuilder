import React from 'react';
import { EmailTemplate } from '../types';

interface TemplatePreviewProps {
    template: EmailTemplate;
    className?: string;
}

// Component that renders a schematic view of the template
export function TemplatePreview({ template, className = '' }: TemplatePreviewProps) {
    const renderBlockPreview = (block: typeof template.root.children[0], depth = 0): React.ReactNode => {
        const blockColors: Record<string, string> = {
            text: '#e3f2fd',
            image: '#fff3e0',
            button: '#f3e5f5',
            columns: '#e8f5e9',
            divider: '#fafafa',
            spacer: '#f5f5f5'
        };

        const blockLabels: Record<string, string> = {
            text: 'Text',
            image: 'Image',
            button: 'Button',
            columns: 'Columns',
            divider: 'Divider',
            spacer: 'Spacer'
        };

        const bgColor = blockColors[block.type] || '#f5f5f5';
        const label = blockLabels[block.type] || block.type;

        return (
            <div
                key={block.id}
                style={{
                    backgroundColor: bgColor,
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '8px',
                    marginBottom: '4px',
                    fontSize: '11px',
                    minHeight: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginLeft: `${depth * 12}px`
                }}
            >
                <span style={{ fontWeight: '600', color: '#666' }}>{label}</span>
                {block.type === 'columns' && block.children && (
                    <span style={{ fontSize: '10px', color: '#999' }}>
                        {block.children.length} columns
                    </span>
                )}
                {block.type === 'spacer' && (
                    <span style={{ fontSize: '10px', color: '#999' }}>
                        {(block.props as { height?: string })?.height || 'auto'}
                    </span>
                )}
            </div>
        );
    };

    const renderChildren = (blocks: typeof template.root.children, depth = 0): React.ReactNode => {
        return blocks.map(block => {
            const children = block.children && block.children.length > 0 
                ? renderChildren(block.children, depth + 1)
                : null;

            return (
                <div key={block.id}>
                    {renderBlockPreview(block, depth)}
                    {children && (
                        <div style={{ marginTop: '4px' }}>
                            {children}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div
            className={className}
            style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '12px',
                maxHeight: '200px',
                overflowY: 'auto',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            {template.root.children.length === 0 ? (
                <div
                    style={{
                        textAlign: 'center',
                        color: '#999',
                        fontSize: '12px',
                        padding: '20px',
                        fontStyle: 'italic'
                    }}
                >
                    Empty template
                </div>
            ) : (
                <div>
                    {renderChildren(template.root.children)}
                </div>
            )}
        </div>
    );
}

