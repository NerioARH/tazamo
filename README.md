# Tazamo — «Tu barra de café en casa»

Sitio web editorial de alto rendimiento sobre café de especialidad y cafetería en casa, con guías técnicas, herramientas interactivas y catálogo de equipamiento monetizado con el programa de afiliados de Amazon (Amazon Associates).

Construido con **Astro 5 (sitio estático)**, **Tailwind CSS**, **Preact (islas interactivas mínimas)** y **Content Collections con esquemas Zod**.

---

## 🚀 Puesta en marcha rápida

### Requisitos previos
- Node.js versión 20 o superior.
- npm (o pnpm).

### Instalación y desarrollo
```bash
# 1. Instalar dependencias
npm install

# 2. Generar iconos y manifest desde la identidad de marca (si es necesario)
npm run generate:assets

# 3. Iniciar servidor local de desarrollo
npm run dev

# 4. Compilar para producción (HTML estático + Pagefind)
npm run build

# 5. Vista previa de la compilación de producción
npm run preview
```

---

## 🔐 Variables de entorno (`.env`)

Crea un archivo `.env` en la raíz copiando el archivo de ejemplo:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `PUBLIC_SITE_URL` | URL canónica base del sitio web | `https://tazamo.com` |
| `PUBLIC_AMAZON_TAG_US` | Tag oficial de afiliado para Amazon Estados Unidos | `tu-tag-us-20` |
| `PUBLIC_AMAZON_TAG_ES` | Tag oficial de afiliado para Amazon España | `tu-tag-es-21` |
| `PUBLIC_NEWSLETTER_PROVIDER` | Adaptador para el proveedor del boletín dominical | `buttondown` / `convertkit` |

> [!WARNING]
> Nunca escribas tus tags de afiliado directamente en el código fuente. La utilidad `amazonLink()` en `src/config.ts` lee exclusivamente estas variables de entorno en tiempo de ejecución/compilación.

---

## 🛡️ Auditoría de Afiliados de Amazon (`npm run audit:affiliates`)

El proyecto incluye un script de auditoría estricto en `scripts/audit-affiliates.ts` que previene infracciones del acuerdo de Amazon Associates:

```bash
npm run audit:affiliates
```

El script verifica automáticamente:
1. Que ningún enlace a Amazon carezca del parámetro `tag=`.
2. Que todo enlace a Amazon declare obligatoriamente `rel="sponsored nofollow noopener"`.
3. Que no existan precios estáticos hardcodeados (como `$39` o `45 €`) en fichas de producto ni artículos (la política exige que los precios provengan en tiempo real de la API o se use el texto «Ver en Amazon»).
4. Que ningún producto afirme «Probado por nosotros» a menos que `probado: true`.
5. Que las páginas con enlaces de compra muestren el aviso legal y el microtexto «Enlace de afiliado».

---

## 📦 Cómo añadir un nuevo producto (`src/content/equipo/`)

Crea un archivo `.json` en `src/content/equipo/` con la siguiente estructura:

```json
{
  "id": "molinillo-ejemplo",
  "nombre": "Nombre comercial del producto",
  "marca": "Marca del fabricante",
  "categoria": "molinillos-manuales",
  "categoriaLabel": "Molinillos manuales",
  "metodos": ["v60", "aeropress", "moka"],
  "nivel": "intermedio",
  "tueste": "claro",
  "idealPara": "Frase sintética de una línea explicando a quién le conviene.",
  "razones": [
    "Primera razón técnica fundamental.",
    "Segunda razón técnica.",
    "Tercera razón técnica."
  ],
  "contras": [
    "Punto débil o limitación honesta del producto."
  ],
  "perfil": {
    "consumo": "1-2",
    "leche": "no",
    "tiempo": "ritual",
    "presupuesto": "medio"
  },
  "asin": {
    "us": "B08XXX1234",
    "es": "B08XXX5678"
  },
  "probado": false,
  "fechaRevision": "2026-10-31",
  "imagen": {
    "src": "/illustrations/molinillo-manual.svg",
    "alt": "Ilustración lineal de molinillo manual",
    "fuente": "ilustracion"
  },
  "orden": 9
}
```

---

## 📝 Cómo añadir una nueva guía (`src/content/guias/`)

Crea un archivo Markdown o MDX en `src/content/guias/mi-guia.md`. Debe respetar la plantilla obligatoria:

```markdown
---
titulo: "Título H1 con intención de búsqueda clara"
descripcion: "Meta descripción persuasiva de menos de 155 caracteres."
palabraClave: "palabra clave principal"
intencion: "informativa / tutorial"
metodo: "v60" # espresso | moka | prensa-francesa | v60 | aeropress | cold-brew | general
nivel: "principiante" # principiante | intermedio | pro
tiempoLectura: "5 min"
fechaPublicacion: "2026-11-01"
fechaActualizacion: "2026-11-01"
autor: "Equipo Tazamo"
borrador: true
respuestaRapida: "Resumen de 2 a 4 líneas que responde inmediatamente la duda principal antes del contenido largo."
comoLoSabemos: "Explicación honesta de qué pruebas se hicieron, mediciones de temperatura o catas."
equipoIds:
  - "molinillo-manual-c2"
  - "cono-v60-ceramica"
faq:
  - pregunta: "¿Pregunta frecuente 1?"
    respuesta: "Respuesta concisa en texto plano."
  - pregunta: "¿Pregunta frecuente 2?"
    respuesta: "Respuesta concisa."
  - pregunta: "¿Pregunta frecuente 3?"
    respuesta: "Respuesta concisa."
---

## Sección principal

Contenido redactado con rigor, usando cifras numéricas tabulares (`tabular-nums`) para gramos, ratios y tiempos.
```

---

## 📋 Checklist de lanzamiento antes de publicar

- [ ] **Verificación de marca y dominio:** Comprobar la disponibilidad del dominio `.com` o `.es` y que el nombre Tazamo no tenga registros de marca incompatibles en tu territorio (USPTO / OEPM / EUIPO).
- [ ] **Aviso de afiliados oficial:** Revisar `AFFILIATE_DISCLOSURE` en `src/config.ts` y pegar la redacción oficial exacta provista por Associates Central para tu cuenta de afiliado.
- [ ] **Reemplazar ASINs:** Sustituir los códigos `"PENDIENTE"` en `src/content/equipo/*.json` por los identificadores reales de producto de tus enlaces de afiliado de Amazon.
- [ ] **Suscripción al programa:** Publicar el sitio web con su contenido inicial antes de solicitar la cuenta de Amazon Asociados. Recuerda que dispones de 180 días desde el alta para lograr 3 ventas calificadas.
- [ ] **Auditoría final:** Ejecutar `npm run audit:affiliates` y `npm run build` para asegurar cero enlaces rotos o sin etiquetado patrocinado.

---

## 💡 Supuestos asumidos en este desarrollo

1. **Dominio base:** Se configuró `https://tazamo.com` como sitio canónico principal, con enlaces dinámicos para los mercados de España (`amazon.es`) y Estados Unidos (`amazon.com`).
2. **Autor visible:** Se asignó «Equipo Tazamo» como firma editorial por defecto para garantizar consistencia en los esquemas `Article` de JSON-LD.
3. **Imágenes de producto:** Cumpliendo estrictamente con la normativa de Amazon Asociados (que prohíbe descargar fotos de stock de productos sin usar SiteStripe o la API), se diseñaron 8 ilustraciones vectoriales lineales con el mismo grosor de trazo del logo corporativo como marcadores de alta calidad visual.
