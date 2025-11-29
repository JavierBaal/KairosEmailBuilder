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
  type: 'text' | 'image' | 'button' | 'columns' | 'divider' | 'spacer';
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
