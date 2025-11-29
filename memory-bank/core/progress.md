# Progreso del Proyecto

## Hitos Principales

| Hito | Estado | Fecha Estimada | Descripción |
| :--- | :--- | :--- | :--- |
| **1. Configuración Inicial** | ✅ Completado | 29/11/2025 | Setup del repo, Memory Bank, entorno Next.js y Scaffolding. |
| **2. Open Source Setup** | ✅ Completado | 29/11/2025 | Configuración de README, LICENSE, CONTRIBUTING y reglas de idioma. |
| **3. Prototipo Drag-and-Drop** | ✅ Completado | 29/11/2025 | Implementación básica de arrastrar bloques al lienzo y gestión de estado. |
| **4. Bloques Core** | ✅ Completado | 29/11/2025 | Desarrollo de bloques Texto, Imagen, Botón, Divisor, Espaciador. |
| **5. Panel de Propiedades** | ✅ Completado | 29/11/2025 | Edición de estilos y contenido de bloques mediante formulario dinámico. |
| **6. Generación HTML** | ✅ Completado | 29/11/2025 | Exportación a HTML compatible con emails y JSON. |
| **7. Columnas (Layout)** | 🔴 Pendiente | Próxima Sesión | Implementación de bloques de columnas con anidamiento. |
| **8. MVP Release** | 🟡 En Progreso | - | Versión funcional completa (falta Columnas). |

## Historial de Tareas

### 29 de Noviembre de 2025 (Sesión MVP)
*   ✅ Creación de estructura de carpetas `memory-bank` y protocolos.
*   ✅ Integración del PRD en `projectbrief.md`.
*   ✅ Inicialización de proyecto Next.js 15 (App Router).
*   ✅ Instalación de dependencias: Shadcn UI, dnd-kit, Lucide, Zustand.
*   ✅ Configuración Open Source (README, LICENSE, CONTRIBUTING en inglés).
*   ✅ Implementación de `DndContext` y lógica de Drag-and-Drop.
*   ✅ Implementación de `useEditorStore` (Zustand) para gestión de estado.
*   ✅ Creación de componentes de bloques (`TextBlock`, `ImageBlock`, `ButtonBlock`, `DividerBlock`, `SpacerBlock`).
*   ✅ Implementación de `BlockRenderer` y actualización de `Canvas`.
*   ✅ Implementación de `SortableContext` para reordenamiento de bloques.
*   ✅ Instalación de componentes Shadcn UI (input, label, select, etc.).
*   ✅ Implementación de componentes de propiedades (`TextProperties`, etc.).
*   ✅ Conexión de `RightSidebar` al store para edición en tiempo real.
*   ✅ Implementación de utilidad `generateHtml` y botones de exportación.

## Próximas Tareas (Backlog Inmediato)
1.  **[P0] Implementación de Columnas:** Prioridad absoluta para la próxima sesión. Requiere investigar `dnd-kit` nested sortables o una estrategia de zonas de caída recursivas.
2.  [ ] Refinamiento de estilos y UI general.
3.  [ ] Tests E2E básicos.
