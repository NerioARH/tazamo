# Prompt maestro: construir la web de Tazamo

## Cómo usarlo

1. Descomprime `tazamo-paquete-completo.zip` en la carpeta de tu proyecto. En la raíz deben quedar `DESIGN.md` y la carpeta `brand/`.
2. Abre Claude Code (o tu agente de código) dentro de esa carpeta. Si tienes instalada la skill `frontend-design`, el prompt la activa; si no, incluye un resumen de sus reglas.
3. Reemplaza los campos entre corchetes `[ASÍ]` y pega el bloque de abajo completo.
4. El prompt pide que primero te muestre el plan de diseño. Revísalo y responde «adelante» o pide cambios.

---

## Prompt (copiar desde aquí)

```text
ROL Y MÉTODO
Eres líder de diseño e ingeniero frontend senior. Usa la skill `frontend-design` y sigue su proceso en este orden:
1) plan de diseño compacto (paleta, tipografía, layout con wireframes ASCII, principios);
2) revisión del plan contra este brief y contra DESIGN.md, corrigiendo lo que parezca genérico y diciendo qué cambiaste y por qué;
3) construcción;
4) autocrítica con capturas de pantalla (escritorio y móvil) y correcciones.
Antes de escribir código, muéstrame el plan (paso 1 y 2) y espera mi aprobación.

Si la skill no está disponible, aplica estas reglas: decisiones específicas de este proyecto, no plantillas; tipografía con intención; una sola apuesta audaz y el resto sobrio; sin fade-up en cada sección ni hover en cada tarjeta; sin mayúsculas espaciadas sobre los títulos; sin numerar lo que no es una secuencia; textos claros desde la perspectiva del usuario; calidad mínima: responsive, foco visible, reduced-motion, contraste.

FUENTES DE VERDAD
Lee primero `DESIGN.md` y la carpeta `brand/` (logos SVG). Son obligatorios: colores, tipografías (Gloock + Figtree), componentes, movimiento y reglas de logo. Si algo de este prompt choca con DESIGN.md, gana DESIGN.md. No cambies los logos ni los colores de marca.

PROYECTO
Tazamo es un sitio en español para amantes del café y de la cafetería en casa: guías y tips para preparar mejor café, herramientas interactivas y una barra de equipo con enlaces de afiliado de Amazon. Eslogan: «Tu barra de café en casa».
Objetivo de negocio: tráfico orgánico (SEO) → lectura útil → clic a Amazon (comisión de afiliado) y suscripción al newsletter.
Estilo: elegante y premium como una buena cafetería de especialidad, pero dinámico: el visitante debe poder seguir explorando (calibrar un método, hacer el quiz, filtrar el equipo) hasta llegar a la compra sin sentir que lo empujan.
Audiencia: hispanohablantes que preparan café en casa. Dos mercados de compra: EE. UU. (amazon.com) y España (amazon.es). El sitio es uno solo en español neutro con notas de variante ("taza/pocillo", "cafetera italiana/moka/greca"). Cambiar la tienda solo cambia el destino de los enlaces.
Dominio: [DOMINIO.com/.es]. Autor/a visible: [NOMBRE]. Tag de Amazon: [TAG-US] y [TAG-ES] (en variables de entorno, nunca en el código).

STACK
- Astro (sitio estático), TypeScript, Tailwind CSS con los tokens de DESIGN.md como variables CSS, contenido en MDX con Content Collections y esquemas Zod.
- Islas interactivas con Preact solo donde hace falta: Dial, Quiz, Calculadora/temporizador, Filtro de la barra, Buscador. Todo lo demás, HTML estático.
- Búsqueda estática con Pagefind. Analítica sin cookies (Plausible o similar). Despliegue pensado para Cloudflare Pages.
- Fuentes autoalojadas (@fontsource), `font-display: swap`, subconjunto latino.

ARQUITECTURA DE PÁGINAS
/                           Home (estructura exacta de DESIGN.md, sección 4)
/metodos/                   Índice de métodos
/metodos/[metodo]           Hub por método: espresso, moka, prensa-francesa, v60, aeropress, cold-brew (guía madre + enlaces a guías + equipo de ese método)
/guias/                     Índice con filtros por método y nivel
/guias/[slug]               Artículo (plantilla abajo)
/equipo/                    La barra: todo el equipo, filtrable por método, nivel y presupuesto
/equipo/[categoria]         Mejores [molinillos manuales, básculas, hervidores, espumadores…] (selección editorial)
/herramientas/              Quiz, calculadora de ratio, temporizador
/herramientas/quiz/[resultado]  Resultados con URL propia y compartibles
/recetas/                   Recetas cortas (problema → solución)
/sobre/ · /como-elegimos/ · /aviso-de-afiliados/ · /privacidad/ · /contacto/
404 útil: explica qué falta y ofrece buscador y los 6 métodos.

FUNCIONES CLAVE
1. Dial de extracción (hero). Seis métodos con los datos de la tabla de DESIGN.md (siempre rotulados "punto de partida"). Al cambiar: el swirl SVG se redibuja, cambian las cifras y la etiqueta de tueste, y aparecen dos botones: «Guía de [método]» y «Equipo para [método]». Estado inicial renderizado en el servidor; funciona sin JS (selección con enlaces ancla).
2. Método persistente. El método elegido se guarda en localStorage (con try/catch y fallback a vacío) y personaliza: la barra se filtra, los artículos sugieren ese equipo y una barra inferior móvil dice «Equipo para [método]».
3. Quiz «Tu cafetera en 4 preguntas». Preguntas: cuánto café bebes, con o sin leche, tiempo por la mañana, presupuesto. Puntúa contra los campos `perfil` de cada producto. Resultado: 1 elección principal + 2 alternativas, cada una con motivo en una línea; URL propia; botón compartir.
4. Calculadora de ratio + temporizador por fases (floración, vertido, final), con cifras tabulares y botones táctiles de 44 px.
5. La barra (equipo): estantería horizontal en Home y cuadrícula en /equipo; filtros por método, nivel y presupuesto que se reflejan en la URL (?metodo=v60).
6. Buscador (⌘K / Ctrl+K y botón visible) con Pagefind.
7. Tip del día: tira de tips (problema → solución) con botón «Copiar».
8. Newsletter «La receta del domingo». Formulario con validación clara y mensaje de éxito. Dejar un adaptador listo ([PROVEEDOR]) y NO incluir enlaces de afiliado de Amazon en los correos.

PLANTILLA DE ARTÍCULO (obligatoria en /guias/[slug])
- H1 claro con la intención de búsqueda. Debajo: autor/a, fecha de publicación y «Actualizado el…».
- «Respuesta rápida» (2–4 líneas) en la parte superior.
- Pasos o explicación, con cifras tabulares donde haya ratios, gramos y tiempos.
- Errores comunes y cómo arreglarlos.
- «Equipo que recomendamos»: 2–4 tarjetas de producto del mismo método, con contras reales.
- «Cómo lo sabemos»: quién escribe, qué se probó o se investigó (honesto).
- 3 preguntas frecuentes al final (en HTML normal; sin marcado FAQ para rich results).
- Enlaces internos: 1 al hub del método, 2 a guías relacionadas, 1 a la barra filtrada por ese método.
- Aviso de afiliados cerca del primer enlace de compra.

CONTENIDO INICIAL (borradores a pulir; validar con investigación de palabras clave antes de publicar)
Escribe esquemas y borradores honestos, marcados `borrador: true`; no publiques como definitivo nada que describa pruebas que no se hicieron.
1. Por qué tu café sale amargo y cómo arreglarlo en tres ajustes
2. Ratio de café y agua: tabla para cada método
3. Cafetera italiana: cómo evitar el sabor a quemado
4. V60 para principiantes: receta paso a paso
5. Prensa francesa: errores comunes y receta de 4 minutos
6. AeroPress: cinco recetas para empezar
7. Molinillo manual o eléctrico: cuál elegir según tu método
8. Espresso en casa: qué necesitas de verdad para empezar
9. Cómo montar leche en casa sin máquina profesional
10. Café de especialidad vs. comercial: cómo leer una etiqueta
11. Cómo descalcificar tu cafetera
12. Cuánto cuesta montar una barra de café en casa: tres presupuestos
Para cada una entrega: palabra clave principal propuesta, intención de búsqueda, esquema H2/H3, método asociado y categorías de producto que encajan (sin inventar productos concretos).

DATOS DE PRODUCTO (Content Collection `equipo`)
Campos: id, nombre, marca, categoria, metodos[], nivel (principiante|intermedio|pro), tueste (crudo|claro|medio|oscuro|espresso; define el color del chip), idealPara, razones[3], contras[1–2], perfil{consumo, leche, tiempo, presupuesto}, asin{us?, es?}, probado (boolean, por defecto false), fechaRevision, imagen{src, alt, fuente: sitestripe|api|propia|ilustracion}, orden.
Crea 8 productos de ejemplo con `asin: "PENDIENTE"` y `ilustracion` como imagen, de categorías distintas (molinillo manual, báscula, hervidor de cuello de cisne, prensa francesa, V60, moka, AeroPress, espumador). No inventes ASINs, precios ni valoraciones: los reemplazaré yo.
Utilidad `amazonLink(asin, tienda)` que genere `https://www.amazon.com/dp/ASIN?tag=TAG` o `https://www.amazon.es/dp/ASIN?tag=TAG` leyendo el tag de variables de entorno.

