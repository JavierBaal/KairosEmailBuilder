import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BlockType } from '../types';
import { Type, Image as ImageIcon, Square, Columns, Minus, MoveVertical, Share2, FileText, Layout } from 'lucide-react';

interface DraggableBlockProps {
    type: BlockType;
    label: string;
    icon: React.ReactNode;
}

function DraggableBlock({ type, label, icon }: DraggableBlockProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `sidebar-${type}`,
        data: { type }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                p-3 border rounded bg-card text-xs flex flex-col items-center gap-2 
                ${isDragging ? 'cursor-grabbing shadow-lg scale-95' : 'cursor-move hover:border-primary hover:shadow-sm'}
                transition-all duration-200
            `}
            role="button"
            aria-label={`Drag ${label} block`}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}

export function LeftSidebar() {
    return (
        <div className="p-4">
            <h2 className="text-sm font-semibold mb-4">Blocks</h2>
            <div className="grid grid-cols-2 gap-2">
                <DraggableBlock type="text" label="Text" icon={<Type size={20} />} />
                <DraggableBlock type="image" label="Image" icon={<ImageIcon size={20} aria-hidden="true" />} />
                <DraggableBlock type="button" label="Button" icon={<Square size={20} />} />
                <DraggableBlock type="columns" label="Columns" icon={<Columns size={20} />} />
                <DraggableBlock type="divider" label="Divider" icon={<Minus size={20} />} />
                <DraggableBlock type="spacer" label="Spacer" icon={<MoveVertical size={20} />} />
                <DraggableBlock type="social-links" label="Social Links" icon={<Share2 size={20} />} />
                <DraggableBlock type="footer" label="Footer" icon={<FileText size={20} />} />
                <DraggableBlock type="header" label="Header" icon={<Layout size={20} />} />
            </div>
        </div>
    );
}
