# Contexto del Producto

## Audiencia Objetivo
*   **Administradores de Marketing:** Usuarios que crean campañas de correo electrónico dentro de la plataforma Kairos. Buscan rapidez y facilidad de uso.
*   **Diseñadores:** Usuarios que necesitan flexibilidad para ajustar la estética de los correos sin tocar código HTML complejo.
*   **Desarrolladores (Internos):** Necesitan un componente mantenible y extensible que se integre bien con el stack existente.

## Problema a Resolver
Las soluciones existentes (como GrapesJS o editores basados en iframes) suelen ser:
1.  **Pesadas:** Afectan el rendimiento de la aplicación.
2.  **Difíciles de personalizar:** Estilizar o modificar su comportamiento requiere "hacks" o configuraciones complejas.
3.  **Inconsistentes:** No siguen el sistema de diseño de la aplicación principal (Shadcn UI/Tailwind).

## Propuesta de Valor
Kairos Email Builder ofrece una experiencia de edición de correo electrónico **nativa**, **rápida** y **coherente**. Al estar construido con las mismas tecnologías que la plataforma principal (React, Tailwind), se siente como una extensión natural del flujo de trabajo, no como una herramienta externa incrustada.

## Casos de Uso Principales
1.  **Creación de Newsletter:** Un usuario arrastra bloques de texto e imagen para crear un boletín semanal.
2.  **Email Transaccional:** Un desarrollador o admin diseña una plantilla para "Recuperar Contraseña" y la exporta para usarla en el backend.
3.  **Edición Rápida:** Un usuario abre una plantilla existente, cambia un texto y un color de botón, y guarda los cambios en segundos.
