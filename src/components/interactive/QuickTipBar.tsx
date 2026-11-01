import { useState } from 'preact/hooks';

interface Tip {
  problema: string;
  solucion: string;
  categoria: string;
}

const TIPS: Tip[] = [
  {
    problema: '¿Tu café sabe amargo y áspero?',
    solucion: 'Baja la temperatura del agua entre 2 °C y 4 °C o muele 2 clics más grueso.',
    categoria: 'Extracción',
  },
  {
    problema: '¿El café queda agrio como limón verde?',
    solucion: 'Muele más fino o usa agua a mayor temperatura (94–96 °C) para extraer los azúcares.',
    categoria: 'Molienda',
  },
  {
    problema: '¿Sabor a quemado en cafetera italiana?',
    solucion: 'Llena el depósito con agua ya casi hirviendo y retírala del fuego al empezar a borbotear.',
    categoria: 'Moka',
  },
  {
    problema: '¿El cono de papel V60 drena muy lento?',
    solucion: 'Estás produciendo demasiado polvo fino; cambia a muelas de acero de corte uniforme.',
    categoria: 'Filtro',
  },
];

export default function QuickTipBar() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const currentTip = TIPS[activeIdx];

  const handleCopy = () => {
    const textToCopy = `Tip de café Tazamo: ${currentTip.problema} → ${currentTip.solucion}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nextTip = () => {
    setActiveIdx((prev) => (prev + 1) % TIPS.length);
  };

  return (
    <div className="w-full bg-porcelana border-y border-espresso/10 py-5 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-cereza-oscura text-porcelana text-[11px] font-bold uppercase tracking-wider shrink-0 font-mono">
            Tip del día
          </span>
          <span className="text-xs text-humo font-medium">
            Problema → Solución rápida
          </span>
        </div>

        <div className="flex-1 text-sm text-espresso flex flex-wrap items-center gap-2">
          <strong className="text-cereza-oscura">{currentTip.problema}</strong>
          <span className="text-humo">→</span>
          <span>{currentTip.solucion}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-pill border border-espresso/20 text-espresso text-xs font-medium hover:bg-espresso hover:text-porcelana transition-all min-h-[36px] flex items-center gap-1.5"
            aria-label="Copiar este tip de café al portapapeles"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={nextTip}
            className="p-2 rounded-full hover:bg-espresso/5 text-humo hover:text-espresso transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Ver siguiente tip"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
