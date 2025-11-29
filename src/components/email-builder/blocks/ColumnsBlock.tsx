import React from 'react';
import { EmailBlock } from '../types';
import { ColumnsBlockProps } from '../types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableBlock } from '../canvas/SortableBlock';

interface ColumnsBlockComponentProps {
    block: EmailBlock;
}

interface ColumnDroppableProps {
    columnId: string;
    columnBlocks: EmailBlock[];
    parentBlockId: string;
    columnIndex: number;
}

function ColumnDroppable({ columnId, columnBlocks, parentBlockId, columnIndex }: ColumnDroppableProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: columnId,
        data: {
            isColumn: true,
            parentBlockId,
            columnIndex
        }
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                width: '100%',
                minHeight: '50px',
                padding: '5px',
                backgroundColor: isOver ? '#e0f2fe' : 'transparent',
                border: isOver ? '2px dashed #0ea5e9' : '1px dashed #e5e7eb',
                borderRadius: '4px',
                transition: 'all 0.2s'
            }}
            className="column-droppable"
        >
            {columnBlocks.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-4">
                    Drop blocks here
                </div>
            ) : (
                <SortableContext
                    items={columnBlocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-2">
                        {columnBlocks.map(childBlock => (
                            <SortableBlock key={childBlock.id} block={childBlock} />
                        ))}
                    </div>
                </SortableContext>
            )}
        </div>
    );
}

export function ColumnsBlock({ block }: ColumnsBlockComponentProps) {
    const {
        columnCount = 2,
        gap = '10px',
        padding = '10px',
        backgroundColor = '#ffffff'
    } = block.props as ColumnsBlockProps;

    // Ensure columnCount is valid
    const validColumnCount = Math.max(2, Math.min(4, columnCount)) as 2 | 3 | 4;

    // Split children into columns
    // For now, we'll distribute children evenly across columns
    // In a more advanced version, we could store column assignments in block metadata
    const children = block.children || [];
    const itemsPerColumn = Math.ceil(children.length / validColumnCount);
    const columns: EmailBlock[][] = [];

    for (let i = 0; i < validColumnCount; i++) {
        const start = i * itemsPerColumn;
        const end = start + itemsPerColumn;
        columns.push(children.slice(start, end));
    }

    return (
        <div
            style={{
                padding,
                backgroundColor,
                display: 'grid',
                gridTemplateColumns: `repeat(${validColumnCount}, 1fr)`,
                gap,
                width: '100%'
            }}
            className="columns-container"
        >
            {columns.map((columnBlocks, columnIndex) => {
                const columnId = `column-${block.id}-${columnIndex}`;
                return (
                    <ColumnDroppable
                        key={columnIndex}
                        columnId={columnId}
                        columnBlocks={columnBlocks}
                        parentBlockId={block.id}
                        columnIndex={columnIndex}
                    />
                );
            })}
        </div>
    );
}

