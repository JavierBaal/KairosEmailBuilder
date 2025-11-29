export type BlockType = 'text' | 'image' | 'button' | 'columns' | 'divider' | 'spacer' | 'social';

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

export interface EmailBuilderProps {
  value: EmailTemplate;
  onChange: (value: EmailTemplate) => void;
  onUploadImage?: (file: File) => Promise<string>;
  previewMode?: boolean;
}
