# Reporte de Auditoría Preventiva Completa
## Kairos Email Builder

**Fecha:** 29 de Noviembre de 2025  
**Auditor:** Cline (AI Assistant)  
**Alcance:** Análisis exhaustivo del código fuente completo del proyecto

---

## Resumen Ejecutivo

Se han identificado **47 problemas** en total, clasificados en:
- **Críticos:** 8 problemas que afectan funcionalidad o seguridad
- **Altos:** 12 problemas que pueden causar errores en runtime
- **Medios:** 18 problemas que afectan calidad y mantenibilidad
- **Bajos:** 9 problemas menores (warnings, mejoras)

### Problemas Críticos Identificados

1. **Vulnerabilidad XSS** en generación HTML (texto sin escapar)
2. **Bloques anidados no renderizados** (funcionalidad incompleta)
3. **addBlock ignora parentId e index** (funcionalidad incompleta)
4. **moveBlock solo funciona en root** (funcionalidad incompleta)
5. **Loop infinito potencial** en sincronización de estado
6. **Props no validadas** en generación HTML (errores runtime)
7. **Tipos 'columns' y 'social' no implementados** pero disponibles en UI
8. **page.tsx no usa EmailBuilder** (aplicación no funcional)

---

## Problemas por Categoría

### 🔴 CRÍTICOS (8 problemas)

#### 1. Vulnerabilidad XSS en Generación HTML
**Archivo:** `src/utils/html-generator.ts`  
**Línea:** 28  
**Severidad:** CRÍTICA - Seguridad

**Problema:**
```typescript
${text}  // Línea 28 - Texto insertado directamente sin escapar
```

El texto del usuario se inserta directamente en el HTML sin sanitización, permitiendo inyección de código JavaScript malicioso.

**Impacto:** Un atacante podría ejecutar código JavaScript en el contexto del cliente de correo del usuario.

**Solución Propuesta:**
- Implementar función de escape HTML: `escapeHtml(text)`
- Usar librería como `he` o `dompurify` para sanitización
- Escapar caracteres especiales: `<`, `>`, `&`, `"`, `'`

---

#### 2. BlockRenderer No Renderiza Bloques Anidados
**Archivo:** `src/components/email-builder/canvas/BlockRenderer.tsx`  
**Líneas:** 24-39  
**Severidad:** CRÍTICA - Funcionalidad

**Problema:**
El componente `BlockRenderer` no renderiza recursivamente los bloques hijos (`block.children`). El switch solo renderiza el contenido del bloque actual, ignorando completamente la propiedad `children`.

**Impacto:** Los bloques con hijos (como columnas futuras) no se mostrarán correctamente. La funcionalidad de anidamiento está definida en tipos pero no implementada.

**Solución Propuesta:**
```typescript
const renderBlockContent = () => {
    const content = switch(block.type) { ... };
    
    // Renderizar hijos si existen
    if (block.children && block.children.length > 0) {
        return (
            <>
                {content}
                <div className="nested-blocks">
                    {block.children.map(child => (
                        <BlockRenderer key={child.id} block={child} />
                    ))}
                </div>
            </>
        );
    }
    
    return content;
};
```

---

#### 3. addBlock Ignora parentId e index
**Archivo:** `src/components/email-builder/store/editor-store.ts`  
**Líneas:** 34-46  
**Severidad:** CRÍTICA - Funcionalidad

**Problema:**
```typescript
addBlock: (block, parentId, index) => set((state) => {
    // Simple implementation: always add to root for now
    // TODO: Implement nested insertion logic
    return {
        template: {
            ...state.template,
            root: {
                ...state.template.root,
                children: [...state.template.root.children, block]  // Siempre añade al final del root
            }
        }
    };
}),
```

La función recibe `parentId` e `index` pero los ignora completamente. Siempre añade bloques al final del root, imposibilitando la inserción en bloques anidados o en posiciones específicas.

**Impacto:** No se pueden crear estructuras anidadas. La funcionalidad de columnas será imposible de implementar correctamente.

**Solución Propuesta:**
Implementar lógica recursiva que busque el bloque padre por ID y añada el bloque en la posición especificada por `index`.

---

#### 4. moveBlock Solo Funciona en Nivel Root
**Archivo:** `src/components/email-builder/store/editor-store.ts`  
**Líneas:** 73-95  
**Severidad:** CRÍTICA - Funcionalidad

