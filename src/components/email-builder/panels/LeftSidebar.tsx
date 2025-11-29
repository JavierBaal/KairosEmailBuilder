import React from 'react';

export function LeftSidebar() {
    return (
        <div className="p-4">
            <h2 className="text-sm font-semibold mb-4">Bloques</h2>
            <div className="grid grid-cols-2 gap-2">
                {/* Placeholder para items arrastrables */}
                <div className="p-2 border rounded bg-card text-xs text-center cursor-move">Texto</div>
                <div className="p-2 border rounded bg-card text-xs text-center cursor-move">Imagen</div>
                <div className="p-2 border rounded bg-card text-xs text-center cursor-move">Botón</div>
                <div className="p-2 border rounded bg-card text-xs text-center cursor-move">Columnas</div>
            </div>
        </div>
    );
}
