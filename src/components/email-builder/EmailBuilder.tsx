'use client';

import React from 'react';
import { EmailBuilderProps } from './types';
import { LeftSidebar } from './panels/LeftSidebar';
import { RightSidebar } from './panels/RightSidebar';
import { Canvas } from './canvas/Canvas';
import { DndContext } from '@dnd-kit/core';

export function EmailBuilder({ value, onChange, onUploadImage, previewMode = false }: EmailBuilderProps) {
    return (
        <DndContext>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                {/* Sidebar Izquierdo - Bloques */}
                {!previewMode && (
                    <div className="w-64 border-r bg-muted/10">
                        <LeftSidebar />
                    </div>
                )}

                {/* Canvas Central */}
                <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center">
                    <Canvas template={value} />
                </div>

                {/* Sidebar Derecho - Propiedades */}
                {!previewMode && (
                    <div className="w-80 border-l bg-background">
                        <RightSidebar />
                    </div>
                )}
            </div>
        </DndContext>
    );
}
