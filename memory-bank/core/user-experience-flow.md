# Flujo de Experiencia de Usuario (UX)

## Flujo Principal: Creación de una Plantilla

1.  **Acceso al Editor:**
    *   El usuario navega a la sección de "Email Marketing" -> "Plantillas" -> "Nueva Plantilla".
    *   Se carga la interfaz del Kairos Email Builder.

2.  **Interfaz del Editor:**
    *   **Izquierda/Derecha (Panel de Herramientas):** Contiene las pestañas "Bloques" (Texto, Imagen, Botón, etc.) y "Estilos" (Configuración global o del bloque seleccionado).
    *   **Centro (Lienzo/Canvas):** Área de visualización en tiempo real del correo. Representa fielmente cómo se verá.
    *   **Superior (Barra de Acciones):** Botones para "Deshacer", "Rehacer", "Vista Previa" (Móvil/Desktop), "Guardar", "Exportar HTML".

3.  **Interacción Drag-and-Drop:**
    *   El usuario selecciona un bloque (ej. "Botón") del panel lateral.
    *   Lo arrastra hacia el lienzo.
    *   Zonas de caída (dropzones) se iluminan para indicar dónde se puede soltar el bloque.
    *   Al soltar, el bloque se renderiza inmediatamente en el lienzo.

4.  **Edición de Contenido y Estilo:**
    *   El usuario hace clic en el bloque del botón en el lienzo.
    *   El panel lateral cambia a modo "Propiedades".
    *   El usuario edita el texto del botón, cambia el color de fondo y ajusta el enlace.
    *   Los cambios se reflejan instantáneamente en el lienzo.

5.  **Guardado y Exportación:**
    *   El usuario hace clic en "Guardar". El estado (JSON) se persiste.
    *   El usuario hace clic en "Exportar HTML". El sistema genera el código HTML compatible con clientes de correo.

## Wireframes Conceptuales

*   **Layout:** Diseño de 3 columnas (o 2 con panel flotante).
    *   [Panel Bloques] | [ Lienzo de Edición (Centrado) ] | [Panel Propiedades]
*   **Responsive:** El lienzo debe poder redimensionarse para simular vistas móviles.
