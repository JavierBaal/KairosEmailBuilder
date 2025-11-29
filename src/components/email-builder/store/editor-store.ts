import { create } from 'zustand';
import { EmailTemplate, EmailBlock, BlockType } from '../types';

interface EditorState {
    template: EmailTemplate;
    selectedBlockId: string | null;
    draggedBlockType: BlockType | null;

    // Actions
    setTemplate: (template: EmailTemplate) => void;
    addBlock: (block: EmailBlock, parentId?: string, index?: number) => void;
    updateBlock: (blockId: string, props: Record<string, unknown>) => void;
    moveBlock: (blockId: string, overId: string) => void;
    selectBlock: (blockId: string | null) => void;
    setDraggedBlockType: (type: BlockType | null) => void;
}

const initialTemplate: EmailTemplate = {
    version: '1.0',
    root: {
        backgroundColor: '#ffffff',
        fontFamily: 'sans-serif',
        children: []
    }
};

// Límite máximo de profundidad para prevenir stack overflow
const MAX_DEPTH = 50;

// Helper para validar que un ID no esté duplicado en el árbol
const validateUniqueId = (blocks: EmailBlock[], id: string, depth = 0): boolean => {
    if (depth > MAX_DEPTH) return false;
    for (const block of blocks) {
        if (block.id === id) return false;
        if (block.children) {
            if (!validateUniqueId(block.children, id, depth + 1)) return false;
        }
    }
    return true;
};

export const useEditorStore = create<EditorState>((set) => ({
    template: initialTemplate,
    selectedBlockId: null,
    draggedBlockType: null,

    setTemplate: (template) => set({ template }),

    addBlock: (block, parentId, index) => set((state) => {
        // Validar que el ID del bloque sea único
        if (!validateUniqueId(state.template.root.children, block.id)) {
            console.warn(`Block ID ${block.id} already exists. Generating new ID.`);
            block = { ...block, id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
        }

        // Si no hay parentId, añadir al root
        if (!parentId) {
            const children = [...state.template.root.children];
            const insertIndex = index !== undefined && index >= 0 ? index : children.length;
            children.splice(insertIndex, 0, block);
            return {
                template: {
                    ...state.template,
                    root: {
                        ...state.template.root,
                        children
                    }
                }
            };
        }

        // Buscar el bloque padre recursivamente con límite de profundidad
        const findAndInsert = (blocks: EmailBlock[], depth = 0): EmailBlock[] => {
            if (depth > MAX_DEPTH) {
                console.warn('Maximum depth reached. Block not inserted.');
                return blocks;
            }
            return blocks.map(b => {
                if (b.id === parentId) {
                    // Encontrado el padre, insertar aquí
                    const children = b.children || [];
                    const insertIndex = index !== undefined && index >= 0 ? index : children.length;
                    const newChildren = [...children];
                    newChildren.splice(insertIndex, 0, block);
                    return { ...b, children: newChildren };
                }
                if (b.children) {
                    // Buscar recursivamente en hijos
                    return { ...b, children: findAndInsert(b.children, depth + 1) };
                }
                return b;
            });
        };

        return {
            template: {
                ...state.template,
                root: {
                    ...state.template.root,
                    children: findAndInsert(state.template.root.children)
                }
            }
        };
    }),

    updateBlock: (blockId: string, props: Record<string, unknown>) => set((state) => {
        // Recursive update helper con límite de profundidad
        const updateInList = (blocks: EmailBlock[], depth = 0): EmailBlock[] => {
            if (depth > MAX_DEPTH) {
                console.warn('Maximum depth reached in updateBlock.');
                return blocks;
            }
            return blocks.map(b => {
                if (b.id === blockId) {
                    return { ...b, props: { ...b.props, ...props } };
                }
                if (b.children) {
                    return { ...b, children: updateInList(b.children, depth + 1) };
                }
                return b;
            });
        };

        return {
            template: {
                ...state.template,
                root: {
                    ...state.template.root,
                    children: updateInList(state.template.root.children)
                }
            }
        };
    }),

    moveBlock: (blockId, overId) => set((state) => {
        // Función helper para encontrar y extraer un bloque del árbol con límite de profundidad
        const findAndExtract = (blocks: EmailBlock[], targetId: string, depth = 0): { found: EmailBlock | null; remaining: EmailBlock[] } => {
            if (depth > MAX_DEPTH) {
                console.warn('Maximum depth reached in moveBlock.');
                return { found: null, remaining: blocks };
            }
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].id === targetId) {
                    const found = blocks[i];
                    const remaining = [...blocks];
                    remaining.splice(i, 1);
                    return { found, remaining };
                }
                const children = blocks[i].children;
                if (children && children.length > 0) {
                    const result = findAndExtract(children, targetId, depth + 1);
                    if (result.found) {
                        const updatedBlocks = [...blocks];
                        updatedBlocks[i] = { ...blocks[i], children: result.remaining };
                        return { found: result.found, remaining: updatedBlocks };
                    }
                }
            }
            return { found: null, remaining: blocks };
        };

        // Función helper para insertar un bloque en una posición específica con límite de profundidad
        const insertAt = (blocks: EmailBlock[], block: EmailBlock, targetId: string, depth = 0): EmailBlock[] => {
            if (depth > MAX_DEPTH) {
                console.warn('Maximum depth reached in insertAt.');
                return blocks;
            }
            const targetIndex = blocks.findIndex(b => b.id === targetId);
            if (targetIndex !== -1) {
                const newBlocks = [...blocks];
                newBlocks.splice(targetIndex, 0, block);
                return newBlocks;
            }

            // Buscar recursivamente en hijos
            return blocks.map(b => {
                if (b.children) {
                    return { ...b, children: insertAt(b.children, block, targetId, depth + 1) };
                }
                return b;
            });
        };

        // Extraer el bloque que se está moviendo
        const extractResult = findAndExtract(state.template.root.children, blockId);
        if (!extractResult.found) {
            return state; // Bloque no encontrado
        }

        // Insertar el bloque en la nueva posición
        const updatedChildren = insertAt(extractResult.remaining, extractResult.found, overId);

        return {
            template: {
                ...state.template,
                root: {
                    ...state.template.root,
                    children: updatedChildren
                }
            }
        };
    }),

    selectBlock: (blockId) => set({ selectedBlockId: blockId }),

    setDraggedBlockType: (type) => set({ draggedBlockType: type }),
}));