CUMPLIMIENTO DE AMAZON ASOCIADOS (obligatorio)
- Todo enlace a Amazon: `rel="sponsored nofollow noopener"`, `target="_blank"`, texto que diga adónde lleva («Ver en Amazon»).
- Aviso de afiliados: banner discreto en cada página con enlaces de compra, texto en el pie y microtexto «Enlace de afiliado» en cada tarjeta. La frase exacta viene de una constante `AFFILIATE_DISCLOSURE` en `src/config.ts`; déjala con un comentario TODO para que yo pegue la declaración oficial que indica Associates Central para mi tienda.
- Sin enlaces camuflados ni redirecciones propias: URL directa de Amazon con tag, o enlaces oficiales que genere Amazon.
- Sin precios, estrellas, número de reseñas ni disponibilidad si no provienen de la API oficial con fecha. Mientras tanto, usar «Ver precio en Amazon».
- Imágenes de producto solo de fuentes permitidas a afiliados; si no, ilustración lineal del tipo de producto.
- Sin enlaces de afiliado en correos, PDF ni medios fuera del sitio registrado.
- Etiqueta «Probado por nosotros» solo si `probado: true`.
- Crea `scripts/audit-affiliates.ts` y el comando `npm run audit:affiliates` que falle si encuentra: enlace a Amazon sin tag o sin rel correcto, precio en texto (patrones $ o €), «probado» sin `probado: true`, o página con enlaces sin aviso.
Estas reglas deben cotejarse con el Operating Agreement vigente de Amazon Associates; deja esa verificación como primera tarea del README.

