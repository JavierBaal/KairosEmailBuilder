import React from 'react';
import { EmailTemplate } from '../types';

interface CanvasProps {
    template: EmailTemplate;
}

export function Canvas({ template }: CanvasProps) {
    return (
        <div className="w-full max-w-[600px] min-h-[800px] bg-white shadow-lg rounded-sm p-4">
            {/* Renderizado de bloques irá aquí */}
            {template.root.children.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded">
                    Arrastra bloques aquí
                </div>
            ) : (
                <div>
                    {/* Mapeo de bloques */}
                    {template.root.children.map(block => (
                        <div key={block.id} className="p-2 border border-transparent hover:border-blue-500">
                            {block.type}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
