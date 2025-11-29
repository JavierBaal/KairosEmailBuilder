import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BlockType } from '../types';
import { Type, Image, Square, Columns, Minus, MoveVertical } from 'lucide-react';

interface DraggableBlockProps {
    type: BlockType;
    label: string;
    icon: React.ReactNode;
}

function DraggableBlock({ type, label, icon }: DraggableBlockProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: { type }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 border rounded bg-card text-xs flex flex-col items-center gap-2 cursor-move hover:border-primary hover:shadow-sm transition-all"
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
                <DraggableBlock type="image" label="Image" icon={<Image size={20} />} />
                <DraggableBlock type="button" label="Button" icon={<Square size={20} />} />
                <DraggableBlock type="columns" label="Columns" icon={<Columns size={20} />} />
                <DraggableBlock type="divider" label="Divider" icon={<Minus size={20} />} />
                <DraggableBlock type="spacer" label="Spacer" icon={<MoveVertical size={20} />} />
            </div>
        </div>
    );
}