**Problema:**
```typescript
moveBlock: (blockId, overId) => set((state) => {
    const oldIndex = state.template.root.children.findIndex(b => b.id === blockId);
    const newIndex = state.template.root.children.findIndex(b => b.id === overId);
    // Solo busca en root.children, no en bloques anidados
```

La función solo busca y mueve bloques en `template.root.children`, ignorando completamente bloques anidados.

**Impacto:** No se pueden reordenar bloques dentro de contenedores anidados.

**Solución Propuesta:**
Implementar función recursiva que busque el bloque en toda la estructura de árbol y lo mueva correctamente.

---

#### 5. Loop Infinito Potencial en Sincronización Estado
**Archivo:** `src/components/email-builder/EmailBuilder.tsx`  
**Líneas:** 41-43  
**Severidad:** CRÍTICA - Performance/Estabilidad

**Problema:**
```typescript
useEffect(() => {
    onChange(template);
}, [template, onChange]);
```

Este `useEffect` llama `onChange` cada vez que `template` cambia. Si el componente padre actualiza `value` basado en `onChange`, puede crear un loop infinito de actualizaciones.

**Impacto:** Puede causar renders infinitos y crash de la aplicación.

**Solución Propuesta:**
- Usar `useRef` para comparar si el template realmente cambió
- Implementar comparación profunda antes de llamar `onChange`
- O usar `useMemo` para memoizar el template antes de pasarlo a `onChange`

---

#### 6. Props No Validadas en Generación HTML
**Archivo:** `src/utils/html-generator.ts`  
**Líneas:** 24, 35, 46, 65, 80  
**Severidad:** CRÍTICA - Runtime Errors

**Problema:**
Todas las funciones de renderizado acceden directamente a `block.props.*` sin validar que existan:

```typescript
const { text, align, color, fontSize, lineHeight, padding } = block.props;
// Si alguna prop no existe, será undefined y generará HTML inválido
```

**Impacto:** Puede generar HTML inválido o causar errores en runtime si las props no están definidas.

**Solución Propuesta:**
- Usar valores por defecto en destructuring: `const { text = '', align = 'left', ... } = block.props;`
- O validar cada prop antes de usarla

---

#### 7. Tipos 'columns' y 'social' No Implementados
**Archivos:** Múltiples  
**Severidad:** CRÍTICA - Funcionalidad

**Problema:**
- `BlockType` incluye 'columns' y 'social'
- `LeftSidebar.tsx` permite arrastrar 'columns'
- `BlockRenderer.tsx` no tiene casos para estos tipos (muestra "Unknown block type")
- `html-generator.ts` retorna string vacío para estos tipos
- No hay componentes `ColumnsBlock` ni `SocialBlock`

**Impacto:** Los usuarios pueden arrastrar bloques que no funcionan, causando confusión y errores.

**Solución Propuesta:**
- Implementar `ColumnsBlock` y `SocialBlock`
- O remover temporalmente estos tipos de `BlockType` y `LeftSidebar` hasta que se implementen

---

#### 8. page.tsx No Usa EmailBuilder
**Archivo:** `src/app/page.tsx`  
**Severidad:** CRÍTICA - Integración

**Problema:**
El archivo `page.tsx` muestra el template por defecto de Next.js en lugar de usar el componente `EmailBuilder`.

**Impacto:** La aplicación no muestra el editor de emails. El componente principal no se está usando.

**Solución Propuesta:**
Importar y usar `EmailBuilder` con un template inicial:

```typescript
import { EmailBuilder } from '@/components/email-builder/EmailBuilder';
import { EmailTemplate } from '@/components/email-builder/types';

const initialTemplate: EmailTemplate = { ... };

export default function Home() {
    const [template, setTemplate] = useState(initialTemplate);
    return <EmailBuilder value={template} onChange={setTemplate} />;
}
```

---

### ⚠️ ALTOS (12 problemas)

#### 9. width.replace() Puede Fallar si No Es String
**Archivo:** `src/utils/html-generator.ts`  
**Línea:** 39  
**Severidad:** ALTA - Runtime Error

**Problema:**
```typescript
width="${width.replace('%', '')}"
```

Si `width` no es string (puede ser number o undefined), `.replace()` causará error.

