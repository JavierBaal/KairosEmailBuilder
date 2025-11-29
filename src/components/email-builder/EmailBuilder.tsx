'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EmailBuilderProps, EmailBlock } from './types';
import { LeftSidebar } from './panels/LeftSidebar';
import { RightSidebar } from './panels/RightSidebar';
import { Canvas } from './canvas/Canvas';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { useEditorStore } from './store/editor-store';
import { generateHtml } from '@/utils/html-generator';
import { Button } from '@/components/ui/button';
import { Download, Code } from 'lucide-react';
import { ResizablePanel } from './ui/ResizablePanel';
import { TemplateSelector } from './templates/TemplateSelector';
import { FileText } from 'lucide-react';

/**
 * EmailBuilder Component
 * 
 * @param value - El template de email actual
 * @param onChange - Callback que se ejecuta cuando el template cambia
 * @param onUploadImage - Optional callback for uploading images (not implemented yet)
 * @param previewMode - Si es true, oculta los paneles laterales y muestra solo el canvas
 */
export function EmailBuilder({ value, onChange, onUploadImage, previewMode = false, templateStorageCallbacks }: EmailBuilderProps) {
    // onUploadImage is reserved for future image upload implementation
    // Kept in signature for future compatibility
    if (onUploadImage) {
        // Future implementation here
    }
    const {
        template,
        setTemplate,
        addBlock,
        moveBlock,
        setDraggedBlockType,
        draggedBlockType,
        deleteBlock
    } = useEditorStore();

    const [leftSidebarWidth, setLeftSidebarWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('email-builder-left-sidebar-width');
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (!isNaN(parsed) && parsed >= 200 && parsed <= 600) {
                    return parsed;
                }
            }
        }
        return 256; // w-64 = 256px
    });

    const [rightSidebarWidth, setRightSidebarWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('email-builder-right-sidebar-width');
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (!isNaN(parsed) && parsed >= 200 && parsed <= 600) {
                    return parsed;
                }
            }
        }
        return 320; // w-80 = 320px
    });

    const handleLeftSidebarResize = useCallback((newWidth: number) => {
        setLeftSidebarWidth(newWidth);
    }, []);

    const handleRightSidebarResize = useCallback((newWidth: number) => {
        setRightSidebarWidth(newWidth);
    }, []);

    const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

    const handleSelectTemplate = useCallback((selectedTemplate: typeof template) => {
        setTemplate(selectedTemplate);
        onChange(selectedTemplate);
    }, [setTemplate, onChange]);

    // Use useRef to avoid infinite loops
    const previousTemplateRef = useRef<string>('');
    const isInternalUpdateRef = useRef(false);

    // Sync external value with internal store
    useEffect(() => {
        if (value) {
            const valueStr = JSON.stringify(value);
            // Only update if external value actually changed and wasn't an internal change
            if (valueStr !== previousTemplateRef.current && !isInternalUpdateRef.current) {
                setTemplate(value);
                previousTemplateRef.current = valueStr;
            }
            isInternalUpdateRef.current = false;
        }
    }, [value, setTemplate]);

    // Sync internal store changes to external onChange
    useEffect(() => {
        const templateStr = JSON.stringify(template);
        // Only call onChange if template actually changed
        if (templateStr !== previousTemplateRef.current) {
            isInternalUpdateRef.current = true;
            previousTemplateRef.current = templateStr;
            onChange(template);
        }
    }, [template, onChange]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [mounted] = useState(true); // Initialize directly, no SSR issues here

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        const type = event.active.data.current?.type;
        // Only set dragged type if it's from sidebar
        if (event.active.data.current?.type && !event.active.data.current?.isBlock) {
            setDraggedBlockType(type);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // If dragging outside canvas (no drop target), delete the block if it's an existing block
        if (!over) {
            // Only delete if it's an existing block being dragged, not a new block from sidebar
            if (active.data.current?.isBlock && typeof active.id === 'string') {
                deleteBlock(active.id);
            }
            setActiveId(null);
            setDraggedBlockType(null);
            return;
        }

        // Case 1: Dropping a sidebar item onto the canvas or column (creation)
        if (active.data.current?.type && !active.data.current?.isBlock) {
            const type = active.data.current?.type;
            
            // Check if dropping into a column
            if (typeof over.id === 'string' && over.id.startsWith('column-')) {
                // Extract parent block ID and column index from column ID
                // Format: column-${parentBlockId}-${columnIndex}
                const parts = over.id.split('-');
                if (parts.length >= 3) {
                    const parentBlockId = parts.slice(1, -1).join('-'); // Handle IDs with dashes
                    const columnIndex = parseInt(parts[parts.length - 1], 10);
                    
                    // Find the parent block to calculate insertion index
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
                    
                    // Use template from store hook (already available in component scope)
                    const parentBlock = findBlock(template.root.children, parentBlockId);
                    if (parentBlock && parentBlock.type === 'columns') {
                        const columnCount = Math.max(2, Math.min(4, parentBlock.props?.columnCount || 2));
                        const children = parentBlock.children || [];
                        const itemsPerColumn = Math.ceil(children.length / columnCount);
                        
                        // Calculate insertion index: sum of items in previous columns + items in current column
                        const insertionIndex = columnIndex * itemsPerColumn + Math.min(itemsPerColumn, children.length - columnIndex * itemsPerColumn);
                        
                        if (type) {
                            const newBlock: EmailBlock = {
                                id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                type: type,
                                props: {},
                                children: []
                            };
                            addBlock(newBlock, parentBlockId, insertionIndex);
                        }
                    }
                }
            }
            // Dropping onto canvas (root level) - ONLY when dropping directly on canvas, not on existing blocks
            else if (over.id === 'canvas-droppable') {
                if (type) {
                    const newBlock: EmailBlock = {
                        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        type: type,
                        props: {},
                        children: []
                    };
                    addBlock(newBlock);
                }
            }
        }
        // Case 2: Sorting existing blocks
        else if (active.id !== over.id) {
            // Check if dropping into a column
            if (typeof over.id === 'string' && over.id.startsWith('column-')) {
                const parts = over.id.split('-');
                if (parts.length >= 3) {
                    const parentBlockId = parts.slice(1, -1).join('-');
                    const columnIndex = parseInt(parts[parts.length - 1], 10);
                    
                    // Helper to find block by ID
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
                    
                    // Use template from store hook (already available in component scope)
                    const parentBlock = findBlock(template.root.children, parentBlockId);
                    const blockToMove = findBlock(template.root.children, active.id as string);
                    
                    if (parentBlock && parentBlock.type === 'columns' && blockToMove) {
                        const columnCount = Math.max(2, Math.min(4, parentBlock.props?.columnCount || 2));
                        const children = parentBlock.children || [];
                        const itemsPerColumn = Math.ceil(children.length / columnCount);
                        const insertionIndex = columnIndex * itemsPerColumn + Math.min(itemsPerColumn, children.length - columnIndex * itemsPerColumn);
                        
                        // Move block to new position in column
                        // moveBlock handles removal and insertion, but we need to specify the target parent
                        // For now, use addBlock which will handle insertion, but we need to remove first
                        // This is a simplified approach - in a more complete implementation, we'd have a moveBlockToParent function
                        addBlock(blockToMove, parentBlockId, insertionIndex);
                    }
                }
            } else {
                moveBlock(active.id as string, over.id as string);
            }
        }

        setActiveId(null);
        setDraggedBlockType(null);
    };

    const handleExportHtml = () => {
        const html = generateHtml(template);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'email-template.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportJson = () => {
        const json = JSON.stringify(template, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'email-template.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
                {/* Header */}
                <div className="h-14 border-b flex items-center justify-between px-4 bg-white z-10">
                    <h1 className="font-semibold text-lg">Kairos Email Builder</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setTemplateSelectorOpen(true)}>
                            <FileText size={16} className="mr-2" /> Templates
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportJson}>
                            <Code size={16} className="mr-2" /> Export JSON
                        </Button>
                        <Button size="sm" onClick={handleExportHtml}>
                            <Download size={16} className="mr-2" /> Export HTML
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Blocks - Redimensionable */}
                    {!previewMode && (
                        <ResizablePanel
                            defaultWidth={256}
                            minWidth={200}
                            maxWidth={600}
                            storageKey="email-builder-left-sidebar-width"
                            onResize={handleLeftSidebarResize}
                            handleSide="right"
                            className="border-r bg-muted/10"
                        >
                            <div className="h-full overflow-y-auto pr-2">
                                <LeftSidebar />
                            </div>
                        </ResizablePanel>
                    )}

                    {/* Visual separator - Independent physical space from Canvas */}
                    {!previewMode && <div className="w-2 flex-shrink-0" />}

                    {/* Center Canvas - Adjusts automatically, scrollbar completely separated */}
                    <div className="flex-1 overflow-y-auto bg-slate-100 p-8 min-w-0 canvas-scroll-container">
                        <div className="max-w-4xl mx-auto">
                            <Canvas template={template} />
                        </div>
                    </div>

                    {/* Visual separator - Independent physical space from Canvas */}
                    {!previewMode && <div className="w-2 flex-shrink-0" />}

                    {/* Right Sidebar - Properties - Redimensionable */}
                    {!previewMode && (
                        <ResizablePanel
                            defaultWidth={320}
                            minWidth={200}
                            maxWidth={600}
                            storageKey="email-builder-right-sidebar-width"
                            onResize={handleRightSidebarResize}
                            handleSide="left"
                            className="border-l bg-background"
                        >
                            <div className="h-full overflow-hidden flex flex-col pl-2">
                                <RightSidebar />
                            </div>
                        </ResizablePanel>
                    )}
                </div>
            </div>

            {/* Drag Overlay */}
            {mounted && createPortal(
                <DragOverlay>
                    {activeId ? (
                        <div className="p-2 border rounded bg-card text-xs text-center shadow-lg opacity-80 w-32">
                            {draggedBlockType || 'Block'}
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}

            {/* Template Selector Modal */}
            {!previewMode && (
                <TemplateSelector
                    open={templateSelectorOpen}
                    onOpenChange={setTemplateSelectorOpen}
                    onSelectTemplate={handleSelectTemplate}
                    currentTemplate={template}
                    storageCallbacks={templateStorageCallbacks}
                />
            )}
        </DndContext>
    );
}
