/**
 * Configuración global de Tazamo y utilidades de afiliación
 */

export const SITE = {
  name: 'Tazamo',
  tagline: 'Tu barra de café en casa',
  description: 'Guías, recetas, herramientas interactivas y equipo seleccionado para preparar en casa el café que pagas en la mejor cafetería de especialidad.',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://tazamo.com',
  author: 'Equipo Tazamo',
  defaultOgImage: '/brand/tazamo-og-1200x630.svg',
};

/**
 * Declaración de divulgación de afiliados de Amazon Associates.
 * TODO: Reemplazar este texto con la declaración oficial exacta requerida por
 * Amazon Associates Operating Agreement para tu región/cuenta específica antes de lanzar.
 */
export const AFFILIATE_DISCLOSURE = 
  'En calidad de Afiliado de Amazon, Tazamo obtiene ingresos por las compras adscritas que cumplen los requisitos aplicables. Esto no incrementa el precio que pagas y nos ayuda a mantener independientes nuestras guías y pruebas de equipo.';

export const AFFILIATE_BADGE_TEXT = 'Enlace de afiliado';

export type AmazonStore = 'us' | 'es';

/**
 * Genera un enlace directo a Amazon con el tag correspondiente según la tienda elegida.
 * No genera redirecciones intermedias ni camuflaje de enlaces (conforme a las directivas de Amazon Associates).
 */
export function amazonLink(asin?: string, store: AmazonStore = 'es'): string {
  if (!asin || asin === 'PENDIENTE') {
    return store === 'es' ? 'https://www.amazon.es' : 'https://www.amazon.com';
  }

  const tagUS = import.meta.env.PUBLIC_AMAZON_TAG_US || 'tazamo-20';
  const tagES = import.meta.env.PUBLIC_AMAZON_TAG_ES || 'tazamo-21';

  if (store === 'us') {
    return `https://www.amazon.com/dp/${encodeURIComponent(asin)}?tag=${encodeURIComponent(tagUS)}`;
  }
  return `https://www.amazon.es/dp/${encodeURIComponent(asin)}?tag=${encodeURIComponent(tagES)}`;
}

export interface MetodoData {
  id: string;
  nombre: string;
  ratio: string;
  molienda: string;
  tiempo: string;
  nivelTueste: 'crudo' | 'claro' | 'medio' | 'oscuro' | 'espresso';
  tuesteLabel: string;
  descripcionCorta: string;
  swirlPath: string; // SVG path d attribute for swirl
  temperatura: string;
  gramosSugeridos: number;
  aguaSugerida: number;
}

export const METODOS: Record<string, MetodoData> = {
  espresso: {
    id: 'espresso',
    nombre: 'Espresso',
    ratio: '1:2 (18 g → 36 g)',
    molienda: 'Fina',
    tiempo: '25–30 s',
    nivelTueste: 'oscuro',
    tuesteLabel: 'Oscuro',
    descripcionCorta: 'Extracción a 9 bares de presión con crema densa, cuerpo concentrado y acidez brillante.',
    swirlPath: 'M 50 50 m 0 -18 a 18 18 0 1 1 0 36 a 18 18 0 1 1 0 -36 M 50 50 m 0 -8 a 8 8 0 1 1 0 16 a 8 8 0 1 1 0 -16',
    temperatura: '93 °C',
    gramosSugeridos: 18,
    aguaSugerida: 36,
  },
  moka: {
    id: 'moka',
    nombre: 'Cafetera italiana / Moka',
    ratio: 'Agua a la válvula',
    molienda: 'Media-fina',
    tiempo: '4–5 min',
    nivelTueste: 'medio',
    tuesteLabel: 'Medio',
    descripcionCorta: 'Presión de vapor doméstica. Cuerpo denso e intenso, perfecta sola o con leche emulsionada.',
    swirlPath: 'M 30 50 C 30 35, 70 35, 70 50 C 70 65, 35 65, 40 50 C 45 38, 62 42, 60 50 C 58 55, 48 56, 50 50',
    temperatura: 'Fuego medio-bajo (con agua previa caliente)',
    gramosSugeridos: 16,
    aguaSugerida: 180,
  },
  'prensa-francesa': {
    id: 'prensa-francesa',
    nombre: 'Prensa francesa',
    ratio: '1:15 (20 g → 300 ml)',
    molienda: 'Gruesa',
    tiempo: '4:00 min',
    nivelTueste: 'medio',
    tuesteLabel: 'Medio',
    descripcionCorta: 'Inmersión completa que preserva todos los aceites naturales y aporta gran sedosidad en boca.',
    swirlPath: 'M 25 50 C 25 25, 75 25, 75 50 C 75 75, 32 72, 35 50 C 38 34, 66 38, 62 50 C 60 58, 44 58, 48 50',
    temperatura: '94 °C',
    gramosSugeridos: 20,
    aguaSugerida: 300,
  },
  v60: {
    id: 'v60',
    nombre: 'V60 (Goteo)',
    ratio: '1:16 (15 g → 240 ml)',
    molienda: 'Media-fina',
    tiempo: '2:30–3:00 min',
    nivelTueste: 'claro',
    tuesteLabel: 'Claro',
    descripcionCorta: 'Filtro cónico de papel con nervaduras espirales. Destaca notas florales, frutas y limpieza cristalina.',
    swirlPath: 'M 50 50 m 0 -28 a 28 28 0 0 1 28 28 a 28 28 0 0 1 -28 28 a 28 28 0 0 1 -28 -28 a 28 28 0 0 1 28 -28 M 50 50 m 0 -16 a 16 16 0 0 1 16 16 a 16 16 0 0 1 -16 16 a 16 16 0 0 1 -16 -16 a 16 16 0 0 1 16 -16',
    temperatura: '92–94 °C',
    gramosSugeridos: 15,
    aguaSugerida: 240,
  },
  aeropress: {
    id: 'aeropress',
    nombre: 'AeroPress',
    ratio: '1:14 (15 g → 210 ml)',
    molienda: 'Media',
    tiempo: '1:30–2:00 min',
    nivelTueste: 'claro',
    tuesteLabel: 'Claro',
    descripcionCorta: 'Infusión rápida con émbolo de presión manual. Versátil, ultra limpia y casi imposible de arruinar.',
    swirlPath: 'M 50 20 C 72 20, 80 40, 75 58 C 70 72, 45 78, 35 65 C 25 50, 35 32, 50 35 C 60 38, 62 55, 52 58 C 45 60, 42 50, 48 48',
    temperatura: '88–90 °C',
    gramosSugeridos: 15,
    aguaSugerida: 210,
  },
  'cold-brew': {
    id: 'cold-brew',
    nombre: 'Cold Brew',
    ratio: '1:8 (concentrado)',
    molienda: 'Gruesa',
    tiempo: '12–18 h',
    nivelTueste: 'crudo',
    tuesteLabel: 'Crudo',
    descripcionCorta: 'Extracción pasiva en frío. Cero amargor punzante, acidez muy baja y dulzor achocolatado persistente.',
    swirlPath: 'M 20 50 C 20 20, 80 20, 80 50 C 80 80, 24 76, 30 50 C 35 30, 70 34, 65 50 C 62 62, 40 60, 46 50',
    temperatura: 'Agua a temperatura ambiente o nevera (4–15 °C)',
    gramosSugeridos: 60,
    aguaSugerida: 480,
  },
};

export const LISTA_METODOS = Object.values(METODOS);
