'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface ResizableCanvasProps {
    children: React.ReactNode;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    storageKey?: string;
    onResizeLeft?: (delta: number) => void; // Negative delta when dragging right
    onResizeRight?: (delta: number) => void; // Positive delta when dragging left
    onWidthChange?: (width: number) => void; // Callback when Canvas width changes
    className?: string;
}

export function ResizableCanvas({ 
    children, 
    defaultWidth = 600,
    minWidth = 400,
    maxWidth = 1200,
    storageKey = 'email-builder-canvas-width',
    onResizeLeft,
    onResizeRight,
    onWidthChange,
    className
}: ResizableCanvasProps) {
    const [width, setWidth] = useState(() => {
        if (typeof window !== 'undefined') {
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
    const [resizeSide, setResizeSide] = useState<'left' | 'right' | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    const handleMouseDown = useCallback((side: 'left' | 'right') => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeSide(side);
        startXRef.current = e.clientX;
        startWidthRef.current = width;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, [width]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing || !resizeSide) return;

        let deltaX: number;
        if (resizeSide === 'right') {
            // Right handle: dragging left reduces Canvas
            deltaX = e.clientX - startXRef.current;
        } else {
            // Left handle: dragging right reduces Canvas
            deltaX = startXRef.current - e.clientX;
        }
        
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
        const actualDelta = newWidth - startWidthRef.current;
        
        setWidth(newWidth);
        
        // Notify Canvas width change
        if (onWidthChange && actualDelta !== 0) {
            onWidthChange(newWidth);
        }
        
        // Notify parent component to adjust sidebars
        // When Canvas reduces (negative actualDelta), sidebar should expand
        // Therefore, pass -actualDelta so sidebar grows when Canvas reduces
        if (resizeSide === 'right' && onResizeRight && actualDelta !== 0) {
            onResizeRight(-actualDelta); // Negative delta to expand sidebar when Canvas reduces
        } else if (resizeSide === 'left' && onResizeLeft && actualDelta !== 0) {
            onResizeLeft(-actualDelta); // Negative delta to expand sidebar when Canvas reduces
        }
    }, [isResizing, resizeSide, minWidth, maxWidth, onResizeLeft, onResizeRight, onWidthChange]);

    const handleMouseUp = useCallback(() => {
        if (isResizing) {
            setIsResizing(false);
            setResizeSide(null);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
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

    const ResizeHandle = ({ side }: { side: 'left' | 'right' }) => (
        <div
            onMouseDown={handleMouseDown(side)}
            className={cn(
                'absolute top-0 h-full cursor-col-resize transition-all group',
                'hover:bg-blue-500/10',
                isResizing && resizeSide === side && 'bg-blue-500/20',
                side === 'left' ? 'left-0' : 'right-0'
            )}
            style={{
                width: '12px',
                [side === 'left' ? 'marginLeft' : 'marginRight']: '-6px',
                touchAction: 'none',
                zIndex: 50,
                pointerEvents: 'auto',
            }}
            title="Drag to resize canvas"
        >
            {/* Central visual line */}
            <div 
                className={cn(
                    'absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full transition-colors',
                    'bg-gray-300 group-hover:bg-blue-500',
                    isResizing && resizeSide === side && 'bg-blue-500'
                )}
            />
            
            {/* Resize icon - visible only on hover */}
            <div 
                className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity',
                    'opacity-0 group-hover:opacity-100',
                    isResizing && resizeSide === side && 'opacity-100'
                )}
                style={{
                    pointerEvents: 'none',
                }}
            >
                <GripVertical 
                    size={16} 
                    className={cn(
                        'text-gray-400 transition-colors',
                        'group-hover:text-blue-500',
                        isResizing && resizeSide === side && 'text-blue-500'
                    )}
                />
            </div>
        </div>
    );

    return (
        <div
            ref={canvasRef}
            className={cn('relative mx-auto', className)}
            style={{ 
                width: `${width}px`, 
                minWidth: `${minWidth}px`, 
                maxWidth: `${maxWidth}px` 
            }}
        >
            {/* Left handle */}
            <ResizeHandle side="left" />
            
            {/* Canvas content */}
            {children}
            
            {/* Right handle */}
            <ResizeHandle side="right" />
        </div>
    );
}

