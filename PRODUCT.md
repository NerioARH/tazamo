# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Aficionados y principiantes hispanohablantes que preparan café en su cocina (mercados prioritarios: España y Estados Unidos / Latinoamérica). 

- **Situación:** Preparan café por la mañana o sobremesa en cafetera italiana, filtro manual, prensa o espresso básico, enfrentando resultados inconsistentes (café amargo, quemado o aguado) o dudas sobre qué equipamiento comprar sin gastar de más.
- **Trabajo del usuario (Jobs-to-be-Done):** Calibrar su método en segundos, entender por qué falló su última taza y encontrar equipo fiable evaluado con sus pros y contras reales.

## Product Purpose

Democratizar el café de especialidad trasladando el rigor y la experiencia de una barra profesional a la cocina doméstica.

- **Para el usuario:** Servir como guía de referencia de cabecera con recetas exactas (ratios, gramos, tiempos y temperaturas) y herramientas interactivas que resuelven dudas al instante.
- **Para el negocio:** Generar tráfico orgánico de calidad (SEO editorial) que convierta en compras cualificadas de afiliados en Amazon (sin trucos ni spam) y en lectores recurrentes del boletín semanal «La receta del domingo».

## Positioning

Rigor técnico accesible con honestidad comercial innegociable.

- Frente a blogs de afiliación masivos automatizados: Tazamo no inventa valoraciones con estrellas falsas, no oculta las limitaciones de los productos recomendados y publica contras explícitas para cada herramienta.
- Frente a foros y comunidades de baristas hiperespecializadas: Tazamo traduce la química de la extracción al lenguaje cotidiano en español neutro, sin elitismo ni jerga innecesaria.

## Operating Context

- **Entorno de uso real:** La encimera de la cocina, habitualmente con el teléfono móvil en una mano al lado de la cafetera, balanza o hervidor, exigiendo objetivos táctiles grandes ($\ge 44\text{ px}$) y fuentes legibles de un vistazo.
- **Momento de compra:** El usuario busca en escritorio o móvil resolver una necesidad concreta de su método (ej. «mejor molinillo para V60») y necesita un enlace directo y veraz hacia su tienda local (Amazon España o EE. UU.).

## Capabilities and Constraints

- **Métodos calibrados:** Espresso, Moka (cafetera italiana), Prensa francesa, V60, AeroPress y Cold brew.
- **Herramientas de barra interactivas:** Dial de extracción con SVG dinámico, Quiz guiado en 4 preguntas con URL propia compartible, Calculadora de ratio dual (gramos/ml) y temporizador de extracción por fases.
- **Cumplimiento estricto de Amazon Associates:** Sin precios estáticos que puedan desactualizarse, enlaces obligatorios con `rel="sponsored nofollow noopener"`, microtexto visible de afiliación y script de auditoría automatizado (`npm run audit:affiliates`).
- **Arquitectura técnica:** Astro 5 en modo puramente estático (SSG), Tailwind CSS, islas Preact con presupuesto JS $< 20\text{ KB}$ e indexación con Pagefind.

## Brand Commitments

- **Nombre y lema:** Tazamo — «Tu barra de café en casa».
- **Voz y tono:** Cercana, divulgativa, precisa y honesta. Redacción en minúsculas en etiquetas y títulos (*sentence case*), sin exclamaciones publicitarias vacías.
- **Paleta vinculante (DESIGN.md):** `porcelana` (#F4F6F3) como fondo base limpio; `cereza-oscura` (#3A0E22) y `cereza-profunda` (#24081A) para calibración y compra; `crema` (#E8A838) exclusivamente para acentos de acción; `espresso` (#1F1410) para texto de lectura.
- **Tipografía vinculante:** `Gloock` para titulares de gran presencia editorial y `Figtree` para cuerpo e interfaz con cifras tabulares obligatorias (`tabular-nums`).
- **Activos vectoriales:** Logotipos e isotipos oficiales preservados en `/brand` sin modificaciones.

## Evidence on Hand

- **Catálogo de equipo:** 8 productos iniciales en `src/content/equipo/` con esquemas Zod e ilustraciones vectoriales continuas en `/public/illustrations/`.
- **Artículos y recetas:** 12 guías estructuradas en `src/content/guias/` (Guías 1, 2 y 4 con cuerpo completo; 3 y 5 a 12 con esquemas completos y FAQs).
- **Verificación de calidad:** Auditoría móvil Lighthouse registrada con 100 en Rendimiento, 98 en Accesibilidad y 100 en SEO.

## Product Principles

1. **Una sola audacia visual, el resto sobrio:** El Dial de extracción del hero con su taza cenital y swirl animado es el único momento memorable; el resto del sitio se mantiene disciplinado para facilitar la lectura y la decisión.
2. **Color como dato funcional:** La escala de tueste (crudo, claro, medio, oscuro, espresso) informa visualmente sobre el método y el grano en chips y bordes de tarjeta, nunca como mero adorno.
3. **Honestidad editorial transparente:** Toda recomendación comercial va acompañada de sus contras y limitaciones reales. No se afirman pruebas no efectuadas.
4. **Velocidad y accesibilidad universales:** Carga instantánea con HTML estático, compatibilidad sin JavaScript en el primer render, foco de teclado visible y contraste verificado AA.

## Accessibility & Inclusion

- Contraste de texto validado según WCAG AA (cuerpo sobre porcelana 16.57:1; texto sobre cereza 15.27:1).
- Respeto estricto a `prefers-reduced-motion` para desactivar transiciones continuas.
- Anuncios `aria-live` en el dial interactivo y temporizador de extracción.
- Terminología accesible para variantes regionales del café en el mundo hispanohablante (moka / cafetera italiana / greca; pocillo / taza).
