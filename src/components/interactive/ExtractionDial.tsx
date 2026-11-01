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
    } catch (e) {}
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

  const getTuesteBadgeClass = (nivel: string) => {
    switch (nivel) {
      case 'crudo': return 'bg-tueste-crudo text-espresso';
      case 'claro': return 'bg-tueste-claro text-espresso';
      case 'medio': return 'bg-tueste-medio text-espresso';
      case 'oscuro': return 'bg-tueste-oscuro text-porcelana';
      case 'espresso': return 'bg-tueste-espresso text-porcelana';
      default: return 'bg-tueste-claro text-espresso';
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

  const currentIndex = LISTA_METODOS.findIndex((m) => m.id === selectedId);

  return (
    <div className="w-full text-porcelana" id="dial-extraccion">
      {/* Región ARIA Live accesible */}
      <div ref={liveRegionRef} aria-live="polite" className="sr-only">
        {`Método seleccionado: ${current.nombre}. Ratio ${current.ratio}, molienda ${current.molienda}, tiempo estimado ${current.tiempo}.`}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Columna Izquierda: Título editorial y Dial de métodos */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Titular directo Gloock sin kickers ni etiquetas mayúsculas */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-porcelana leading-[1.04] mb-4">
            Haz en casa el café <br />
            <span className="italic font-normal text-crema">que pagas</span> en la cafetería.
          </h1>

          <p className="text-humo-claro text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-sans">
            Guías, recetas y el equipo exacto para cada método de extracción. Calibra tus variables antes de encender el fuego.
          </p>

          {/* Dial de extracción: Riel continuo de calibración analógica (exacto a DESIGN.md) */}
          <div className="mb-8">
            <div 
              role="radiogroup" 
              aria-label="Dial de métodos de extracción de café"
              className="relative py-4"
            >
              {/* Línea horizontal continua que une los 6 métodos */}
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[2px] bg-porcelana/20 pointer-events-none hidden sm:block" />

              <div className="relative flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 sm:gap-0">
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
                      className={`group relative flex sm:flex-col items-center gap-2 text-left sm:text-center focus:outline-none transition-all p-2 rounded-md sm:p-0 min-h-[44px] ${
                        isSelected ? 'text-porcelana' : 'text-humo-claro hover:text-porcelana'
                      }`}
                    >
                      {/* Punto / nodo del dial */}
                      <span 
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-base shrink-0 ${
                          isSelected
                            ? 'bg-crema border-porcelana shadow-sm scale-110'
                            : 'bg-cereza-profunda border-porcelana/40 group-hover:border-porcelana'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cereza-oscura" />}
                      </span>

                      {/* Etiqueta del método */}
                      <span className={`text-xs sm:text-[13px] font-medium transition-colors ${
                        isSelected ? 'font-semibold text-crema' : 'text-humo-claro'
                      }`}>
                        {m.nombre.split('/')[0].trim()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Datos orientativos del método (Punto de partida con cifras tabulares) */}
          <div className="p-5 rounded-md bg-cereza-profunda border border-porcelana/15 mb-8">
            <div className="text-[11px] text-humo-claro italic mb-3 font-sans">
              Parámetros de referencia para {current.nombre} (punto de partida):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="block text-[11px] text-humo-claro mb-0.5">Ratio</span>
                <span className="font-display text-lg sm:text-xl text-porcelana tabular-nums">
                  {current.ratio}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-humo-claro mb-0.5">Molienda</span>
                <span className="font-display text-lg sm:text-xl text-porcelana">
                  {current.molienda}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-humo-claro mb-0.5">Tiempo</span>
                <span className="font-display text-lg sm:text-xl text-porcelana tabular-nums">
                  {current.tiempo}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-humo-claro mb-0.5">Tueste</span>
                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getTuesteBadgeClass(current.nivelTueste)}`}>
                  {current.tuesteLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Dos botones directos requeridos por DESIGN.md (sin flechas →) */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`/metodos/${current.id}`}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-pill border border-porcelana text-porcelana hover:bg-porcelana hover:text-cereza-oscura transition-all duration-fast font-medium text-sm min-h-[44px]"
            >
              Guía de {current.nombre.split('/')[0].trim()}
            </a>
            <a
              href={`/equipo?metodo=${current.id}`}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-pill bg-crema text-espresso font-semibold hover:brightness-105 transition-all duration-fast text-sm min-h-[44px] shadow-sm"
            >
              Equipo para {current.nombre.split('/')[0].trim()}
            </a>
          </div>
        </div>

        {/* Columna Derecha: Taza cenital animada SVG */}
        <div className="lg:col-span-5 flex justify-center items-center py-4">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-cup bg-cereza-profunda p-4 border-2 border-porcelana/20 shadow-flotante flex items-center justify-center overflow-hidden">
            {/* Asa de taza sutil */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-16 rounded-r-xl border-4 border-l-0 border-porcelana/30 pointer-events-none"></div>

            {/* Café en la taza con swirl dinámico */}
            <div className="w-full h-full rounded-cup bg-[#1A0612] relative flex items-center justify-center border border-porcelana/10 overflow-hidden">
              <svg 
                viewBox="0 0 100 100" 
                className={`w-4/5 h-4/5 transition-transform duration-pour ease-tazamo ${
                  isPouring ? 'scale-105 rotate-12 opacity-80' : 'scale-100 rotate-0 opacity-95'
                }`}
                fill="none" 
                stroke="#E8A838" 
                strokeWidth="3.2" 
                strokeLinecap="round"
              >
                <path d={current.swirlPath} />
              </svg>

              <div className="absolute bottom-5 text-center">
                <span className="text-[11px] text-humo-claro uppercase tracking-widest font-mono bg-cereza-oscura/90 px-2.5 py-0.5 rounded border border-porcelana/10">
                  {current.nombre.split('/')[0].trim()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
