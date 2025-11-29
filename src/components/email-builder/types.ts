export type BlockType = 'text' | 'image' | 'button' | 'columns' | 'divider' | 'spacer' | 'social-links' | 'footer' | 'header';

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

export interface SocialLinksBlockProps {
  links?: Array<{
    platform: 'facebook' | 'x' | 'instagram' | 'linkedin' | 'youtube' | 'custom';
    url: string;
    iconUrl?: string; // For custom icons
  }>;
  iconSize?: string; // e.g., '24px', '32px'
  iconColor?: string; // Icon color
  spacing?: string; // Space between icons
  align?: 'left' | 'center' | 'right';
  padding?: string;
}

export interface FooterBlockProps {
  companyName?: string;
  companyAddress?: string;
  copyrightText?: string;
  unsubscribeUrl?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  padding?: string;
  showUnsubscribe?: boolean;
  showPrivacyPolicy?: boolean;
  showTerms?: boolean;
}

export interface HeaderBlockProps {
  logoUrl?: string;
  logoAlt?: string;
  logoWidth?: string;
  logoHeight?: string;
  showMenu?: boolean;
  menuItems?: Array<{
    label: string;
    url: string;
  }>;
  backgroundColor?: string;
  padding?: string;
  align?: 'left' | 'center' | 'right';
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
