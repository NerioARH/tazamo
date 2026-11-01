import { useState, useEffect } from 'preact/hooks';
import type { ProductItem } from './BarraFilter';
import { amazonLink, AFFILIATE_BADGE_TEXT } from '../../config';

interface Props {
  products: ProductItem[];
  prefilledAnswers?: {
    consumo?: string;
    leche?: string;
    tiempo?: string;
    presupuesto?: string;
  };
}

interface Question {
  id: 'consumo' | 'leche' | 'tiempo' | 'presupuesto';
  titulo: string;
  subtitulo: string;
  opciones: {
    valor: string;
    etiqueta: string;
    detalle: string;
  }[];
}

const PREGUNTAS: Question[] = [
  {
    id: 'consumo',
    titulo: '1. ¿Cuánto café sueles preparar al día?',
    subtitulo: 'Determina la capacidad idónea de la cafetera o el molinillo.',
    opciones: [
      { valor: '1-2', etiqueta: '1 a 2 tazas', detalle: 'Para ti a solas o con acompañante matutino.' },
      { valor: '3-4', etiqueta: '3 a 4 tazas', detalle: 'Varias rondas al día o para dos personas cafeteras.' },
      { valor: '5+', etiqueta: '5 o más tazas', detalle: 'Familia, invitados frecuentes o consumo continuado.' },
    ],
  },
  {
    id: 'leche',
    titulo: '2. ¿Cómo prefieres tomar el café?',
    subtitulo: 'Define si requieres potencia de crema o delicadeza de filtro.',
    opciones: [
      { valor: 'no', etiqueta: 'Solo / negro', detalle: 'Disfrutas notas frutales, acidez y claridad aromática.' },
      { valor: 'si', etiqueta: 'Con leche emulsionada', detalle: 'Capuchinos, cortados, flat whites con textura densa.' },
      { valor: 'ambas', etiqueta: 'De ambas formas', detalle: 'Solo por la mañana, cortado o con leche por la tarde.' },
    ],
  },
  {
    id: 'tiempo',
    titulo: '3. ¿Cuánto tiempo tienes por la mañana?',
    subtitulo: 'La mejor cafetera es la que realmente vas a usar a diario.',
    opciones: [
      { valor: 'rapido', etiqueta: 'Menos de 3 minutos', detalle: 'Práctico, eficiente y con limpieza inmediata.' },
      { valor: 'medio', etiqueta: 'Entre 4 y 7 minutos', detalle: 'Tiempo justo para una preparación cuidada.' },
      { valor: 'ritual', etiqueta: 'Un ritual consciente', detalle: 'Te gusta pesar, calentar y verter con pausa.' },
    ],
  },
  {
    id: 'presupuesto',
    titulo: '4. ¿Cuál es tu presupuesto inicial?',
    subtitulo: 'Para configurar un equipo realista sin gastos superfluos.',
    opciones: [
      { valor: 'bajo', etiqueta: 'Básico (menos de 50 €)', detalle: 'Excelente taza con la mínima inversión posible.' },
      { valor: 'medio', etiqueta: 'Medio (50 a 150 €)', detalle: 'Equilibrio perfecto entre durabilidad y control.' },
      { valor: 'alto', etiqueta: 'Avanzado (+150 €)', detalle: 'Herramientas de máxima precisión y acero inoxidable.' },
    ],
  },
];

