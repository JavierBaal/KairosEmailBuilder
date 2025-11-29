# Kairos Email Builder - Developer Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [API Reference](#api-reference)
6. [Implementation Tutorial](#implementation-tutorial)
7. [Extending the Builder](#extending-the-builder)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Kairos Email Builder is a lightweight, native React email builder component designed for Next.js applications. It provides a drag-and-drop interface for creating email templates that export to HTML compatible with major email clients.

### Key Features

- **Drag & Drop Interface**: Smooth, intuitive drag-and-drop powered by `@dnd-kit`
- **Lightweight**: No heavy external dependencies like GrapesJS or iframe wrappers
- **Modern Stack**: Built for Next.js 15, React 19, TypeScript (strict mode)
- **Email-Ready Output**: Exports to table-based HTML compatible with Outlook, Gmail, etc.
- **JSON State**: Templates saved as structured JSON for easy persistence
- **Template System**: Predefined templates and custom template saving
- **Professional Blocks**: Header, Footer, Social Links, Columns, and more

---

## Architecture

### Component Structure

```
EmailBuilder (Main Container)
├── LeftSidebar (Blocks Palette)
├── Canvas (Drop Zone)
│   └── BlockRenderer (Recursive Block Rendering)
└── RightSidebar (Properties Panel)
```

### State Management

The builder uses **Zustand** for state management with the following store structure:

```typescript
interface EditorStore {
  template: EmailTemplate;
  selectedBlockId: string | null;
  draggedBlockType: BlockType | null;
  setTemplate: (template: EmailTemplate) => void;
  addBlock: (block: EmailBlock, parentId?: string, index?: number) => void;
  updateBlock: (id: string, props: Record<string, unknown>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, newParentId: string, newIndex: number) => void;
  selectBlock: (id: string | null) => void;
  setDraggedBlockType: (type: BlockType | null) => void;
}
```

### Data Structure

#### EmailTemplate

```typescript
interface EmailTemplate {
  version: string;
  root: {
    backgroundColor: string;
    fontFamily: string;
    children: EmailBlock[];
  };
}
```

#### EmailBlock

```typescript
interface EmailBlock {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
  children?: EmailBlock[]; // For nested blocks (columns)
}

type BlockType = 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'columns' 
  | 'divider' 
  | 'spacer' 
  | 'social-links' 
  | 'footer' 
  | 'header';
```

---

## Installation

### Prerequisites

- Node.js 18+ 
- Next.js 15+
- React 19+
- TypeScript 5+

### Install Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install zustand
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-color @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-text-style @tiptap/extension-underline
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-switch
```

### Project Setup

1. Clone the repository or copy the `src/components/email-builder` directory to your project
2. Ensure you have Tailwind CSS configured
3. Install Shadcn UI components (or copy from `src/components/ui`)

---

## Quick Start

### Basic Usage

```tsx
import { EmailBuilder } from '@/components/email-builder';
import { useState } from 'react';
import type { EmailTemplate } from '@/components/email-builder/types';

const initialTemplate: EmailTemplate = {
  version: '1.0',
  root: {
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    children: []
  }
};

export default function EmailEditorPage() {
  const [template, setTemplate] = useState<EmailTemplate>(initialTemplate);

  return (
    <div className="h-screen">
      <EmailBuilder 
        value={template} 
        onChange={setTemplate}
      />
    </div>
  );
}
```

### With Image Upload

```tsx
<EmailBuilder 
  value={template} 
  onChange={setTemplate}
  onUploadImage={async (file: File) => {
    // Upload to your storage service
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.url; // Return the image URL
  }}
/>
```

### With Template Storage

```tsx
<EmailBuilder 
  value={template} 
  onChange={setTemplate}
  templateStorageCallbacks={{
    onSaveTemplate: async (template) => {
      // Save to your database
      await fetch('/api/templates', {
        method: 'POST',
        body: JSON.stringify(template)
      });
    },
    onLoadTemplates: async () => {
      // Load from your database
      const response = await fetch('/api/templates');
      return response.json();
    },
    onDeleteTemplate: async (templateId) => {
      // Delete from your database
      await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
      });
    }
  }}
