# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Mode

brand (sitio editorial con tienda de afiliados, no es una app ni un panel SaaS)

## Users

Aficionados y amantes del café hispanohablantes que preparan café en casa (mercados de compra: España en amazon.es y EE. UU. / Global en amazon.com).

- **Situación:** Preparan café en su cocina (moka, prensa, V60, espresso, AeroPress o cold brew) y buscan elevar el resultado de su taza diaria sin caer en el postureo de barista ni gastar de más en maquinaria innecesaria.
- **Trabajo del usuario (Jobs-to-be-Done):** Calibrar un método en segundos, solucionar problemas de sabor (amargor, sabor quemado, acidez punzante) y encontrar el equipo exacto con contras reales antes de comprar en Amazon.

## Product Purpose

Tazamo es la barra de café de una cafetería de especialidad trasladada a la cocina de casa.
- **Recorrido del visitante:** No es un blog estático con banners; es un recorrido vivo donde el visitante calibra un método, aprende la técnica, explora el equipo específico y llega a la compra en Amazon de manera natural y sin fricción ni empujones comerciales.
- **Objetivo de negocio:** Tráfico orgánico de calidad (SEO editorial) que genera compras cualificadas de afiliados en Amazon y suscriptores recurrentes al boletín dominical «La receta del domingo».

## Positioning

Rigor de cafetería de especialidad en casa con honestidad comercial incondicional.

- **Frente a blogs genéricos de afiliados de IA:** Tazamo no inventa precios ni estrellas desactualizadas; señala contras reales y limitaciones para cada producto; y ofrece herramientas interactivas nativas (Dial de extracción, Quiz de cafetera, Calculadora con cronómetro).
- **Frente al postureo barista elitista:** Explica la ciencia de la extracción en español neutro, directo y cercano, sin snobismo.

## Anti-referencias estrictas (Prohibiciones de diseño)

1. **PROHIBIDO:** Fondos crema con serif y acentos terracota de cafetería tradicional.
2. **PROHIBIDO:** Verde tipo Starbucks o marrones apagados de cafetería genérica.
3. **PROHIBIDO:** Tarjetas idénticas con sombra suave (patrón aburrido de plantilla web).
4. **PROHIBIDO:** Mayúsculas espaciadas (kickers / eyebrows) sobre cada titular.
5. **PROHIBIDO:** Flechas «→» al final de cada enlace o botón.
6. **PROHIBIDO:** Animaciones de entrada fade-up en cada sección o hovers idénticos en cada tarjeta.
7. **PROHIBIDO:** Precios, estrellas o stock inventados sin API en tiempo real.
8. **PROHIBIDO:** Modificar o regenerar los logos originales de `brand/`.

## Operating Context

- **Uso en cocina:** Pantalla móvil sobre la encimera al lado de la cafetera o balanza; requiere cifras grandes tabulares legibles a distancia de brazo y botones táctiles $\ge 44\text{ px}$.
- **Lectura editorial:** Lectura pausada en móvil o escritorio con ritmo asimétrico, tipografía de revista y espacios que no parecen cajas de software.

## Brand Commitments (Fuentes de verdad innegociables)

- **Fuentes de verdad obligatorias:** `DESIGN.md` en la raíz y la carpeta `brand/` (logos SVG). Son vinculantes: colores, tipografías (`Gloock` para display y `Figtree` para interfaz/lectura), componentes, movimiento y reglas de logo.
- **Paleta oficial:**
  - `porcelana` (`#F4F6F3`): Blanco frío mineral para superficies de lectura (evita el crema).
  - `cereza-oscura` (`#3A0E22`): Color de marca, bandas oscuras (Hero, La Barra, Footer) y logo.
  - `cereza-profunda` (`#24081A`): Fondo del café en la taza y paneles dentro de bandas cereza.
  - `crema` (`#E8A838`): Acento dinámico, botón «Ver en Amazon», swirl del logo y foco activo. Nunca como texto sobre porcelana.
  - `espresso` (`#1F1410`): Texto de lectura sobre porcelana.
  - `humo` (`#6B5B63`) y `humo-claro` (`#CDBFC6`): Textos secundarios.
- **Escala de tueste funcional:** El color codifica la intensidad del método (Crudo `#8FA86B`, Claro `#E8A838`, Medio `#B9702E`, Oscuro `#6A3B20`, Espresso `#2A1810`).
- **Una sola apuesta audaz:** El *Dial de extracción* del hero. Todo lo demás es sobrio, disciplinado y editorial.

## Product Principles

1. **Atmósfera de cafetería de especialidad viva:** Se siente como el mostrador de una cafetería de tercera ola con servicio en marcha: algo que calibrar, ajustar o catar.
2. **Composición asimétrica editorial:** En lugar de cuadrículas de tarjetas repetitivas, se mezclan piezas grandes con satélites desiguales, emulando la maquetación de una revista impresa de diseño.
3. **Honestidad comercial sin atajos:** Las contras de cada producto van visibles. Enlaces directos a Amazon con `rel="sponsored nofollow noopener"` y microtexto «Enlace de afiliado».
4. **Voz cercana y precisa:** Español neutro, frases directas, verbos activos, sin relleno.

## Accessibility & Inclusion

- Cumplimiento WCAG AA verificado en contrastes (texto espresso sobre porcelana 16.57:1; texto sobre cereza 15.27:1).
- Regiones `aria-live="polite"` en el dial y temporizador.
- Soporte estricto de `prefers-reduced-motion` y `tabular-nums` en mediciones.