export default function CoffeeQuiz({ products, prefilledAnswers }: Props) {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    consumo: prefilledAnswers?.consumo || '',
    leche: prefilledAnswers?.leche || '',
    tiempo: prefilledAnswers?.tiempo || '',
    presupuesto: prefilledAnswers?.presupuesto || '',
  });
  const [isServing, setIsServing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Si viene con todas las respuestas por URL
    if (answers.consumo && answers.leche && answers.tiempo && answers.presupuesto) {
      setStep(4);
    }
  }, []);

  const selectOption = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Fin del quiz: animar servicio
      setIsServing(true);
      setStep(4);

      // Actualizar query params para que el resultado tenga URL compartible
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('consumo', updated.consumo);
        url.searchParams.set('leche', updated.leche);
        url.searchParams.set('tiempo', updated.tiempo);
        url.searchParams.set('presupuesto', updated.presupuesto);
        window.history.replaceState({}, '', url.toString());
      }

      setTimeout(() => {
        setIsServing(false);
      }, 700);
    }
  };

  const resetQuiz = () => {
    setAnswers({ consumo: '', leche: '', tiempo: '', presupuesto: '' });
    setStep(0);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      ['consumo', 'leche', 'tiempo', 'presupuesto'].forEach((p) => url.searchParams.delete(p));
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi método de café ideal en Tazamo',
          text: 'He descubierto mi método de café ideal con el quiz de Tazamo.',
          url: shareUrl,
        });
        return;
      } catch (e) {}
    }
    // Fallback: copiar portapapeles
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Algoritmo de puntuación contra `perfil` de cada producto
  const scoreProduct = (p: ProductItem) => {
    let score = 0;
    if (answers.consumo && p.perfil.consumo === answers.consumo) score += 2;
    if (answers.leche) {
      if (p.perfil.leche === answers.leche || p.perfil.leche === 'ambas') score += 3;
    }
    if (answers.tiempo && p.perfil.tiempo === answers.tiempo) score += 2;
    if (answers.presupuesto && p.perfil.presupuesto === answers.presupuesto) score += 2;
    return score;
  };

  const sortedProducts = [...products].sort((a, b) => scoreProduct(b) - scoreProduct(a));
  const mainProduct = sortedProducts[0] || products[0];
  const altProduct1 = sortedProducts[1] || products[1];
  const altProduct2 = sortedProducts[2] || products[2];

  // Explicación en una línea para cada resultado
  const getReason = (p: ProductItem) => {
    if (p.categoria === 'cafeteras') {
      if (p.metodos.includes('v60')) return 'Ideal para tu ritual matutino de tazas limpias y aromáticas sin leche.';
      if (p.metodos.includes('aeropress')) return 'Máxima velocidad y tolerancia si buscas rapidez sin complicaciones.';
      if (p.metodos.includes('moka')) return 'Cuerpo robusto perfecto para cafés intensos y base de leche emulsionada.';
      if (p.metodos.includes('prensa-francesa')) return 'Inmersión sin prisas que permite preparar varias tazas de golpe.';
    }
    return `Destaca por su precisión y adaptabilidad para tu consumo diario de café.`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-porcelana rounded-lg border border-espresso/10 p-6 sm:p-8 shadow-sm">
      {step < 4 ? (
        <div>
          {/* Barra de progreso */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold text-humo tracking-wider uppercase">
              Paso {step + 1} de 4
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-1.5 rounded-full transition-all ${
                    i <= step ? 'bg-crema' : 'bg-humo-claro/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-espresso mb-2">
            {PREGUNTAS[step].titulo}
          </h2>
          <p className="text-sm text-humo mb-6">
            {PREGUNTAS[step].subtitulo}
          </p>

          <div className="space-y-3">
            {PREGUNTAS[step].opciones.map((opt) => (
              <button
                key={opt.valor}
                onClick={() => selectOption(PREGUNTAS[step].id, opt.valor)}
                className="w-full text-left p-4 rounded-md border border-espresso/15 hover:border-cereza-oscura hover:bg-cereza-oscura/5 transition-all flex flex-col justify-center min-h-[52px] group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-espresso text-base group-hover:text-cereza-oscura">
                    {opt.etiqueta}
                  </span>
                  <span className="text-xs text-humo group-hover:text-espresso font-mono">
                    Elegir
                  </span>
                </div>
                <span className="text-xs text-humo mt-1">{opt.detalle}</span>
              </button>
            ))}
          </div>

          {step > 0 && (
            <div className="mt-6 pt-4 border-t border-espresso/10 flex justify-start">
              <button
                onClick={() => setStep(step - 1)}
                className="text-xs font-medium text-humo hover:text-espresso underline"
              >
                ← Volver a la pregunta anterior
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Pantalla de Resultados */
        <div className={`transition-opacity duration-pour ${isServing ? 'opacity-50' : 'opacity-100'}`}>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-crema"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cereza-oscura">
              Tu selección personalizada
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl text-espresso mb-3">
            Tu cafetera recomendada
          </h2>
          <p className="text-sm text-humo mb-8">
            En función de tus respuestas sobre consumo, tiempo y perfil de taza, esta es tu mejor opción:
          </p>

          {/* Elección Principal */}
          {mainProduct && (
            <div className="bg-cereza-oscura text-porcelana p-6 rounded-md mb-6 border-l-4 border-crema shadow-md">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-crema font-bold font-mono">
                    Elección principal
                  </span>
                  <h3 className="font-display text-2xl text-porcelana mt-0.5">
                    {mainProduct.nombre}
                  </h3>
                  <p className="text-xs text-humo-claro mt-0.5">{mainProduct.marca}</p>
                </div>
                <img
                  src={mainProduct.imagen.src}
                  alt={mainProduct.imagen.alt}
                  className="w-14 h-14 object-contain filter invert opacity-90 shrink-0"
                />
              </div>

              <p className="text-sm text-porcelana/90 my-3 leading-relaxed">
                {getReason(mainProduct)}
              </p>

              <div className="pt-4 border-t border-porcelana/15 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={amazonLink(mainProduct.asin.es, 'es')}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="px-5 py-2.5 rounded-md bg-crema text-espresso font-semibold text-xs hover:brightness-105 transition-all min-h-[44px] flex items-center gap-1.5"
                >
                  <span>Ver en Amazon</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                  </svg>
                </a>
                <span className="text-[10px] text-humo-claro">{AFFILIATE_BADGE_TEXT}</span>
              </div>
            </div>
          )}

          {/* 2 Alternativas con motivos en una línea */}
          <div className="space-y-3 mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-humo">
              Dos alternativas viables:
            </h4>
            {[altProduct1, altProduct2].filter(Boolean).map((alt, idx) => (
              <div
                key={alt.id}
                className="p-4 rounded-md border border-espresso/15 bg-porcelana hover:border-espresso/30 flex items-center justify-between gap-4"
              >
                <div>
                  <h5 className="font-display text-base text-espresso font-semibold">
                    {alt.nombre}
                  </h5>
                  <p className="text-xs text-humo mt-0.5">{getReason(alt)}</p>
                </div>
                <a
                  href={amazonLink(alt.asin.es, 'es')}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="px-3.5 py-2 rounded-md border border-espresso text-espresso hover:bg-espresso hover:text-porcelana text-xs font-medium shrink-0 min-h-[38px] flex items-center"
                >
                  Ver en Amazon
                </a>
              </div>
            ))}
          </div>

          {/* Botones de acción: compartir y reiniciar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-espresso/10">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-cereza-oscura text-porcelana text-xs font-semibold hover:bg-cereza-profunda transition-all min-h-[40px]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span>{copied ? '¡Enlace copiado al portapapeles!' : 'Compartir mi resultado'}</span>
            </button>

            <button
              onClick={resetQuiz}
              className="text-xs text-humo hover:text-espresso underline"
            >
              Volver a realizar el test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