/>
```

---

## API Reference

### EmailBuilder Component

#### Props

```typescript
interface EmailBuilderProps {
  value: EmailTemplate;
  onChange: (value: EmailTemplate) => void;
  onUploadImage?: (file: File) => Promise<string>;
  previewMode?: boolean;
  templateStorageCallbacks?: TemplateStorageCallbacks;
}
```

#### Props Description

- **`value`** (required): The current email template state
- **`onChange`** (required): Callback fired when template changes
- **`onUploadImage`** (optional): Callback for handling image uploads. Must return a Promise resolving to the image URL
- **`previewMode`** (optional): If `true`, hides sidebars and shows only the canvas
- **`templateStorageCallbacks`** (optional): Callbacks for external template storage integration

### Template Storage Callbacks

```typescript
interface TemplateStorageCallbacks {
  onSaveTemplate?: (template: SavedTemplate) => Promise<void>;
  onLoadTemplates?: () => Promise<SavedTemplate[]>;
  onDeleteTemplate?: (templateId: string) => Promise<void>;
}
```

If callbacks are not provided, the builder falls back to `localStorage` automatically.

### HTML Generation

```typescript
import { generateHtml } from '@/utils/html-generator';

const htmlString = generateHtml(template);
// Returns complete HTML email with DOCTYPE, head, and body
```

The generated HTML uses table-based layout for maximum email client compatibility.

---

## Implementation Tutorial

### Step 1: Basic Integration

Create a new page in your Next.js app:

```tsx
// app/email-editor/page.tsx
'use client';

import { EmailBuilder } from '@/components/email-builder';
import { useState } from 'react';
import type { EmailTemplate } from '@/components/email-builder/types';

export default function EmailEditorPage() {
  const [template, setTemplate] = useState<EmailTemplate>({
    version: '1.0',
    root: {
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      children: []
    }
  });

  return (
    <div className="h-screen w-screen">
      <EmailBuilder 
        value={template} 
        onChange={setTemplate}
      />
    </div>
  );
}
```

### Step 2: Add Persistence

Save templates to your backend:

```tsx
import { useEffect } from 'react';

export default function EmailEditorPage() {
  const [template, setTemplate] = useState<EmailTemplate>(/* ... */);
  const [isLoading, setIsLoading] = useState(true);

  // Load template on mount
  useEffect(() => {
    async function loadTemplate() {
      const response = await fetch('/api/templates/current');
      const data = await response.json();
      if (data.template) {
        setTemplate(data.template);
      }
      setIsLoading(false);
    }
    loadTemplate();
  }, []);

  // Save template on change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetch('/api/templates/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template })
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [template]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-screen w-screen">
      <EmailBuilder value={template} onChange={setTemplate} />
    </div>
  );
}
```

### Step 3: Add Image Upload

Create an API route for image uploads:

```tsx
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Upload to your storage (AWS S3, Cloudinary, etc.)
  const url = await uploadToStorage(file);

  return NextResponse.json({ url });
}
```

Then use it in the EmailBuilder:

```tsx
<EmailBuilder 
  value={template} 
  onChange={setTemplate}
  onUploadImage={async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.url;
  }}
/>
```

### Step 4: Export HTML

Add an export button:

```tsx
import { generateHtml } from '@/utils/html-generator';

function ExportButton({ template }: { template: EmailTemplate }) {
  const handleExport = () => {
    const html = generateHtml(template);
    
    // Download as file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport}>
      Export HTML
    </button>
  );
}
```

---

## Extending the Builder

### Adding a New Block Type

#### Step 1: Update Types

Add your block type to `types.ts`:

```typescript
export type BlockType = 
  | 'text' 
  | 'image' 
  // ... existing types
  | 'your-new-block'; // Add here

export interface YourNewBlockProps {
  // Define your block's props
  title?: string;
  content?: string;
  // ...
}
```

#### Step 2: Create Block Component

Create `src/components/email-builder/blocks/YourNewBlock.tsx`:

```tsx
import React from 'react';
import { EmailBlock } from '../types';

