import React from 'react';
import { EmailBlock } from '../types';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@/lib/utils';

interface SpacerBlockProps {
    block: EmailBlock;
}

export function SpacerBlock({ block }: SpacerBlockProps) {
    const { selectedBlockId } = useEditorStore();
    const isSelected = selectedBlockId === block.id;
    const {
        height = '20px'
    } = block.props;

    // Parse height to ensure minimum visibility
    const heightValue = typeof height === 'string' ? parseInt(height.replace('px', ''), 10) || 20 : height;
    const minHeight = Math.max(heightValue, 20);

    return (
        <div 
            className={cn(
                "relative w-full transition-all",
                isSelected && "ring-2 ring-blue-600 ring-inset"
            )}
            style={{ 
                height: `${minHeight}px`, 
                width: '100%',
                backgroundColor: isSelected ? '#e0f2fe' : '#f3f4f6',
                border: isSelected ? '2px dashed #0ea5e9' : '1px dashed #d1d5db',
                borderRadius: '4px',
                minHeight: '20px'
            }}
        >
            {isSelected && (
                <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-t flex items-center gap-1">
                    <span>Spacer</span>
                    <span className="text-[10px] opacity-75">({height})</span>
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 pointer-events-none">
                {height}
            </div>
        </div>
    );
}
