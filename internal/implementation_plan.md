# Implementation Plan - Kairos Email Builder Core

# Goal Description
Implement the core functionality of the Email Builder, transforming the static scaffolding into a working Drag-and-Drop editor. This includes the Drag & Drop engine, global state management for the email JSON tree, and the rendering logic for blocks.

## User Review Required
> [!IMPORTANT]
> **Strict English Policy**: All code, comments, and public documentation must be in English.
> **Internal Docs**: `memory-bank/` and `.clinerules` are excluded from the public repo.

## Proposed Changes

### Phase 1: Drag & Drop Core (Current Focus)
The goal is to enable dragging items from the Sidebar and dropping them onto the Canvas to create new blocks.

#### [MODIFY] [Canvas.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/canvas/Canvas.tsx)
- Implement `useDroppable` from `@dnd-kit/core`.
- Update rendering to map through `template.root.children`.
- Add visual cues for "Drop Here" state.

#### [VERIFY] [EmailBuilder.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/EmailBuilder.tsx)
- Ensure `DndContext` is correctly configured with sensors.
- Verify `onDragEnd` logic correctly creates new blocks in the state.

### Phase 2: State Management
Move the state logic out of `EmailBuilder.tsx` into a dedicated store for better scalability and performance.

#### [NEW] [useEditorStore.ts](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/store/editor-store.ts)
- Implement a Zustand store `useEditorStore`.
- State: `emailTemplate`, `selectedBlockId`, `draggedBlockType`.
- Actions: `addBlock`, `updateBlock`, `moveBlock`, `deleteBlock`, `selectBlock`.

#### [MODIFY] [EmailBuilder.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/EmailBuilder.tsx)
- Connect to `useEditorStore`.
- Remove local state management for template.

### Phase 3: Block Rendering
Create the actual visual components for the blocks.

#### [NEW] [BlockRenderer.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/canvas/BlockRenderer.tsx)
- A component that takes a `EmailBlock` and renders the appropriate component based on `type`.
- Handles "Selection" state (blue border/outline).

#### [NEW] [TextBlock.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/blocks/TextBlock.tsx)
- Basic text rendering with `dangerouslySetInnerHTML` (sanitized) or simple text for now.

#### [NEW] [ImageBlock.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/blocks/ImageBlock.tsx)
- Renders `<img>` tag with styles.

#### [NEW] [ButtonBlock.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/blocks/ButtonBlock.tsx)
- Renders `<a>` tag styled as a button.

### Phase 4: Properties Panel
Allow editing the selected block.

#### [MODIFY] [RightSidebar.tsx](file:///h:/RoomFactorPoyects/KairosEmailBuilder/src/components/email-builder/panels/RightSidebar.tsx)
- Connect to `useEditorStore` to get `selectedBlockId`.
- Render inputs based on the selected block type (e.g., Text input for TextBlock, URL input for ImageBlock).

## Verification Plan

### Automated Tests
- *Pending setup of Jest/Vitest.*

### Manual Verification
1.  **Drag & Drop**:
    - Drag "Button" from sidebar.
    - Drop on Canvas.
    - Verify a new Button appears on the canvas.
2.  **Selection**:
    - Click the new Button.
    - Verify it gets a blue outline.
    - Verify Right Sidebar shows "Button Properties".
3.  **Persistence**:
    - Verify `onChange` prop is called with the updated JSON.