SEO TÉCNICO
- Una H1 por página, títulos ≤ 60 caracteres, descripciones ≤ 155, canonical, Open Graph y Twitter Card; imagen OG generada por página a partir de `brand/tazamo-og-1200x630.svg`.
- Datos estructurados JSON-LD solo reales: Organization, WebSite, Article (con autor, datePublished, dateModified) y BreadcrumbList. No uses Review, AggregateRating ni Product con datos inventados; no uses HowTo/FAQ para rich results.
- sitemap.xml, robots.txt, feed RSS, URLs cortas en minúsculas sin acentos, migas de pan.
- Enlazado interno por «hub y radios»: método → guías → equipo.
- Imágenes AVIF/WebP con `width/height`, `loading="lazy"` salvo LCP, `fetchpriority="high"` en la imagen o SVG del hero.
- Core Web Vitals: LCP < 2,5 s, INP < 200 ms, CLS < 0,1. Presupuesto de JS inicial < 60 KB.
- No generes contenido en masa: Google trata las páginas producidas a escala sin valor como spam. El sitio gana con guías con criterio propio, tablas útiles y evidencia real.

ACCESIBILIDAD Y RENDIMIENTO
WCAG AA: foco visible, navegación completa por teclado, `aria-live` en el dial y el quiz, `prefers-reduced-motion` y `prefers-color-scheme` respetados, textos alternativos, contraste según la tabla de DESIGN.md.

IDENTIDAD
Usa los SVG de `brand/` tal cual. Genera desde ellos (sharp o script) `public/favicon.svg`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` y `site.webmanifest`. El header usa `tazamo-logo-principal.svg`; las bandas oscuras, `tazamo-logo-reverso.svg`.

ENTREGABLES
1. Plan de diseño aprobado (antes de construir).
2. Proyecto Astro funcionando con `npm install && npm run dev`, con las páginas y funciones anteriores.
3. 8 productos de ejemplo y 12 borradores de guía (con esquema completo para todos y cuerpo completo solo para 3: la guía 1, la 2 y la 4).
4. `README.md` en español: arranque, variables de entorno, cómo añadir un producto o una guía, checklist de lanzamiento y supuestos que hiciste.
5. Capturas de escritorio (1440) y móvil (390) de Home, un hub de método, un artículo y /equipo.
6. Resultado de `npm run build`, `npm run audit:affiliates` y Lighthouse móvil (objetivo: Rendimiento ≥ 90, Accesibilidad ≥ 95, SEO 100).

PROHIBIDO
Fondos crema con serif y terracota; tarjetas idénticas con sombra suave; mayúsculas espaciadas sobre cada título; flechas «→» al final de cada enlace; animaciones de entrada en cada sección; imágenes de stock genéricas; precios, estrellas o reseñas inventados; afirmar pruebas que no se hicieron; modificar los logos.

CIERRE
Responde en español, de forma breve. Si necesitas decidir algo que no esté en este brief, propón una opción, explica por qué en una línea y continúa.
```

---

## Antes de lanzar (no va en el prompt)

- **Nombre y dominio:** busqué «Tazamo» como marca de café y no encontré ninguna, pero no puedo comprobar dominios ni registros desde aquí. Verifica el .com/.es y la marca (USPTO, EUIPO u OEPM) antes de comprar el dominio. Alternativas por si choca: «Sorbo» y «Molino Café», con la misma verificación.
- **Cuenta de Amazon Asociados:** regístrala con la URL del sitio ya publicada. Tienes 180 días para conseguir 3 ventas calificadas; tus propias compras no cuentan.
- **Cobro:** resuelve cómo recibirás el pago antes de invertir tiempo (depósito directo solo con cuenta en USD, GBP o EUR; si no, cheque o una cuenta virtual tipo Payoneer; confirma disponibilidad en Venezuela).
- **Contenido real:** las guías ganan cuando tienen fotos, medidas y criterio propios. Los borradores son un punto de partida, no el producto final.
- **Palabras clave:** valida los 12 temas con Search Console, AlsoAsked o una herramienta de keywords antes de escribir en serio.
