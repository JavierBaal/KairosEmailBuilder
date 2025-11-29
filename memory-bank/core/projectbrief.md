# Project Brief: Kairos Email Builder (PRD)

**Fecha:** 29 de Noviembre de 2025
**Estado:** Definición Activa

## 1. Resumen Ejecutivo
Desarrollo de un **componente React independiente** (`<EmailBuilder />`) que proporcione una interfaz de construcción de emails "Drag-and-Drop", similar a MailChimp o Klaviyo.
**Objetivo:** Permitir a usuarios no técnicos crear plantillas de email marketing responsive y visualmente atractivas sin escribir código HTML.
**Restricción Clave:** Sistema **nativo y ligero**. Sin dependencias pesadas como GrapesJS.

## 2. Requerimientos Funcionales

### 2.1. Interfaz de Usuario (Layout)
1.  **Sidebar Izquierdo (Bloques):** Paleta de componentes disponibles.
2.  **Canvas Central (Lienzo):** Área WYSIWYG de previsualización y ordenamiento.
3.  **Sidebar Derecho (Propiedades):** Configuración del bloque seleccionado.

### 2.2. Bloques Fundamentales
*   **Estructurales:** Contenedor/Sección, Columnas (1, 2, 3), Divisor, Espaciador.
*   **Contenido:** Texto (Rico simple), Imagen (URL/Upload), Botón (CTA), Redes Sociales.

### 2.3. Motor de Renderizado (Output)
1.  **JSON (Estado):** Representación estructurada para persistencia y re-edición.
2.  **HTML (Email-Ready):** Generación de HTML compatible con clientes de correo (uso de `<table>`), posiblemente vía `@react-email/components`.

## 3. Requerimientos de Integración (DX)
El componente debe funcionar como un input controlado:
- **Props:** `value` (JSON), `onChange`, `onUploadImage`, `previewMode`.
- **Tipado:** TypeScript estricto (`EmailBlock`, `EmailTemplate`).
- **Aislamiento:** Estilos aislados para no afectar la app anfitriona.

## 4. User Stories Clave
*   **Admin:** Arrastrar bloques, editar propiedades en tiempo real, reordenar secciones, vista previa móvil.
*   **Dev:** Tipado estricto, sin estilos globales conflictivos, inyección de función de subida de imágenes.

## 5. Criterios de Éxito
*   Compatibilidad Next.js SSR / `use client`.
*   Performance fluida (60fps) en drag-and-drop.
*   Código modular y limpio.
*   Uso exclusivo de Tailwind CSS para la UI del editor.
