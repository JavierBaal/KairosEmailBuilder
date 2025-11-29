export type BlockType = 'text' | 'image' | 'button' | 'columns' | 'divider' | 'spacer';

export interface EmailBlock {
  id: string;
  type: BlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  children?: EmailBlock[]; // Para columnas o contenedores
}

export interface EmailTemplate {
  version: string;
  root: {
    backgroundColor: string;
    fontFamily: string;
    children: EmailBlock[];
  };
}

export interface ColumnsBlockProps {
  columnCount?: 2 | 3 | 4;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
}

export interface SavedTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'predefined' | 'user';
  thumbnail?: string; // Base64 o URL
  template: EmailTemplate;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateStorageCallbacks {
  onSaveTemplate?: (template: SavedTemplate) => Promise<void>;
  onLoadTemplates?: () => Promise<SavedTemplate[]>;
  onDeleteTemplate?: (templateId: string) => Promise<void>;
}

export interface EmailBuilderProps {
  value: EmailTemplate;
  onChange: (value: EmailTemplate) => void;
  onUploadImage?: (file: File) => Promise<string>;
  previewMode?: boolean;
  templateStorageCallbacks?: TemplateStorageCallbacks;
}
