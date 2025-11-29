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
    deleteBlock: (blockId: string) => void;
}

const initialTemplate: EmailTemplate = {
    version: '1.0',
    root: {
        backgroundColor: '#ffffff',
        fontFamily: 'sans-serif',
        children: []
    }
};

// Maximum depth limit to prevent stack overflow
const MAX_DEPTH = 50;

// Helper to validate that an ID is not duplicated in the tree
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
        // Helper to find and remove a block from the tree
        const findAndRemove = (blocks: EmailBlock[], targetId: string, depth = 0): { found: EmailBlock | null; remaining: EmailBlock[] } => {
            if (depth > MAX_DEPTH) {
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
                    const result = findAndRemove(children, targetId, depth + 1);
                    if (result.found) {
                        const updatedBlocks = [...blocks];
                        updatedBlocks[i] = { ...blocks[i], children: result.remaining };
                        return { found: result.found, remaining: updatedBlocks };
                    }
                }
            }
            return { found: null, remaining: blocks };
        };

        // If block already exists, remove it first (moving existing block)
        let updatedRootChildren = state.template.root.children;
        if (!validateUniqueId(state.template.root.children, block.id)) {
            const removeResult = findAndRemove(state.template.root.children, block.id);
            if (removeResult.found) {
                updatedRootChildren = removeResult.remaining;
                // Use the existing block data instead of creating new one
                block = removeResult.found;
            }
        }

        // If no parentId, add to root
        if (!parentId) {
            const children = [...updatedRootChildren];
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

        // Find parent block recursively with depth limit
        const findAndInsert = (blocks: EmailBlock[], depth = 0): EmailBlock[] => {
            if (depth > MAX_DEPTH) {
                console.warn('Maximum depth reached. Block not inserted.');
                return blocks;
            }
            return blocks.map(b => {
                if (b.id === parentId) {
                    // Found parent, insert here
                    const children = b.children || [];
                    const insertIndex = index !== undefined && index >= 0 ? index : children.length;
                    const newChildren = [...children];
                    newChildren.splice(insertIndex, 0, block);
                    return { ...b, children: newChildren };
                }
                if (b.children) {
                    // Search recursively in children
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
                    children: findAndInsert(updatedRootChildren)
                }
            }
        };
    }),

    updateBlock: (blockId: string, props: Record<string, unknown>) => set((state) => {
        // Recursive update helper with depth limit
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
        // Helper function to find and extract a block from the tree with depth limit
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

        // Helper function to insert a block at a specific position with depth limit
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

            // Search recursively in children
            return blocks.map(b => {
                if (b.children) {
                    return { ...b, children: insertAt(b.children, block, targetId, depth + 1) };
                }
                return b;
            });
        };

        // Extract the block being moved
        const extractResult = findAndExtract(state.template.root.children, blockId);
        if (!extractResult.found) {
            return state; // Bloque no encontrado
        }

        // Insert the block at the new position
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

    deleteBlock: (blockId: string) => set((state) => {
        // Helper function to recursively find and remove a block
        const findAndRemove = (blocks: EmailBlock[], targetId: string, depth = 0): EmailBlock[] => {
            if (depth > MAX_DEPTH) {
                console.warn('Maximum depth reached in deleteBlock.');
                return blocks;
            }
            return blocks.filter(b => {
                if (b.id === targetId) return false;
                if (b.children && b.children.length > 0) {
                    b.children = findAndRemove(b.children, targetId, depth + 1);
                }
                return true;
            });
        };

        const updatedChildren = findAndRemove(state.template.root.children, blockId);

        return {
            template: {
                ...state.template,
                root: {
                    ...state.template.root,
                    children: updatedChildren
                }
            },
            // Clear selection if deleted block was selected
            selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId
        };
    }),
}));
