# Patrones del Sistema y Arquitectura

## Arquitectura del Componente `<EmailBuilder />`

El componente principal funcionará como un orquestador de estado que envuelve tres sub-áreas principales.

### Estructura de Componentes
```mermaid
graph TD
    EmailBuilder[EmailBuilder (Main Container)]
    StateProvider[EditorStateProvider (Context/Zustand)]
    
    EmailBuilder --> StateProvider
    StateProvider --> LeftSidebar[Blocks Palette]
    StateProvider --> Canvas[Editor Canvas (Drop Zone)]
    StateProvider --> RightSidebar[Properties Panel]
    
    Canvas --> BlockRenderer[Block Renderer]
    BlockRenderer --> |Renderiza| TextBlock
    BlockRenderer --> |Renderiza| ImageBlock
    BlockRenderer --> |Renderiza| ButtonBlock
    
    RightSidebar --> |Edita| SelectedBlockProps
```

### Flujo de Datos
1.  **Input:** `initialValue` (JSON) entra al `EmailBuilder`.
2.  **Estado Interno:** Se gestiona una copia local del JSON optimizada para edición (añadiendo IDs temporales, estado de selección, etc.).
3.  **Interacción:**
    *   **Drag:** Usuario arrastra desde `LeftSidebar`.
    *   **Drop:** `Canvas` detecta la caída y actualiza el árbol JSON.
    *   **Select:** Clic en un bloque en `Canvas` establece `selectedBlockId`.
    *   **Edit:** Cambios en `RightSidebar` actualizan las propiedades del bloque en el árbol JSON.
4.  **Output:** `onChange` emite el árbol JSON limpio hacia el componente padre.

### Estructura de Datos (Schema JSON)
```typescript
type EmailTemplate = {
  version: string;
  root: {
    backgroundColor: string;
    fontFamily: string;
    children: EmailBlock[];
  }
}

type EmailBlock = {
  id: string;
  type: 'text' | 'image' | 'button' | 'columns' | 'divider' | 'spacer' | 'social-links' | 'footer' | 'header';
  props: Record<string, any>; // Propiedades específicas (content, src, styles)
  children?: EmailBlock[]; // Para columnas o contenedores
}
```

### Estrategia de Renderizado
*   **Modo Edición (Canvas):** Renderiza componentes React que imitan la apariencia del email pero añaden wrappers para manejo de selección (bordes azules, controles de arrastre).
*   **Modo Exportación (HTML):** Una utilidad separada (`exportToHtml`) recorre el árbol JSON y genera strings de HTML estático usando tablas (`<table>`) para máxima compatibilidad.

### Principios de Diseño
*   **Controlled Component:** El editor no guarda el estado final, lo comunica hacia arriba.
*   **Pluggable Blocks:** Arquitectura preparada para añadir nuevos tipos de bloques fácilmente registrándolos en un mapa de componentes.

## Patrón de Paneles Redimensionables

### Estrategia de Layout
El sistema utiliza una estrategia donde **los sidebars son redimensionables** y el Canvas se ajusta automáticamente mediante `flex-1`. Esto evita problemas de tensión y aceleración que ocurrían cuando el Canvas era directamente redimensionable.

### Componente ResizablePanel
```typescript
interface ResizablePanelProps {
    children: React.ReactNode;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    storageKey?: string;
    onResize?: (width: number) => void;
    className?: string;
    handleSide?: 'left' | 'right'; // Lado donde está el handle
}
```

### Características Clave
*   **Handles Independientes:** Cada panel tiene un handle posicionado en el lado apropiado (derecha para sidebar izquierdo, izquierda para sidebar derecho).
*   **Cálculo Correcto de DeltaX:** Cuando el handle está a la izquierda, el deltaX se invierte para que el movimiento sea intuitivo.
*   **Prevención de Interferencia:** `stopPropagation()` previene conflictos con DndContext.
*   **Separación Física:** Separadores visuales (8px) entre Canvas y sidebars aseguran independencia total del scrollbar.
*   **Persistencia:** Anchuras guardadas en localStorage y restauradas al recargar.

### Estructura de Layout
```
[Left Sidebar (ResizablePanel)] [Separador 8px] [Canvas (flex-1)] [Separador 8px] [Right Sidebar (ResizablePanel)]
```

### Archivos Clave
*   `src/components/email-builder/ui/ResizablePanel.tsx`: Componente genérico de panel redimensionable.
*   `src/components/email-builder/EmailBuilder.tsx`: Integración de paneles redimensionables en el layout principal.
*   `src/app/globals.css`: Estilos del scrollbar del Canvas (`.canvas-scroll-container`).

## Sistema de Plantillas

### Arquitectura
El sistema de plantillas permite a los usuarios seleccionar plantillas predefinidas o guardar sus propios diseños como plantillas reutilizables. Soporta integración con bases de datos externas mediante callbacks opcionales.

### Estructura de Datos
```typescript
interface SavedTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'predefined' | 'user';
  thumbnail?: string;
  template: EmailTemplate;
  createdAt?: string;
  updatedAt?: string;
}

interface TemplateStorageCallbacks {
  onSaveTemplate?: (template: SavedTemplate) => Promise<void>;
  onLoadTemplates?: () => Promise<SavedTemplate[]>;
  onDeleteTemplate?: (templateId: string) => Promise<void>;
}
```

