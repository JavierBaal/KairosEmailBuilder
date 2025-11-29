import React from 'react';
import { EmailBlock } from '../types';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@/lib/utils';
import { TextBlock } from '../blocks/TextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { ButtonBlock } from '../blocks/ButtonBlock';
import { DividerBlock } from '../blocks/DividerBlock';
import { SpacerBlock } from '../blocks/SpacerBlock';
import { ColumnsBlock } from '../blocks/ColumnsBlock';

interface BlockRendererProps {
    block: EmailBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
    const { selectedBlockId, selectBlock } = useEditorStore();
    const isSelected = selectedBlockId === block.id;

    const handleBlockClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectBlock(block.id);
    };

    const renderBlockContent = () => {
        switch (block.type) {
            case 'text':
                return <TextBlock block={block} />;
            case 'image':
                return <ImageBlock block={block} />;
            case 'button':
                return <ButtonBlock block={block} />;
            case 'columns':
                return <ColumnsBlock block={block} />;
            case 'divider':
                return <DividerBlock block={block} />;
            case 'spacer':
                return <SpacerBlock block={block} />;
            default:
                return <div className="p-4 bg-gray-100 text-center text-gray-500">Unknown block type: {block.type}</div>;
        }
    };

    return (
        <div
            onClick={handleBlockClick}
            className={cn(
                "relative group cursor-pointer transition-all outline outline-2 outline-transparent hover:outline-blue-300",
                isSelected && "outline-blue-600 z-10"
            )}
        >
            {/* Selection Label */}
            {isSelected && (
                <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-t">
                    {block.type}
                </div>
            )}

            {/* Block Content */}
            {renderBlockContent()}

            {/* Renderizar bloques hijos recursivamente si existen (excepto para columns que maneja sus propios hijos) */}
            {block.type !== 'columns' && block.children && block.children.length > 0 && (
                <div className="nested-blocks mt-2 space-y-2 pl-4 border-l-2 border-gray-200">
                    {block.children.map(childBlock => (
                        <BlockRenderer key={childBlock.id} block={childBlock} />
                    ))}
                </div>
            )}
        </div>
    );
}
