import { useState, useEffect, useRef } from 'preact/hooks';
import { METODOS, LISTA_METODOS, type MetodoData } from '../../config';

interface Props {
  initialMethodId?: string;
}

export default function ExtractionDial({ initialMethodId = 'v60' }: Props) {
  const [selectedId, setSelectedId] = useState<string>(initialMethodId);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tazamo_active_method');
      if (saved && METODOS[saved]) {
        setSelectedId(saved);
      }
    } catch (e) {
      // localStorage bloqueado o inaccesible (ignorar silenciosamente)
    }
  }, []);

  const selectMethod = (id: string) => {
    if (id === selectedId) return;
    setIsPouring(true);
    setSelectedId(id);

    try {
      localStorage.setItem('tazamo_active_method', id);
      window.dispatchEvent(new CustomEvent('tazamo:method-changed', { detail: { method: id } }));
    } catch (e) {}

    setTimeout(() => {
      setIsPouring(false);
    }, 700);
  };

  const current: MetodoData = METODOS[selectedId] || METODOS.v60;

  // Clases y colores de tueste según DESIGN.md
  const getTuesteBadgeClass = (nivel: string) => {
    switch (nivel) {
      case 'crudo':
        return 'bg-tueste-crudo text-espresso';
      case 'claro':
        return 'bg-tueste-claro text-espresso';
      case 'medio':
        return 'bg-tueste-medio text-espresso';
      case 'oscuro':
        return 'bg-tueste-oscuro text-porcelana';
      case 'espresso':
        return 'bg-tueste-espresso text-porcelana';
      default:
        return 'bg-tueste-claro text-espresso';
    }
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % LISTA_METODOS.length;
      selectMethod(LISTA_METODOS[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + LISTA_METODOS.length) % LISTA_METODOS.length;
      selectMethod(LISTA_METODOS[nextIndex].id);
    }
  };

  return (
    <div className="w-full text-porcelana" id="dial-extraccion">
      {/* Región ARIA Live accesible */}
      <div ref={liveRegionRef} aria-live="polite" className="sr-only">
        {`Método seleccionado: ${current.nombre}. Ratio ${current.ratio}, molienda ${current.molienda}, tiempo estimado ${current.tiempo}.`}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Columna Izquierda: Rótulo editorial y Selector de 6 métodos */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-crema inline-block animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider uppercase text-humo-claro">
              Punto de partida de extracción
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-porcelana leading-[1.05] mb-5">
            Haz en casa el café <br />
            <span className="italic font-normal text-crema">que pagas</span> en la cafetería.
          </h1>

          <p className="text-humo-claro text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Calibra cualquier método en segundos, ajusta tu receta con medidas exactas y descubre el equipo honesto para tu barra personal.
          </p>

          {/* Riel de métodos interactivo accesible (radiogroup) */}
          <div 
            role="radiogroup" 
            aria-label="Selecciona un método de café para ver su punto de partida"
            className="flex flex-wrap gap-2 sm:gap-2.5 p-1.5 bg-cereza-profunda/80 rounded-lg border border-porcelana/10 mb-8"
          >
            {LISTA_METODOS.map((m, idx) => {
              const isSelected = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectMethod(m.id)}
                  onKeyDown={(e: any) => handleKeyDown(e, idx)}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all duration-base text-left min-h-[44px] flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-porcelana text-cereza-oscura font-semibold shadow-md'
                      : 'text-humo-claro hover:text-porcelana hover:bg-cereza-oscura/60'
                  }`}
                >
                  <span>{m.nombre}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-crema"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Ficha técnica con cifras tabulares */}
          <div className="bg-cereza-profunda/60 border border-porcelana/10 rounded-md p-4 sm:p-5 mb-8 backdrop-blur-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
              <div>
                <span className="block text-xs text-humo-claro mb-1">Ratio</span>
                <span className="font-display text-lg sm:text-xl text-porcelana tabular-nums">
                  {current.ratio}
                </span>
              </div>
              <div>
                <span className="block text-xs text-humo-claro mb-1">Molienda</span>
                <span className="font-display text-lg sm:text-xl text-porcelana">
                  {current.molienda}
                </span>
              </div>
              <div>
                <span className="block text-xs text-humo-claro mb-1">Tiempo</span>
                <span className="font-display text-lg sm:text-xl text-porcelana tabular-nums">
                  {current.tiempo}
                </span>
              </div>
              <div>
                <span className="block text-xs text-humo-claro mb-1">Tueste</span>
                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getTuesteBadgeClass(current.nivelTueste)}`}>
                  {current.tuesteLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Dos botones directos requeridos por DESIGN.md */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`/metodos/${current.id}`}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-pill border border-porcelana text-porcelana hover:bg-porcelana hover:text-cereza-oscura transition-all duration-fast font-medium text-sm min-h-[44px]"
            >
              Guía de {current.nombre}
            </a>
            <a
              href={`/equipo?metodo=${current.id}`}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-pill bg-crema text-espresso font-semibold hover:brightness-105 transition-all duration-fast text-sm min-h-[44px] shadow-sm"
            >
              Equipo para {current.nombre}
            </a>
          </div>
        </div>

        {/* Columna Derecha: Taza cenital animada SVG */}
        <div className="lg:col-span-5 flex justify-center items-center py-6">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-cup bg-cereza-profunda p-4 border-2 border-porcelana/20 shadow-flotante flex items-center justify-center overflow-hidden">
            {/* Asa de taza sutil */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-16 rounded-r-xl border-4 border-l-0 border-porcelana/30 pointer-events-none"></div>

            {/* Café en la taza con swirl dinámico */}
            <div className="w-full h-full rounded-cup bg-[#1A0612] relative flex items-center justify-center border border-porcelana/10 overflow-hidden">
              <svg 
                viewBox="0 0 100 100" 
                className={`w-4/5 h-4/5 transition-transform duration-pour ease-tazamo ${
                  isPouring ? 'scale-105 rotate-12' : 'scale-100 rotate-0'
                }`}
                fill="none" 
                stroke="#E8A838" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              >
                <path d={current.swirlPath} className="opacity-95" />
              </svg>

              <div className="absolute bottom-4 text-center">
                <span className="text-[11px] text-humo-claro tracking-widest uppercase font-mono bg-cereza-oscura/80 px-2 py-0.5 rounded">
                  {current.nombre}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