interface YourNewBlockProps {
  block: EmailBlock;
}

export function YourNewBlock({ block }: YourNewBlockProps) {
  const {
    title = 'Default Title',
    content = ''
  } = block.props as {
    title?: string;
    content?: string;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}
```

#### Step 3: Create Properties Component

Create `src/components/email-builder/properties/YourNewBlockProperties.tsx`:

```tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { YourNewBlockProps } from '../types';

interface YourNewBlockPropertiesProps {
  props: YourNewBlockProps;
  onChange: (props: Partial<YourNewBlockProps>) => void;
}

export function YourNewBlockProperties({ props, onChange }: YourNewBlockPropertiesProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={props.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <Input
          value={props.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
        />
      </div>
    </div>
  );
}
```

#### Step 4: Add HTML Generation

Update `src/utils/html-generator.ts`:

```typescript
const renderYourNewBlock = (block: EmailBlock): string => {
  const title = block.props?.title || 'Default Title';
  const content = block.props?.content || '';

  return `
    <tr>
      <td style="padding: 20px;">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(content)}</p>
      </td>
    </tr>
  `;
};

// Add case in renderBlock switch:
case 'your-new-block':
  blockHtml = renderYourNewBlock(block);
  break;
```

#### Step 5: Integrate Components

1. **BlockRenderer**: Add case in `renderBlockContent()`
2. **RightSidebar**: Add case in properties rendering
3. **LeftSidebar**: Add `DraggableBlock` for your block type
4. **blocks/index.ts**: Export your block component

---

## Best Practices

### 1. Always Validate URLs

```typescript
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.href);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}
```

### 2. Escape HTML in Generated HTML

Always use `escapeHtml()` when generating HTML to prevent XSS:

```typescript
import { escapeHtml } from '@/utils/html-generator';

const safeContent = escapeHtml(userInput);
```

### 3. Provide Default Values

Always provide sensible defaults for block props:

```typescript
const {
  text = 'Default text',
  color = '#000000',
  fontSize = '16px'
} = block.props;
```

### 4. Handle Empty States

Show helpful placeholders when blocks have no content:

```tsx
{!content && (
  <div style={{ 
    padding: '20px', 
    border: '1px dashed #ccc',
    color: '#999',
    textAlign: 'center'
  }}>
    Add content here
  </div>
)}
```

### 5. Use Table-Based HTML for Email

Email clients have limited CSS support. Always use tables for layout:

```html
<table border="0" cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td>Content here</td>
  </tr>
</table>
```

---

## Troubleshooting

### Issue: Blocks not rendering

**Solution**: Ensure the block type is added to:
- `BlockRenderer.tsx` switch statement
- `RightSidebar.tsx` properties rendering
- `LeftSidebar.tsx` draggable blocks
- `html-generator.ts` render functions

### Issue: Drag and drop not working

**Solution**: 
- Ensure `DndContext` wraps the entire EmailBuilder
- Check that `useSensor(PointerSensor)` is configured
- Verify block IDs are unique

### Issue: HTML not rendering in email clients

**Solution**:
- Use table-based layouts
- Avoid CSS Grid or Flexbox
- Use inline styles
- Test in multiple email clients

### Issue: Template not saving

**Solution**:
- Check `onChange` callback is firing
- Verify template structure matches `EmailTemplate` interface
- Check browser console for errors

### Issue: Images not loading

**Solution**:
- Ensure image URLs are absolute (not relative)
- Check CORS settings if hosting images externally
- Verify `onUploadImage` callback returns valid URL

---

## Additional Resources

- [dnd-kit Documentation](https://docs.dndkit.com/)
- [TipTap Documentation](https://tiptap.dev/)
- [Email HTML Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding/)
- [Can I Email](https://www.caniemail.com/) - CSS support in email clients

---

## Support

For issues, questions, or contributions, please visit our [GitHub repository](https://github.com/yourusername/kairos-email-builder) or refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) guide.

