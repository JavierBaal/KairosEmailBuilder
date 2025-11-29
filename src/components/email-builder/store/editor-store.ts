import { create } from 'zustand';
import { EmailTemplate, EmailBlock, BlockType } from '../types';

interface EditorState {
    template: EmailTemplate;
    selectedBlockId: string | null;
    draggedBlockType: BlockType | null;

    // Actions
    setTemplate: (template: EmailTemplate) => void;
    addBlock: (block: EmailBlock, parentId?: string, index?: number) => void;
    updateBlock: (blockId: string, props: Record<string, any>) => void;
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

export const useEditorStore = create<EditorState>((set) => ({
    template: initialTemplate,
    selectedBlockId: null,
    draggedBlockType: null,

    setTemplate: (template) => set({ template }),

    addBlock: (block, parentId, index) => set((state) => {
        // Simple implementation: always add to root for now
        // TODO: Implement nested insertion logic
        return {
            template: {
                ...state.template,
                root: {
                    ...state.template.root,
                    children: [...state.template.root.children, block]
                }
            }
        };
    }),

    updateBlock: (blockId, props) => set((state) => {
        // Recursive update helper
        const updateInList = (blocks: EmailBlock[]): EmailBlock[] => {
            return blocks.map(b => {
                if (b.id === blockId) {
                    return { ...b, props: { ...b.props, ...props } };
                }
                if (b.children) {
                    return { ...b, children: updateInList(b.children) };
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
        const oldIndex = state.template.root.children.findIndex(b => b.id === blockId);
        const newIndex = state.template.root.children.findIndex(b => b.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
            // We need to import arrayMove dynamically or implement a simple version since we can't easily add imports to top of file with this tool
            // Simple array move implementation:
            const newChildren = [...state.template.root.children];
            const [movedItem] = newChildren.splice(oldIndex, 1);
            newChildren.splice(newIndex, 0, movedItem);

            return {
                template: {
                    ...state.template,
                    root: {
                        ...state.template.root,
                        children: newChildren
                    }
                }
            };
        }
        return state;
    }),

    selectBlock: (blockId) => set({ selectedBlockId: blockId }),

    setDraggedBlockType: (type) => set({ draggedBlockType: type }),
}));
