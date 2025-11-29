import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EmailTemplate } from '../types';
import { cn } from '@/lib/utils';
import { BlockRenderer } from './BlockRenderer';
import { SortableBlock } from './SortableBlock';

interface CanvasProps {
    template: EmailTemplate;
}

export function Canvas({ template }: CanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-droppable',
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "w-full max-w-[600px] min-h-[800px] bg-white shadow-lg rounded-sm p-4 transition-colors",
                isOver && "bg-blue-50 ring-2 ring-blue-500 ring-inset"
            )}
            style={{
                backgroundColor: template.root.backgroundColor,
                fontFamily: template.root.fontFamily
            }}
        >
            {template.root.children.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                    <p className="text-sm">Drag and drop blocks here</p>
                </div>
            ) : (
                <SortableContext
                    items={template.root.children.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col">
                        {template.root.children.map(block => (
                            <SortableBlock key={block.id} block={block} />
                        ))}
                    </div>
                </SortableContext>
            )}
        </div>
    );
}
