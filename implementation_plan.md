# Implementation Plan - Drag & Drop Core

# Goal Description
Implement the core Drag-and-Drop functionality using `@dnd-kit`. This involves setting up the `DndContext`, making sidebar items draggable, and making the canvas droppable. The goal is to allow users to drag block types from the sidebar and drop them onto the canvas to add them to the email template.

## User Review Required
> [!IMPORTANT]
> **Internal Documentation Privacy**: `memory-bank/` and `.clinerules` have been strictly added to `.gitignore`. Ensure you do not force-add these files to git.

## Proposed Changes

### Core Components

#### [MODIFY] [EmailBuilder.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/EmailBuilder.tsx)
- Wrap the layout in `DndContext`.
- Implement `onDragEnd` handler to detect drops.
- Manage `activeId` state for drag overlays.

#### [MODIFY] [LeftSidebar.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/panels/LeftSidebar.tsx)
- Create a `DraggableBlock` component wrapper using `useDraggable`.
- Replace static placeholders with draggable items.

#### [MODIFY] [Canvas.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/canvas/Canvas.tsx)
- Implement `useDroppable` to make the canvas a valid drop zone.
- Render the list of blocks from the template state.
- (Future) Add `SortableContext` for reordering (next phase, starting with basic drop first).

#### [NEW] [useEditorState.ts](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/hooks/useEditorState.ts)
- Create a hook/store (Zustand or local state) to manage the `EmailTemplate` JSON tree.
- Implement actions: `addBlock`, `moveBlock`, `updateBlock`.

### Types

#### [MODIFY] [types.ts](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/types.ts)
- Ensure block types match the PRD requirements.

## Verification Plan

### Automated Tests
- N/A for this phase (Visual interaction focus).

### Manual Verification
1.  **Drag Start**: Verify that dragging an item from the sidebar creates a visual ghost/overlay.
2.  **Drop Zone**: Verify that the canvas highlights or indicates it is a valid drop target.
3.  **Drop Action**: Verify that dropping an item adds a new block to the canvas list.
4.  **Console Logs**: Check for any `dnd-kit` warnings or errors.