### Componentes Clave
*   **TemplateSelector:** Modal principal con grid de plantillas, secciones predefinidas/guardadas, y acciones (nueva, guardar, eliminar).
*   **TemplatePreview:** Renderiza vista esquemática de plantillas mostrando estructura de bloques.
*   **SaveTemplateModal:** Modal para guardar plantillas con validación de nombre único.
*   **template-storage.ts:** Funciones de persistencia con soporte para callbacks externos y fallback a localStorage.

### Flujo de Uso
1. Usuario hace clic en botón "Templates" en header.
2. Se abre `TemplateSelector` modal mostrando plantillas predefinidas y guardadas.
3. Usuario puede:
   - Seleccionar plantilla predefinida → carga en editor.
   - Crear nueva plantilla en blanco → limpia editor.
   - Guardar diseño actual → abre `SaveTemplateModal`.
   - Eliminar plantilla guardada → confirmación y eliminación.
4. Al guardar, se valida nombre único y se persiste (callback externo o localStorage).

### Persistencia
*   **Con callbacks:** Usuario implementa su propia lógica de guardado en BD.
*   **Sin callbacks:** Usa localStorage automáticamente como fallback.
*   Clave localStorage: `kairos-email-builder-templates`.

### Archivos Clave
*   `src/components/email-builder/templates/predefined-templates.ts`: Definiciones de 4 plantillas predefinidas.
*   `src/components/email-builder/templates/TemplateSelector.tsx`: Modal selector principal.
*   `src/components/email-builder/templates/TemplatePreview.tsx`: Componente de preview esquemático.
*   `src/components/email-builder/templates/SaveTemplateModal.tsx`: Modal para guardar plantillas.
*   `src/components/email-builder/templates/template-storage.ts`: Lógica de persistencia.
*   `src/components/email-builder/types.ts`: Interfaces `SavedTemplate` y `TemplateStorageCallbacks`.

## Bloques Profesionales (Header, Footer, Social Links)

### Arquitectura
Los bloques profesionales son bloques especializados que encapsulan funcionalidad común en emails profesionales. Siguen el mismo patrón de arquitectura que los bloques básicos pero con props específicas y lógica de renderizado más compleja.

### Social Links Block
**Propósito:** Renderizar iconos de redes sociales como enlaces clicables.

**Props:**
```typescript
interface SocialLinksBlockProps {
  links?: Array<{
    platform: 'facebook' | 'x' | 'instagram' | 'linkedin' | 'youtube' | 'custom';
    url: string;
    iconUrl?: string; // Para iconos custom
  }>;
  iconSize?: string;
  iconColor?: string;
  spacing?: string;
  align?: 'left' | 'center' | 'right';
  padding?: string;
}
```

**Características:**
*   Iconos SVG inline para máxima compatibilidad con clientes de email.
*   Soporte para iconos custom mediante URL.
*   Validación de URLs antes de renderizar.
*   Layout horizontal con spacing configurable.

**Archivos:**
*   `src/components/email-builder/blocks/SocialLinksBlock.tsx`
*   `src/components/email-builder/properties/SocialLinksProperties.tsx`

### Footer Block
**Propósito:** Renderizar footer completo con información legal y links de unsubscribe.

**Props:**
```typescript
interface FooterBlockProps {
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
```

**Características:**
*   Información de empresa configurable.
*   Links legales con switches para mostrar/ocultar.
*   Validación de URLs.
*   Layout vertical estructurado.

**Archivos:**
*   `src/components/email-builder/blocks/FooterBlock.tsx`
*   `src/components/email-builder/properties/FooterProperties.tsx`

### Header Block
**Propósito:** Renderizar header con logo y menú de navegación opcional.

**Props:**
```typescript
interface HeaderBlockProps {
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
```

**Características:**
*   Logo configurable con dimensiones.
*   Menú de navegación opcional con items dinámicos.
*   Layout flexible según configuración.
*   Validación de URLs en items de menú.

**Archivos:**
*   `src/components/email-builder/blocks/HeaderBlock.tsx`
*   `src/components/email-builder/properties/HeaderProperties.tsx`

### Patrón de Implementación
Todos los bloques profesionales siguen el mismo patrón:

1. **Componente de Renderizado:** Renderiza el bloque en el canvas con validaciones.
2. **Componente de Propiedades:** Panel de edición con controles específicos.
3. **Integración:** Casos en `BlockRenderer`, `RightSidebar`, `LeftSidebar`.
4. **Generación HTML:** Función específica en `html-generator.ts` usando tablas para compatibilidad.

### Validaciones Comunes
*   URLs validadas con `isValidUrl()` antes de renderizar.
*   Estados vacíos mejorados con mensajes informativos.
*   Valores por defecto para todas las props.
*   Escape HTML en generación de HTML para seguridad.

### Actualización de Iconos
*   Icono de Twitter actualizado al nuevo icono de X (Twitter).
*   Todos los iconos SVG inline para compatibilidad con emails.
*   Soporte para iconos custom mediante URL.