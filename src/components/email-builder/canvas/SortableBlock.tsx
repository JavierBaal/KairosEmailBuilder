import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockRenderer } from './BlockRenderer';
import { EmailBlock } from '../types';

interface SortableBlockProps {
    block: EmailBlock;
}

export function SortableBlock({ block }: SortableBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id, data: { type: block.type, isBlock: true } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className={`
                relative
                ${isDragging ? 'cursor-grabbing shadow-2xl scale-105 z-50' : 'cursor-grab'}
                transition-all duration-200
            `}
        >
            {isDragging && (
                <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-2 z-50">
                    <span>Moviendo...</span>
                </div>
            )}
            <BlockRenderer block={block} />
            {/* Los bloques hijos se renderizan recursivamente dentro de BlockRenderer */}
        </div>
    );
}
