---
name: Tazamo
description: Sitio de café para amantes de la cafetería en casa. Editorial, premium y en movimiento, con guías, herramientas interactivas y una barra de equipo con enlaces de afiliado de Amazon.
language: es
colors:
  cereza-oscura: "#3A0E22"     # marca, bandas oscuras, logo
  cereza-profunda: "#24081A"   # fondos de contraste dentro de bandas cereza
  crema: "#E8A838"             # acento, botones de compra, swirl del logo
  porcelana: "#F4F6F3"         # fondo claro (blanco frío, no crema)
  espresso: "#1F1410"          # texto sobre claro
  humo: "#6B5B63"              # texto secundario sobre claro
  humo-claro: "#CDBFC6"        # texto secundario sobre cereza
  tueste-crudo: "#8FA86B"
  tueste-claro: "#E8A838"
  tueste-medio: "#B9702E"
  tueste-oscuro: "#6A3B20"
  tueste-espresso: "#2A1810"
  error: "#B3261E"
typography:
  display: { family: "Gloock", weights: [400], fallback: "Georgia, serif" }
  text: { family: "Figtree", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" }
  scale:
    display-xl: "clamp(2.75rem, 1rem + 6vw, 6rem) / 1.02"
    h1: "clamp(2.25rem, 1rem + 4vw, 4rem) / 1.05"
    h2: "clamp(1.75rem, 1rem + 2.4vw, 3rem) / 1.1"
    h3: "1.375rem / 1.25 (Figtree 600)"
    body: "1.0625rem / 1.65 (Figtree 400)"
    small: "0.875rem / 1.5"
rounded: { sm: 6px, md: 14px, lg: 28px, cup: 50%, pill: 999px }
spacing: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
motion:
  duration: { fast: 120ms, base: 240ms, pour: 700ms }
  easing: "cubic-bezier(.2,.7,.2,1)"
---

# Tazamo: sistema de diseño

## 1. Concepto

Tazamo es la barra de café de una cafetería de especialidad, trasladada a la cocina de casa. El nombre junta "taza" y "amo". La marca tiene que sentirse elegante como el mostrador de una buena cafetería y en movimiento como una barra con servicio: siempre hay algo que mirar, ajustar o probar.

El sitio no es un blog con enlaces. Es un recorrido: el visitante calibra un método, aprende cómo se hace, ve el equipo exacto y llega a Amazon sin haberlo buscado.

**Una sola apuesta audaz:** el *Dial de extracción* del hero. Todo lo demás es sobrio y disciplinado.

**Qué no es Tazamo:** no usa fondo crema con serif y terracota, ni verde Starbucks, ni marrón de cafetería genérica, ni un color neón sobre negro. Tampoco usa tarjetas idénticas con sombra suave, mayúsculas espaciadas sobre cada título, ni flechas «→» al final de cada enlace.

## 2. Color

| Rol | Token | Hex | Uso |
|---|---|---|---|
| Marca / bandas oscuras | cereza-oscura | #3A0E22 | Hero, la Barra (equipo), footer, logo |
| Profundidad | cereza-profunda | #24081A | Fondo del café en la taza, paneles dentro de bandas cereza |
| Acción | crema | #E8A838 | Botón «Ver en Amazon», swirl, foco activo |
| Superficie clara | porcelana | #F4F6F3 | Fondo general (blanco frío con matiz verdoso, evita lo "crema") |
| Texto | espresso | #1F1410 | Texto sobre porcelana |
| Texto secundario | humo / humo-claro | #6B5B63 / #CDBFC6 | Sobre claro / sobre cereza |

**Reglas**
- Crema nunca es color de texto sobre porcelana (contraste 1.92). Solo como relleno de botón con texto espresso, o como texto/trazo sobre cereza.
- Una banda oscura (cereza) por pantalla como máximo y siempre para algo que se compra o se calibra. Las bandas claras son para leer.
- El error se muestra con `error` más texto explícito, nunca solo con color.

**Contrastes verificados (WCAG)**

| Par | Ratio | Uso permitido |
|---|---|---|
| espresso / porcelana | 16.57 | Texto cuerpo |
| cereza-oscura / porcelana | 15.27 | Titulares, enlaces |
| porcelana / cereza-oscura | 15.27 | Texto sobre bandas oscuras |
| crema / cereza-oscura | 7.97 | Texto y trazos acento sobre oscuro |
| espresso / crema | 8.65 | Texto del botón de compra |
| humo / porcelana | 5.85 | Texto secundario |
| humo-claro / cereza-oscura | 9.37 | Texto secundario sobre oscuro |

### Escala de tueste: color como información
El color de cada método y producto codifica su intensidad. No es decoración: ayuda a escanear.

| Nivel | Hex | Texto sobre la etiqueta | Métodos típicos |
|---|---|---|---|
| Crudo | #8FA86B | espresso (6.85) | Cold brew, infusiones frías |
| Claro | #E8A838 | espresso (8.65) | V60, Chemex, AeroPress |
| Medio | #B9702E | espresso (4.65) | Prensa francesa, moka |
| Oscuro | #6A3B20 | porcelana (8.55) | Espresso cremoso |
| Espresso | #2A1810 | porcelana (15.63) | Cafés con leche, capuchino |

Usar solo en etiquetas (chips), el borde izquierdo de las tarjetas de producto y el punto activo del dial. Nunca como fondo de sección. `tueste-medio` no se usa como texto sobre porcelana (3.57).

## 3. Tipografía

- **Titulares: Gloock** (serif de alto contraste, un solo peso). Tiene carácter de rótulo de cafetería sin caer en el serif de revista de moda.
- **Texto e interfaz: Figtree**, geométrica y cálida, con cifras tabulares (`font-variant-numeric: tabular-nums`) para ratios, gramos y tiempos.
- Autoalojar ambas con `@fontsource` o archivos propios, `font-display: swap`, subconjunto latino.
- Línea máxima de 68 caracteres en artículos. El texto de lectura en Figtree lleva `line-height: 1.65`.
- Sentence case en todo. Sin etiquetas en mayúsculas. No resaltar una sola palabra de un titular con cursiva, color o negrita.
- Los números del dial (ratio, gramos, segundos) son parte del diseño: Gloock grande, con transición de cifras al cambiar de método.

## 4. Layout

Rejilla de 12 columnas, ancho máximo 1240 px, márgenes fluidos. El texto va alineado a la izquierda; nunca justificado. Composición editorial asimétrica: una pieza grande + piezas pequeñas, no filas de tarjetas iguales.

```
HOME
┌──────────────────────────────────────────────────────────────────────┐
│ [tazamo]  Guías  Métodos  Equipo  Herramientas      [Encontrar mi método] │
├─ HERO · cereza-oscura ───────────────────────────────────────────────┤
│  Haz en casa el café                    ┌─────────────────┐          │
│  que pagas en la cafetería.             │   taza cenital  │          │
│  Guías, recetas y el equipo             │  swirl animado  │          │
│  exacto para cada método.               └─────────────────┘          │
│  ●──────●──────●──────●──────●──────●   (dial de métodos)           │
│  Ratio 1:16 · molienda media-fina · 2:30 min                         │
│  [Guía de V60]   [Equipo para V60]                                   │
├─ PORCELANA · Empieza por aquí ───────────────────────────────────────┤
│  ┌───────────────┐ ┌──────────┐                                      │
│  │ guía larga    │ │ tip      │   (1 grande + 2 pequeñas, desiguales)│
│  │               │ ├──────────┤                                      │
│  └───────────────┘ │ tip      │                                      │
├─ CEREZA · La barra (equipo) ─────────────────────────────────────────┤
│  chips: Todos · Espresso · Moka · Prensa · V60 · AeroPress · Cold    │
│  estantería horizontal de productos (se filtra con el método elegido)│
├─ PORCELANA · Herramientas ───────────────────────────────────────────┤
│  Quiz «tu cafetera en 4 preguntas»  |  Calculadora de ratio + timer  │
├─ Tip del día (tira) · Newsletter · Footer con aviso de afiliados ────┘
```

Reglas de ritmo: bandas alternas porcelana/cereza solo dos veces en Home. Espaciado vertical de sección 96 px en escritorio y 64 px en móvil. En móvil, el dial pasa a ser un selector horizontal con deslizamiento y la taza queda arriba.

## 5. Forma, elevación y profundidad

- Motivo geométrico: el círculo (la taza vista desde arriba). Imágenes de método y avatares usan máscara circular o semicircular; las tarjetas de guía, ángulos rectos suaves (`rounded.md`).
- Sin sombras de tarjeta. La jerarquía se logra con capas tonales (cereza-oscura sobre cereza-profunda), bordes de 1 px a baja opacidad y espacio.
- Una única sombra para elementos flotantes (barra móvil, dial): `0 12px 32px -12px rgba(36,8,26,.45)`.
- Bordes de 1 px solo cuando separan información (producto de producto), no como adorno.

## 6. Movimiento

Una sola secuencia orquestada y la demás es respuesta a acciones del usuario.

1. **Carga del hero (una vez):** la taza se llena y el swirl crema se dibuja en 700 ms. Después queda quieto.
2. **Cambio de método en el dial:** el swirl se redibuja con el nuevo patrón (espresso denso, filtro más abierto), las cifras hacen cross-fade y la etiqueta de tueste cambia de color.
3. **Filtrar la barra:** los productos que no aplican se desvanecen y los demás se reordenan en 240 ms.
4. **Quiz:** cada paso entra desde la derecha; el resultado se «sirve» llenando la taza.

Sin entradas fade-up en cada sección ni hover animado en cada tarjeta. `prefers-reduced-motion: reduce` desactiva todo salvo cambios de estado instantáneos.

## 7. Componentes

**Header.** Logo principal a la izquierda, navegación de 4 enlaces, botón «Encontrar mi método» (crema, texto espresso). Fijo al hacer scroll hacia arriba; se oculta al bajar.

**Dial de extracción (hero).** Control tipo `radiogroup` con 6 puntos. Datos orientativos por método, siempre rotulados «punto de partida».

| Método | Ratio | Molienda | Tiempo | Nivel |
|---|---|---|---|---|
| Espresso | 1:2 (18 g → 36 g) | Fina | 25–30 s | Oscuro |
| Moka | Agua hasta la válvula, café sin compactar | Media-fina | 4–5 min | Medio |
| Prensa francesa | 1:15 | Gruesa | 4 min | Medio |
| V60 | 1:16 | Media-fina | 2:30–3:00 | Claro |
| AeroPress | 1:14 | Media | 1:30–2:00 | Claro |
| Cold brew | 1:8 (concentrado) | Gruesa | 12–18 h | Crudo |

Accesible: flechas del teclado cambian el método, el valor activo se anuncia con `aria-live="polite"`, foco visible de 3 px en crema.

**Riel de métodos (chips).** Etiquetas con color de tueste. Al elegir un método se guarda en `localStorage` (con try/catch) y personaliza el resto del sitio: la barra se filtra, los artículos sugieren ese equipo y la barra móvil dice «Equipo para V60».

**Tarjeta de guía.** Imagen real arriba, título en Gloock, una línea de beneficio y tiempo de lectura. Se mezclan tamaños (hero, media, tip) en vez de repetir un solo formato.

**Tarjeta de producto (afiliado).**
- Imagen (solo de fuentes que Amazon permita), nombre, línea «Ideal para…», 3 razones de elección, etiqueta de tueste/método, nivel (principiante, intermedio, pro).
- Botón «Ver en Amazon» (crema/espresso), `rel="sponsored nofollow noopener"`, abre en pestaña nueva.
- Texto «Enlace de afiliado» visible en la tarjeta. **Sin precios, estrellas ni stock** si no vienen de la API oficial.
- Etiqueta «Probado por nosotros» solo si realmente se probó.

**Quiz «Tu cafetera en 4 preguntas».** Pregunta 1 cuánto café bebes, 2 con o sin leche, 3 cuánto tiempo tienes por la mañana, 4 presupuesto (bajo, medio, alto). Resultado: 1 elección principal + 2 alternativas con motivos en una línea; botón compartir; cada resultado tiene URL propia.

**Calculadora de ratio y temporizador.** Entrada: gramos de café o ml de agua. Salida: ratio, molienda y cronómetro con fases (floración, vertido, final). Cifras tabulares, botones grandes táctiles (mínimo 44 px).

**Tip rápido.** Una frase de problema → solución («Tu café sabe amargo: baja la temperatura 3 °C o muele más grueso») + botón copiar. Se usa en una tira horizontal y en redes.

**Newsletter.** «La receta del domingo»: un correo semanal con una receta o un tip. Sin enlaces de afiliado de Amazon dentro del correo; se enlaza a la página de Tazamo.

**Footer.** Aviso de afiliados siempre visible y enlaces legales.

## 8. Imagen e ilustración

- Fotografía realista con texturas auténticas por material (cerámica, acero, vidrio, madera), luz natural suave, poca profundidad de campo, fondos limpios y sin recargar. Manos y rasgos naturales, sin aspecto de IA, sin plastilina, sin collages.
- Si no hay fotos propias al lanzar: ilustración lineal de utensilios en trazo continuo (el mismo grosor del logo, 8 u relativo), en porcelana sobre cereza o cereza sobre porcelana. Nunca imágenes de stock genéricas con granos esparcidos.
- Imágenes de producto: solo las que Amazon permite usar a afiliados (SiteStripe o la API). Si no están disponibles aún, usar la ilustración lineal del tipo de producto como marcador.
- Todas las imágenes con `alt` descriptivo, `width/height` explícitos y formatos AVIF/WebP.

## 9. Voz y texto

- Español neutro y cercano, con conocimiento sin postureo. Frases cortas, verbos simples, sentence case, sin relleno.
- Se nombra a las cosas como las busca la gente: «molinillo manual», «cafetera italiana», no «dispositivo de molienda».
- Los botones dicen qué pasa: «Ver en Amazon», «Encontrar mi método», «Calcular mi ratio», «Suscribirme». Una acción mantiene su nombre en todo el flujo.
- Errores y vacíos explican qué pasó y qué hacer, sin disculpas: «Elige un método para ver el equipo». 
- Notas de variante cuando importe: «taza/pocillo», «cafetera italiana/greca/moka», «molinillo/molino».

## 10. Marca y logo

**Nombre:** Tazamo. **Descriptor:** «Tu barra de café en casa» (en Figtree 500).
**Concepto del logo:** una taza vista desde arriba con un swirl de crema. En el logo principal la «o» final es la taza; el isotipo (taza con asa) es la versión compacta. El trazo es continuo y geométrico, como una línea dibujada sin levantar la pluma.

**Archivos en `brand/` (SVG vectorial, fuente maestra)**

| Archivo | Uso |
|---|---|
| tazamo-logo-principal.svg | Sobre porcelana o blanco |
| tazamo-logo-reverso.svg | Sobre cereza o fondos oscuros |
| tazamo-logo-negro.svg / -blanco.svg | Una sola tinta (sellos, impresión, grabado) |
| tazamo-logo-vertical(.svg, -reverso, -negro, -blanco) | Formatos cuadrados, portadas, empaque |
| tazamo-isotipo-color / -reverso / -negro / -blanco.svg | Sellos, marca de agua, iconos |
| tazamo-avatar.svg | Foto de perfil de redes e icono de app |
| tazamo-favicon.svg | Favicon (simplificado para 16–32 px) |
| tazamo-og-1200x630.svg | Imagen base para compartir |
| tazamo-brand-board.svg | Resumen visual de la identidad |

**Espacio libre:** mínimo igual a la mitad de la altura de la «a» alrededor del logo. **Tamaños mínimos:** logo principal 88 px de ancho (22 mm en impresión), vertical 64 px, isotipo 24 px; por debajo, usar el favicon.
**Exportar PNG** desde los SVG (sharp, Inkscape o similar): favicon 32, apple-touch-icon 180, iconos 192 y 512, avatar 1024, OG 1200×630. Antes de imprimir, convertir trazos a contornos.

**Usos incorrectos:** cambiar los colores fuera de las variantes; añadir sombras, bordes o degradados; estirar; escribir el nombre con otra tipografía; poner el logo sobre fotos sin una capa cereza; usar la versión crema como texto sobre porcelana.

## 11. Calidad mínima (sin excepciones)

- Responsive de 360 px a 1920 px. Objetivos táctiles ≥ 44 px.
- Foco de teclado visible en todo; navegación completa sin ratón; `aria-live` en el dial y el quiz.
- Contraste mínimo AA (tabla de la sección 2).
- Core Web Vitals: LCP < 2.5 s, INP < 200 ms, CLS < 0.1. El hero no puede depender de JS pesado: la taza y el swirl son SVG y el estado inicial viene renderizado.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme` (el modo oscuro usa cereza-profunda como fondo base, no negro puro).

## 12. Hacer y no hacer

**Hacer:** un solo momento memorable (el dial); color como información (escala de tueste); mezclar tamaños de pieza; textos que digan qué pasa al hacer clic; terminar cada guía con «Equipo para este método».
**No hacer:** fondos crema con serif y terracota; tarjetas idénticas con sombra; etiquetas en mayúsculas encima de cada título; numerar cosas que no son una secuencia; animar cada sección; mostrar precios o estrellas de Amazon sin la API; afirmar que algo fue «probado» si no lo fue.
