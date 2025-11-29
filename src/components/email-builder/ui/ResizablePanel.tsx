'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface ResizablePanelProps {
    children: React.ReactNode;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    storageKey?: string;
    onResize?: (width: number) => void;
    className?: string;
    handleSide?: 'left' | 'right'; // Lado donde está el handle (default: 'right')
}

export function ResizablePanel({ 
    children, 
    defaultWidth = 320,
    minWidth = 200,
    maxWidth = 800,
    storageKey,
    onResize,
    className,
    handleSide = 'right'
}: ResizablePanelProps) {
    const [width, setWidth] = useState(() => {
        if (storageKey && typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
                    return parsed;
                }
            }
        }
        return defaultWidth;
    });

    const [isResizing, setIsResizing] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Detener propagación para evitar conflictos con DndContext
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = width;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, [width]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startXRef.current;
        // Si el handle está a la izquierda, invertir el deltaX
        // (arrastrar hacia la izquierda debe expandir el sidebar)
        const adjustedDeltaX = handleSide === 'left' ? -deltaX : deltaX;
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + adjustedDeltaX));
        
        setWidth(newWidth);
        if (onResize) {
            onResize(newWidth);
        }
    }, [isResizing, minWidth, maxWidth, onResize, handleSide]);

    const handleMouseUp = useCallback(() => {
        if (isResizing) {
            setIsResizing(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            // Save to localStorage if storageKey is provided
            if (storageKey && typeof window !== 'undefined') {
                localStorage.setItem(storageKey, width.toString());
            }
        }
    }, [isResizing, storageKey, width]);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={panelRef}
            className={cn('relative flex-shrink-0', className)}
            style={{ width: `${width}px`, minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px` }}
        >
            {children}
            {/* Resize Handle - Posicionado en el espacio entre paneles con z-index muy alto */}
            <div
                onMouseDown={handleMouseDown}
                className={cn(
                    'absolute top-0 h-full cursor-col-resize transition-all group',
                    'hover:bg-blue-500/10',
                    isResizing && 'bg-blue-500/20'
                )}
                style={{
                    [handleSide === 'right' ? 'right' : 'left']: '-12px', // Más espacio para capturar eventos
                    width: '24px', // Área más grande para capturar fácilmente
                    touchAction: 'none',
                    zIndex: 100, // Muy alto para estar por encima de todo
                    pointerEvents: 'auto', // Asegurar que capture eventos
                    userSelect: 'none', // Prevent text selection during drag
                }}
                title="Drag to resize"
            >
                {/* Línea visual central */}
                <div 
                    className={cn(
                        'absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full transition-colors',
                        'bg-gray-300 hover:bg-blue-500',
                        isResizing && 'bg-blue-500'
                    )}
                />
                
                {/* Icono de resize - visible solo en hover */}
                <div 
                    className={cn(
                        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity',
                        'opacity-0 hover:opacity-100',
                        isResizing && 'opacity-100'
                    )}
                    style={{
                        pointerEvents: 'none',
                    }}
                >
                    <GripVertical 
                        size={16} 
                        className={cn(
                            'text-gray-400 transition-colors',
                            'hover:text-blue-500',
                            isResizing && 'text-blue-500'
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

