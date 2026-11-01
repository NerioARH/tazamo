import { useState, useEffect, useRef } from 'preact/hooks';

interface SearchItem {
  titulo: string;
  url: string;
  categoria: 'Método' | 'Guía' | 'Equipo' | 'Herramienta';
  descripcion?: string;
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  { titulo: 'V60 (Goteo manual)', url: '/metodos/v60', categoria: 'Método', descripcion: 'Ratio 1:16, molienda media-fina, tueste claro.' },
  { titulo: 'Prensa francesa', url: '/metodos/prensa-francesa', categoria: 'Método', descripcion: 'Inmersión de 4 minutos, ratio 1:15, molienda gruesa.' },
  { titulo: 'AeroPress', url: '/metodos/aeropress', categoria: 'Método', descripcion: 'Presión de émbolo rápida, ratio 1:14.' },
  { titulo: 'Cafetera italiana / Moka', url: '/metodos/moka', categoria: 'Método', descripcion: 'Vapor doméstico, cuerpo denso para café con leche.' },
  { titulo: 'Espresso en casa', url: '/metodos/espresso', categoria: 'Método', descripcion: 'Extracción a 9 bares de presión, ratio 1:2.' },
  { titulo: 'Cold brew', url: '/metodos/cold-brew', categoria: 'Método', descripcion: 'Extracción pasiva en frío durante 14 a 16 horas.' },
  { titulo: 'Por qué tu café sale amargo y cómo arreglarlo', url: '/guias/01-cafe-amargo-soluciones', categoria: 'Guía', descripcion: 'Diagnóstico en tres ajustes: molienda, agua y tiempo.' },
  { titulo: 'Ratio de café y agua: tabla completa', url: '/guias/02-ratio-cafe-agua-tabla', categoria: 'Guía', descripcion: 'Cifras exactas para cada método de extracción.' },
  { titulo: 'V60 para principiantes: receta paso a paso', url: '/guias/04-v60-principiantes-paso-a-paso', categoria: 'Guía', descripcion: 'Tutorial completo de floración y dos vertidos.' },
  { titulo: 'Molinillo manual de muelas de acero (Timemore C2)', url: '/equipo', categoria: 'Equipo', descripcion: 'Muelas cónicas CNC, 25g de capacidad.' },
  { titulo: 'Báscula digital con cronómetro integrado', url: '/equipo', categoria: 'Equipo', descripcion: 'Precisión 0,1 g y recarga USB.' },
  { titulo: 'Quiz: Tu cafetera en 4 preguntas', url: '/herramientas', categoria: 'Herramienta', descripcion: 'Encuentra tu sistema de café ideal según tu rutina.' },
  { titulo: 'Calculadora de ratio y temporizador', url: '/herramientas', categoria: 'Herramienta', descripcion: 'Calcula gramos y agua al instante con reloj por fases.' },
];

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = query.trim()
    ? STATIC_SEARCH_ITEMS.filter((item) =>
        item.titulo.toLowerCase().includes(query.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(query.toLowerCase()) ||
        item.categoria.toLowerCase().includes(query.toLowerCase())
      )
    : STATIC_SEARCH_ITEMS.slice(0, 5);

  return (
    <>
      {/* Botón visible en cabecera */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-porcelana/20 bg-cereza-profunda/50 text-humo-claro hover:text-porcelana hover:border-porcelana/40 text-xs transition-all min-h-[38px]"
        aria-label="Abrir buscador (Ctrl + K)"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cereza-oscura border border-porcelana/15 text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Diálogo modal de búsqueda */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-cereza-profunda/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-porcelana rounded-lg shadow-flotante border border-espresso/15 overflow-hidden text-espresso"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input de búsqueda */}
            <div className="flex items-center gap-3 p-4 border-b border-espresso/10 bg-white">
              <svg className="w-5 h-5 text-humo" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e: any) => setQuery(e.target.value)}
                placeholder="Busca métodos, recetas, guías o equipo..."
                className="w-full text-base bg-transparent focus:outline-none placeholder-humo"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 text-xs rounded bg-espresso/5 hover:bg-espresso/10 text-humo font-mono"
              >
                ESC
              </button>
            </div>

            {/* Resultados */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-espresso/5">
              {filteredItems.length === 0 ? (
                <div className="p-6 text-center text-humo text-sm">
                  No se encontraron resultados para «{query}».
                </div>
              ) : (
                filteredItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="block p-3 rounded-md hover:bg-cereza-oscura/5 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-espresso group-hover:text-cereza-oscura text-sm">
                        {item.titulo}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-espresso/5 text-humo">
                        {item.categoria}
                      </span>
                    </div>
                    {item.descripcion && (
                      <p className="text-xs text-humo mt-1 line-clamp-1">
                        {item.descripcion}
                      </p>
                    )}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
