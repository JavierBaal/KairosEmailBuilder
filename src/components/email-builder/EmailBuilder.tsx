'use client';

import React, { useState, useEffect, useRef } from 'react';
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

/**
 * EmailBuilder Component
 * 
 * @param value - El template de email actual
 * @param onChange - Callback que se ejecuta cuando el template cambia
 * @param onUploadImage - Callback opcional para subir imágenes (no implementado aún)
 * @param previewMode - Si es true, oculta los paneles laterales y muestra solo el canvas
 */
export function EmailBuilder({ value, onChange, onUploadImage, previewMode = false }: EmailBuilderProps) {
    // onUploadImage está reservado para futura implementación de subida de imágenes
    // Se mantiene en la firma para compatibilidad futura
    if (onUploadImage) {
        // Futura implementación aquí
    }
    const {
        template,
        setTemplate,
        addBlock,
        moveBlock,
        setDraggedBlockType,
        draggedBlockType
    } = useEditorStore();

    // Usar useRef para evitar loops infinitos
    const previousTemplateRef = useRef<string>('');
    const isInternalUpdateRef = useRef(false);

    // Sync external value with internal store
    useEffect(() => {
        if (value) {
            const valueStr = JSON.stringify(value);
            // Solo actualizar si el valor externo realmente cambió y no fue un cambio interno
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
        // Solo llamar onChange si el template realmente cambió
        if (templateStr !== previousTemplateRef.current) {
            isInternalUpdateRef.current = true;
            previousTemplateRef.current = templateStr;
            onChange(template);
        }
    }, [template, onChange]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [mounted] = useState(true); // Inicializar directamente, no hay SSR issues aquí

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

        if (!over) {
            setActiveId(null);
            setDraggedBlockType(null);
            return;
        }

        // Case 1: Dropping a sidebar item onto the canvas (creation)
        if (active.data.current?.type && !active.data.current?.isBlock) {
            if (over.id === 'canvas-droppable' || over.data.current?.isBlock) {
                const type = active.data.current?.type;
                if (type) {
                    const newBlock: EmailBlock = {
                        id: `block-${Date.now()}`,
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
            moveBlock(active.id as string, over.id as string);
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
                        <Button variant="outline" size="sm" onClick={handleExportJson}>
                            <Code size={16} className="mr-2" /> Export JSON
                        </Button>
                        <Button size="sm" onClick={handleExportHtml}>
                            <Download size={16} className="mr-2" /> Export HTML
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Blocks */}
                    {!previewMode && (
                        <div className="w-64 border-r bg-muted/10">
                            <LeftSidebar />
                        </div>
                    )}

                    {/* Center Canvas */}
                    <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center">
                        <Canvas template={template} />
                    </div>

                    {/* Right Sidebar - Properties */}
                    {!previewMode && (
                        <div className="w-80 border-l bg-background">
                            <RightSidebar />
                        </div>
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
        </DndContext>
    );
}