**Solución:** Validar tipo: `width: typeof width === 'string' ? width.replace('%', '') : width`

---

#### 10. setMounted en useEffect (React Hook Warning)
**Archivo:** `src/components/email-builder/EmailBuilder.tsx`  
**Línea:** 48-50  
**Severidad:** ALTA - Best Practice

**Problema:**
```typescript
useEffect(() => {
    setMounted(true);
}, []);
```

React recomienda evitar `setState` en efectos. Debería usarse `useState` con inicialización directa o `useLayoutEffect`.

**Solución:** Usar `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []);` o mejor aún, usar `useState(true)` si no hay SSR.

---

#### 11. Canvas No Maneja Bloques Anidados
**Archivo:** `src/components/email-builder/canvas/Canvas.tsx`  
**Líneas:** 35-44  
**Severidad:** ALTA - Funcionalidad

**Problema:**
Solo renderiza `template.root.children`, no renderiza bloques anidados dentro de otros bloques.

**Solución:** Modificar para que `SortableBlock` y `BlockRenderer` manejen recursivamente los hijos.

---

#### 12. SortableBlock No Maneja Bloques Anidados
**Archivo:** `src/components/email-builder/canvas/SortableBlock.tsx`  
**Severidad:** ALTA - Funcionalidad

**Problema:**
No renderiza `block.children` recursivamente.

**Solución:** Añadir lógica recursiva similar a `BlockRenderer`.

---

#### 13. html-generator No Maneja Bloques Anidados
**Archivo:** `src/utils/html-generator.ts`  
**Líneas:** 6-21  
**Severidad:** ALTA - Funcionalidad

**Problema:**
`renderBlock` no es recursivo, no renderiza `block.children`.

**Solución:** Hacer `renderBlock` recursivo para renderizar hijos.

---

#### 14. html-generator No Maneja 'columns' ni 'social'
**Archivo:** `src/utils/html-generator.ts`  
**Líneas:** 7-20  
**Severidad:** ALTA - Funcionalidad

**Problema:**
El switch no incluye casos para 'columns' ni 'social', retorna string vacío.

**Solución:** Implementar casos o remover tipos hasta implementarlos.

---

#### 15. findBlock Puede Ser Ineficiente
**Archivo:** `src/components/email-builder/panels/RightSidebar.tsx`  
**Líneas:** 15-24  
**Severidad:** ALTA - Performance

**Problema:**
Función recursiva sin memoización. Con estructuras grandes puede ser lenta.

**Solución:** Memoizar resultado o usar Map para búsqueda O(1).

---

#### 16. updateBlock Puede Fallar con Estructuras Profundas
**Archivo:** `src/components/email-builder/store/editor-store.ts`  
**Líneas:** 48-71  
**Severidad:** ALTA - Estabilidad

**Problema:**
Recursión sin límite de profundidad. Estructuras muy profundas pueden causar stack overflow.

**Solución:** Añadir límite de profundidad o usar iteración en lugar de recursión.

---

#### 17. No Hay Validación de IDs Duplicados
**Archivo:** `src/components/email-builder/store/editor-store.ts`  
**Severidad:** ALTA - Integridad de Datos

**Problema:**
No se valida que los IDs de bloques sean únicos. IDs duplicados pueden causar comportamientos inesperados.

**Solución:** Validar unicidad al añadir bloques.

---

#### 18. No Hay Validación de Estructura EmailTemplate
**Archivo:** `src/components/email-builder/types.ts`  
**Severidad:** ALTA - Integridad de Datos

**Problema:**
No hay validación de que el `EmailTemplate` recibido tenga la estructura correcta.

**Solución:** Crear función de validación con Zod o similar.

---

#### 19. blocks/index.ts Exportaciones Incompletas
**Archivo:** `src/components/email-builder/blocks/index.ts`  
**Líneas:** 1-5  
**Severidad:** ALTA - Mantenibilidad

**Problema:**
Solo exporta `TextBlock` e `ImageBlock`, comentario indica "otros bloques" pero no están exportados.

**Solución:** Exportar todos los bloques o eliminar el barrel file si no se usa.

---

#### 20. onUploadImage No Se Usa
**Archivo:** `src/components/email-builder/EmailBuilder.tsx`  
**Línea:** 23  
**Severidad:** ALTA - Funcionalidad

