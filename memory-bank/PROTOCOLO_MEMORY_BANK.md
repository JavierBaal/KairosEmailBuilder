# Protocolo del Memory Bank

**Versión:** 1.0
**Fecha:** 29 de Noviembre de 2025

Este documento define los protocolos obligatorios para la interacción con el Memory Bank del proyecto **Kairos Email Builder**.

---

## 📖 1. Orden de Lectura Obligatorio

Al iniciar cualquier sesión, el Agente debe leer los archivos en el siguiente orden estricto para construir su contexto:

1.  **`core/current-state.md`**
    *   *Propósito:* Entender en qué punto exacto se quedó el proyecto.
    *   *Contenido:* Estado actual, tareas en curso, bloqueos.

2.  **`core/user-experience-flow.md`**
    *   *Propósito:* Comprender cómo interactúa el usuario con el sistema.
    *   *Contenido:* User Journeys, flujos de navegación, wireframes (descritos).

3.  **`core/projectbrief.md`**
    *   *Propósito:* Alinear con la visión macro del proyecto.
    *   *Contenido:* Objetivos, alcance, funcionalidades clave.

4.  **`core/productContext.md`**
    *   *Propósito:* Conocer al usuario y el problema a resolver.
    *   *Contenido:* Personas, casos de uso, propuesta de valor.

5.  **`technical/systemPatterns.md`**
    *   *Propósito:* Entender cómo está construido el sistema.
    *   *Contenido:* Arquitectura, patrones de diseño, decisiones técnicas.

6.  **`technical/techContext.md`**
    *   *Propósito:* Conocer las herramientas disponibles.
    *   *Contenido:* Stack tecnológico, dependencias, entorno de desarrollo.

7.  **`core/progress.md`**
    *   *Propósito:* Revisar el historial y el roadmap.
    *   *Contenido:* Tareas completadas, pendientes, hitos.

---

## 🚀 2. Protocolo de Inicio de Sesión

1.  **Lectura:** Ejecutar la lectura secuencial definida arriba.
2.  **Confirmación:** Confirmar al usuario que se ha cargado el contexto y resumir brevemente el estado actual.
3.  **Planificación:** Proponer el plan de acción para la sesión actual basado en el `current-state.md` y la solicitud del usuario.

---

## 🔄 3. Protocolo Durante la Sesión

1.  **Actualización Continua:** Si se toman decisiones arquitectónicas o se completan tareas significativas, actualizar los archivos correspondientes en memoria (y persistirlos al final o durante hitos clave).
2.  **Consulta:** Si surge una duda sobre una funcionalidad existente, consultar primero el Memory Bank antes de preguntar al usuario o "adivinar".

---

## 🏁 4. Protocolo de Cierre de Sesión

1.  **Actualización de `current-state.md`:**
    *   Reflejar el nuevo estado del sistema.
    *   Listar claramente los siguientes pasos inmediatos.
2.  **Actualización de `progress.md`:**
    *   Marcar tareas completadas.
3.  **Actualización de Documentación Técnica:**
    *   Si hubo cambios en arquitectura o stack, actualizar `systemPatterns.md` o `techContext.md`.
4.  **Commit:** Realizar un commit descriptivo de los cambios.

---

## 🕵️ 5. Protocolo de Auditoría Forense

(Solo bajo solicitud explícita)

1.  **Analizar:** Investigar componentes y logs.
2.  **Reportar:** Generar informe de hallazgos en español.
3.  **Esperar:** No aplicar correcciones sin aprobación.
