import React from 'react';
import { useEditorStore } from '../store/editor-store';
import { EmailBlock } from '../types';
import { TextProperties } from '../properties/TextProperties';
import { ImageProperties } from '../properties/ImageProperties';
import { ButtonProperties } from '../properties/ButtonProperties';
import { DividerProperties } from '../properties/DividerProperties';
import { SpacerProperties } from '../properties/SpacerProperties';

export function RightSidebar() {
    const { template, selectedBlockId, updateBlock } = useEditorStore();

    // Helper to find block by ID (recursive)
    const findBlock = (blocks: EmailBlock[], id: string): EmailBlock | null => {
        for (const block of blocks) {
            if (block.id === id) return block;
            if (block.children) {
                const found = findBlock(block.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedBlock = selectedBlockId ? findBlock(template.root.children, selectedBlockId) : null;

    if (!selectedBlock) {
        return (
            <div className="p-6 text-center text-muted-foreground mt-10">
                <p>Select a block on the canvas to edit its properties.</p>
            </div>
        );
    }

    const handleUpdate = (newProps: Record<string, unknown>) => {
        if (selectedBlockId) {
            updateBlock(selectedBlockId, newProps);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                    <span className="capitalize">{selectedBlock.type}</span> Properties
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {selectedBlock.type === 'text' && (
                    <TextProperties props={selectedBlock.props} onChange={handleUpdate} />
                )}
                {selectedBlock.type === 'image' && (
                    <ImageProperties props={selectedBlock.props} onChange={handleUpdate} />
                )}
                {selectedBlock.type === 'button' && (
                    <ButtonProperties props={selectedBlock.props} onChange={handleUpdate} />
                )}
                {selectedBlock.type === 'divider' && (
                    <DividerProperties props={selectedBlock.props} onChange={handleUpdate} />
                )}
                {selectedBlock.type === 'spacer' && (
                    <SpacerProperties props={selectedBlock.props} onChange={handleUpdate} />
                )}
                {/* Fallback for other types */}
                {!['text', 'image', 'button', 'divider', 'spacer'].includes(selectedBlock.type) && (
                    <div className="text-sm text-muted-foreground">
                        No properties available for this block type yet.
                    </div>
                )}
            </div>
        </div>
    );
}