**Problema:**
La prop `onUploadImage` se recibe pero nunca se usa. No hay funcionalidad de subida de imágenes.

**Solución:** Implementar funcionalidad de subida o hacer la prop opcional y documentar que no está implementada.

---

### 🟡 MEDIOS (18 problemas)

#### 21-26. Uso de `any` en Props de Componentes de Propiedades
**Archivos:** 
- `src/components/email-builder/properties/TextProperties.tsx` (líneas 8-9)
- `src/components/email-builder/properties/ImageProperties.tsx` (líneas 7-8)
- `src/components/email-builder/properties/ButtonProperties.tsx` (líneas 7-8)
- `src/components/email-builder/properties/DividerProperties.tsx` (líneas 6-7)
- `src/components/email-builder/properties/SpacerProperties.tsx` (líneas 7-8)
- `src/components/email-builder/panels/RightSidebar.tsx` (línea 36)

**Severidad:** MEDIA - Type Safety

**Problema:**
Uso de `Record<string, any>` en lugar de tipos específicos.

**Solución:** Crear interfaces específicas para props de cada tipo de bloque.

---

#### 27. Record<string, any> en types.ts
**Archivo:** `src/components/email-builder/types.ts`  
**Línea:** 7  
**Severidad:** MEDIA - Type Safety

**Problema:**
`props: Record<string, any>` es muy genérico.

**Solución:** Usar tipos específicos o uniones discriminadas por tipo de bloque.

---

#### 28. Importaciones No Usadas
**Archivos:**
- `src/components/email-builder/EmailBuilder.tsx` - `onUploadImage` (línea 23)
- `src/components/email-builder/canvas/Canvas.tsx` - `BlockRenderer` (línea 6)
- `src/components/email-builder/panels/RightSidebar.tsx` - `Separator` (línea 9)
- `src/components/email-builder/properties/SpacerProperties.tsx` - `Input` (línea 3)

**Severidad:** MEDIA - Limpieza de Código

**Solución:** Eliminar importaciones no usadas.

---

#### 29. Uso de <img> en lugar de next/image
**Archivo:** `src/components/email-builder/blocks/ImageBlock.tsx`  
**Línea:** 19  
**Severidad:** MEDIA - Best Practice

**Problema:**
Next.js recomienda usar `<Image />` de `next/image` para optimización.

**Nota:** En este caso puede ser intencional para emails, pero debería documentarse.

---

#### 30. Falta Alt en Iconos de LeftSidebar
**Archivo:** `src/components/email-builder/panels/LeftSidebar.tsx`  
**Línea:** 42  
**Severidad:** MEDIA - Accesibilidad

**Problema:**
Los iconos de Lucide no tienen atributo `alt`.

**Solución:** Añadir `aria-label` a los iconos.

---

#### 31. No Hay Manejo de Errores en Generación HTML
**Archivo:** `src/utils/html-generator.ts`  
**Severidad:** MEDIA - Robustez

**Problema:**
No hay try-catch ni validación de errores.

**Solución:** Añadir manejo de errores y validación.

---

#### 32. Valores por Defecto Inconsistentes
**Archivos:** Múltiples bloques  
**Severidad:** MEDIA - Consistencia

**Problema:**
Los valores por defecto están definidos en componentes de bloques pero también deberían estar en generación HTML.

**Solución:** Centralizar valores por defecto en un archivo de constantes.

---

#### 33. No Hay Validación de URLs en ButtonBlock
**Archivo:** `src/components/email-builder/blocks/ButtonBlock.tsx`  
**Línea:** 23  
**Severidad:** MEDIA - Seguridad

**Problema:**
No se valida que `url` sea una URL válida antes de usarla en `href`.

**Solución:** Validar formato de URL o usar `URL` constructor.

---

#### 34. No Hay Validación de URLs en ImageBlock
**Archivo:** `src/components/email-builder/blocks/ImageBlock.tsx`  
**Línea:** 19  
**Severidad:** MEDIA - Seguridad

**Problema:**
No se valida que `src` sea una URL válida.

**Solución:** Validar formato de URL.

---

#### 35. SpacerProperties Puede Fallar con Formatos Inválidos
**Archivo:** `src/components/email-builder/properties/SpacerProperties.tsx`  
**Línea:** 12  
**Severidad:** MEDIA - Runtime Error

