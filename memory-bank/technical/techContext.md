# Contexto Tecnológico

## Stack Principal (Requerido)
*   **Framework:** Next.js 15 (App Router).
*   **Lenguaje:** TypeScript (Strict mode).
*   **Librería UI:** React 19.
*   **Estilos:** Tailwind CSS (v3.4+).
*   **Componentes Base:** Shadcn UI (Radix UI).
*   **Iconos:** Lucide React.

## Librerías Específicas
*   **Drag & Drop:** `@dnd-kit/core` (Recomendado por ligereza y accesibilidad) o implementación nativa.
*   **Generación HTML:** `@react-email/components` (Opcional/Recomendado para facilitar la salida a tablas HTML).

## Entorno de Desarrollo
*   **Node.js:** LTS.
*   **Gestor de Paquetes:** npm/pnpm.

## Restricciones Técnicas
*   **Cero Errores de Hidratación:** Compatible con SSR de Next.js.
*   **Aislamiento de Estilos:** Los estilos del editor no deben "fugar" ni ser afectados por estilos globales externos (uso de `tailwind-merge`, `clsx` o prefijos si fuera necesario).
*   **Assets Externos:** La subida de imágenes se maneja vía callback (`onUploadImage`) para agnósticismo del proveedor (S3, Vercel Blob, etc.).
