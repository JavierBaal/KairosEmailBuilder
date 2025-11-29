# Estado Actual del Sistema

**Fecha:** 29 de Noviembre de 2025

## 🎯 Resumen
El proyecto ha alcanzado un estado de **MVP Funcional (Single Column)**. El editor permite crear emails completos apilando bloques verticalmente, editando sus propiedades y exportando el resultado a HTML. La base técnica es sólida (Next.js 15, Zustand, Dnd-kit) y está lista para la siguiente fase de complejidad.

## 🚧 Tareas en Curso
*   **Columnas (Layout):** Es la única pieza funcional mayor pendiente para considerar el builder "completo".

## ✅ Tareas Completadas
*   **Core:** Drag & Drop, Sorting, State Management.
*   **Bloques:** Texto, Imagen, Botón, Divisor, Espaciador.
*   **UI:** Panel de propiedades dinámico, Sidebar de bloques, Canvas interactivo.
*   **Export:** HTML (tablas) y JSON.

## 🛑 Bloqueos y Riesgos
*   **Complejidad de Columnas:** Implementar columnas requiere que un bloque pueda contener otros bloques (`children`). Esto implica:
    1.  Actualizar el esquema de datos (ya soportado en `types.ts` con `children[]`).
    2.  Modificar `BlockRenderer` para que sea recursivo.
    3.  Gestionar zonas de caída anidadas con `dnd-kit` (evitar conflictos de eventos entre el contenedor padre y los hijos).
*   **Linting:** Persisten algunos errores de linting (importaciones, tipos `any` controlados) que no afectan el build pero deben limpiarse.

## 📋 Contexto para Próxima Sesión (Onboarding)
*   **Prioridad P0:** Implementar el bloque de **Columnas**.
*   **Estrategia Sugerida:**
    1.  Crear `ColumnsBlock.tsx` que renderice sus `children` usando el mismo `SortableContext` que el Canvas principal.
    2.  Asegurar que `useEditorStore` maneje inserciones en arrays anidados (actualmente `addBlock` solo añade al root, necesita lógica recursiva o path-based).
    3.  Probar intensivamente el drag & drop anidado.
*   **Archivos Clave:**
    *   `src/components/email-builder/store/editor-store.ts`: Aquí está la lógica de estado. Necesita actualización para soportar anidamiento.
    *   `src/components/email-builder/canvas/BlockRenderer.tsx`: El renderizador principal.
    *   `src/components/email-builder/EmailBuilder.tsx`: Orquestador del DndContext.