**Problema:**
```typescript
const heightValue = parseInt((props.height || '20px').replace('px', ''), 10);
```

Si `height` tiene formato diferente (ej: '20em'), el parseo fallará silenciosamente.

**Solución:** Validar formato antes de parsear.

---

#### 36. No Hay Límite de Profundidad en Recursión
**Archivos:** Múltiples  
**Severidad:** MEDIA - Estabilidad

**Problema:**
Funciones recursivas (`findBlock`, `updateBlock`) no tienen límite de profundidad.

**Solución:** Añadir límite máximo de profundidad.

---

#### 37. No Hay Validación de Tipos de Bloque
**Archivo:** `src/components/email-builder/canvas/BlockRenderer.tsx`  
**Línea:** 25  
**Severidad:** MEDIA - Type Safety

**Problema:**
El switch no valida exhaustivamente todos los tipos de `BlockType`.

**Solución:** Usar `satisfies` o validación exhaustiva.

---

#### 38. handleDragEnd Lógica Compleja
**Archivo:** `src/components/email-builder/EmailBuilder.tsx`  
**Líneas:** 69-100  
**Severidad:** MEDIA - Mantenibilidad

**Problema:**
Lógica compleja con múltiples casos anidados, difícil de mantener.

**Solución:** Refactorizar en funciones separadas más pequeñas.

---

### 🟢 BAJOS (9 problemas)

#### 39-47. Warnings de ESLint
**Severidad:** BAJA - Calidad de Código

- Variables no usadas
- Uso de `any` (ya documentado en problemas medios)
- Best practices de React

**Solución:** Corregir warnings según recomendaciones de ESLint.

---

## Análisis de Dependencias

### Versiones Revisadas

- **Next.js:** 16.0.5 (documentación menciona 15, pero 16 es más reciente - OK)
- **React:** 19.2.0 (compatible con Next.js 16)
- **@dnd-kit/core:** 6.3.1
- **@dnd-kit/sortable:** 10.0.0 (versión más reciente, compatible)
- **@dnd-kit/utilities:** 3.2.2

**Observación:** Las versiones de @dnd-kit son diferentes pero compatibles entre sí. No hay problema.

---

## Análisis de Configuración

### tsconfig.json
- ✅ `strict: true` - Correcto
- ✅ Paths alias `@/*` configurado correctamente
- ✅ Configuración adecuada para Next.js

### next.config.ts
- ⚠️ Configuración vacía - Puede necesitar ajustes para producción

### eslint.config.mjs
- ✅ Configuración básica correcta
- ⚠️ Podría añadirse más reglas estrictas

---

## Recomendaciones Prioritarias

### Prioridad P0 (Inmediata)
1. **Corregir vulnerabilidad XSS** en `html-generator.ts`
2. **Implementar renderizado de bloques anidados** en `BlockRenderer`
3. **Corregir `addBlock`** para soportar `parentId` e `index`
4. **Corregir `moveBlock`** para soportar bloques anidados
5. **Corregir loop infinito** en sincronización de estado
6. **Añadir validación de props** en generación HTML
7. **Implementar o remover tipos 'columns' y 'social'**
8. **Integrar EmailBuilder en page.tsx**

### Prioridad P1 (Alta)
9. Validar tipos antes de usar métodos de string
10. Corregir warnings de React hooks
11. Implementar manejo de bloques anidados en Canvas y SortableBlock
12. Añadir validación de URLs
13. Centralizar valores por defecto

### Prioridad P2 (Media)
14. Mejorar tipado (eliminar `any`)
15. Añadir manejo de errores
16. Optimizar funciones recursivas
17. Limpiar importaciones no usadas

---

## Conclusión

El proyecto tiene una base sólida pero requiere correcciones críticas antes de continuar con el desarrollo de funcionalidades avanzadas (como columnas). Los problemas más urgentes son:

1. **Seguridad:** Vulnerabilidad XSS debe corregirse inmediatamente
2. **Funcionalidad:** Anidamiento de bloques está definido pero no implementado
3. **Integración:** El componente principal no se está usando en la aplicación

Una vez corregidos estos problemas críticos, el proyecto estará listo para implementar la funcionalidad de columnas (P0 del roadmap).

---

**Fin del Reporte**

