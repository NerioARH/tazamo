import { useState, useEffect } from 'preact/hooks';
import { amazonLink, AFFILIATE_BADGE_TEXT, type AmazonStore } from '../../config';

export interface ProductItem {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  categoriaLabel?: string;
  metodos: string[];
  nivel: 'principiante' | 'intermedio' | 'pro';
  tueste: 'crudo' | 'claro' | 'medio' | 'oscuro' | 'espresso';
  idealPara: string;
  razones: string[];
  contras: string[];
  perfil: {
    consumo: string;
    leche: 'si' | 'no' | 'ambas';
    tiempo: 'rapido' | 'medio' | 'ritual';
    presupuesto: 'bajo' | 'medio' | 'alto';
  };
  asin: {
    us?: string;
    es?: string;
  };
  probado: boolean;
  imagen: {
    src: string;
    alt: string;
    fuente: string;
  };
}

interface Props {
  initialProducts: ProductItem[];
  isShelf?: boolean;
  showFilters?: boolean;
}

export default function BarraFilter({ initialProducts, isShelf = false, showFilters = true }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<string>('todos');
  const [selectedNivel, setSelectedNivel] = useState<string>('todos');
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<string>('todos');
  const [store, setStore] = useState<AmazonStore>('es');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlMethod = params.get('metodo');
      const urlNivel = params.get('nivel');
      const urlPresupuesto = params.get('presupuesto');

      if (urlMethod) {
        setSelectedMethod(urlMethod);
      } else {
        try {
          const saved = localStorage.getItem('tazamo_active_method');
          if (saved) setSelectedMethod(saved);
        } catch (e) {}
      }

      if (urlNivel) setSelectedNivel(urlNivel);
      if (urlPresupuesto) setSelectedPresupuesto(urlPresupuesto);

      try {
        const savedStore = localStorage.getItem('tazamo_store') as AmazonStore;
        if (savedStore === 'us' || savedStore === 'es') setStore(savedStore);
      } catch (e) {}

      const handleMethodChanged = (e: any) => {
        if (e.detail?.method) {
          setSelectedMethod(e.detail.method);
        }
      };
      window.addEventListener('tazamo:method-changed', handleMethodChanged);
      return () => window.removeEventListener('tazamo:method-changed', handleMethodChanged);
    }
  }, []);

  const changeMethod = (method: string) => {
    setSelectedMethod(method);
    updateUrl({ metodo: method === 'todos' ? null : method });
  };

  const changeNivel = (nivel: string) => {
    setSelectedNivel(nivel);
    updateUrl({ nivel: nivel === 'todos' ? null : nivel });
  };

  const changePresupuesto = (p: string) => {
    setSelectedPresupuesto(p);
    updateUrl({ presupuesto: p === 'todos' ? null : p });
  };

  const changeStore = (newStore: AmazonStore) => {
    setStore(newStore);
    try {
      localStorage.setItem('tazamo_store', newStore);
    } catch (e) {}
  };

  const updateUrl = (updated: Record<string, string | null>) => {
    if (typeof window === 'undefined' || isShelf) return;
    const url = new URL(window.location.href);
    Object.entries(updated).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    });
    window.history.replaceState({}, '', url.toString());
  };

  const filteredProducts = initialProducts.filter((p) => {
    const matchMethod = selectedMethod === 'todos' || p.metodos.includes(selectedMethod);
    const matchNivel = selectedNivel === 'todos' || p.nivel === selectedNivel;
    const matchPresupuesto = selectedPresupuesto === 'todos' || p.perfil.presupuesto === selectedPresupuesto;
    return matchMethod && matchNivel && matchPresupuesto;
  });

  const getTuesteBorderColor = (tueste: string) => {
    switch (tueste) {
      case 'crudo': return 'border-l-tueste-crudo';
      case 'claro': return 'border-l-tueste-claro';
      case 'medio': return 'border-l-tueste-medio';
      case 'oscuro': return 'border-l-tueste-oscuro';
      case 'espresso': return 'border-l-tueste-espresso';
      default: return 'border-l-crema';
    }
  };

  return (
    <div className="w-full">
      {/* Selector de tienda (España / EE. UU.) sin artificios */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-porcelana/15 text-xs font-sans">
        <span className="text-humo-claro">
          Precios actualizados en tiempo real en la tienda oficial:
        </span>
        <div className="inline-flex rounded p-1 bg-cereza-profunda border border-porcelana/15">
          <button
            onClick={() => changeStore('es')}
            className={`px-3 py-1 rounded text-xs transition-all ${
              store === 'es'
                ? 'bg-porcelana text-cereza-oscura font-semibold'
                : 'text-humo-claro hover:text-porcelana'
            }`}
          >
            Amazon España
          </button>
          <button
            onClick={() => changeStore('us')}
            className={`px-3 py-1 rounded text-xs transition-all ${
              store === 'us'
                ? 'bg-porcelana text-cereza-oscura font-semibold'
                : 'text-humo-claro hover:text-porcelana'
            }`}
          >
            Amazon EE. UU.
          </button>
        </div>
      </div>

      {/* Barra de Filtros interactiva sin kickers */}
      {showFilters && (
        <div className="space-y-4 mb-8">
          {/* Métodos */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'espresso', label: 'Espresso' },
              { id: 'moka', label: 'Moka' },
              { id: 'prensa-francesa', label: 'Prensa' },
              { id: 'v60', label: 'V60' },
              { id: 'aeropress', label: 'AeroPress' },
              { id: 'cold-brew', label: 'Cold Brew' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => changeMethod(btn.id)}
                className={`px-3.5 py-1.5 rounded-pill text-xs shrink-0 transition-all min-h-[38px] ${
                  selectedMethod === btn.id
                    ? 'bg-crema text-espresso font-semibold'
                    : 'bg-cereza-profunda text-humo-claro hover:text-porcelana border border-porcelana/15'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {!isShelf && (
            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-humo-claro">Nivel:</span>
                {['todos', 'principiante', 'intermedio', 'pro'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => changeNivel(lvl)}
                    className={`px-2.5 py-1 rounded capitalize ${
                      selectedNivel === lvl
                        ? 'bg-porcelana text-cereza-oscura font-semibold'
                        : 'text-humo-claro hover:text-porcelana'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-humo-claro">Presupuesto:</span>
                {['todos', 'bajo', 'medio', 'alto'].map((pres) => (
                  <button
                    key={pres}
                    onClick={() => changePresupuesto(pres)}
                    className={`px-2.5 py-1 rounded capitalize ${
                      selectedPresupuesto === pres
                        ? 'bg-porcelana text-cereza-oscura font-semibold'
                        : 'text-humo-claro hover:text-porcelana'
                    }`}
                  >
                    {pres}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estantería horizontal o cuadrícula */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-md bg-cereza-profunda/40 border border-porcelana/10">
          <p className="text-porcelana font-medium mb-1 font-sans">
            No hay productos registrados con esta combinación de filtros.
          </p>
          <p className="text-xs text-humo-claro mb-4 font-sans">
            Selecciona "Todos" para volver a ver la barra completa.
          </p>
          <button
            onClick={() => {
              setSelectedMethod('todos');
              setSelectedNivel('todos');
              setSelectedPresupuesto('todos');
            }}
            className="px-4 py-2 rounded-pill bg-crema text-espresso font-semibold text-xs"
          >
            Restablecer filtros
          </button>
        </div>
      ) : isShelf ? (
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-thin snap-x">
          {filteredProducts.map((p) => (
            <div key={p.id} className="w-[300px] sm:w-[320px] shrink-0 snap-start">
              <ProductCard p={p} store={store} getTuesteBorderColor={getTuesteBorderColor} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} p={p} store={store} getTuesteBorderColor={getTuesteBorderColor} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  p,
  store,
  getTuesteBorderColor,
}: {
  p: ProductItem;
  store: AmazonStore;
  getTuesteBorderColor: (t: string) => string;
}) {
  const asinCode = store === 'us' ? p.asin.us : p.asin.es;
  const targetLink = amazonLink(asinCode, store);

  return (
    <div
      className={`h-full flex flex-col justify-between bg-cereza-profunda rounded-md p-5 border-y border-r border-porcelana/15 border-l-[3px] ${getTuesteBorderColor(
        p.tueste
      )} transition-colors`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded bg-cereza-oscura p-2 flex items-center justify-center text-porcelana/80 border border-porcelana/10 shrink-0">
            <img src={p.imagen.src} alt={p.imagen.alt} className="w-10 h-10 object-contain filter invert" />
          </div>
          <div className="flex flex-col items-end gap-1 text-[11px] font-sans">
            <span className="text-humo-claro capitalize">
              {p.nivel}
            </span>
            {p.probado && (
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-tueste-crudo text-espresso">
                Probado por nosotros
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-humo-claro mb-1 font-mono">
          {p.marca}
        </p>
        <h3 className="font-display text-xl text-porcelana leading-snug mb-2">
          {p.nombre}
        </h3>

        <p className="text-xs text-humo-claro italic mb-4 leading-relaxed font-sans">
          «{p.idealPara}»
        </p>

        {/* 3 Razones */}
        <div className="space-y-1.5 mb-4 text-xs text-porcelana/90 font-sans">
          {p.razones.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-crema shrink-0 text-sm leading-none">•</span>
              <span className="leading-snug">{r}</span>
            </div>
          ))}
        </div>

        {/* Contras reales */}
        {p.contras.length > 0 && (
          <div className="p-2.5 rounded bg-cereza-oscura border border-porcelana/10 mb-5 text-[11px] text-humo-claro font-sans">
            <span className="font-semibold text-porcelana block mb-1">A tener en cuenta:</span>
            {p.contras.map((c, i) => (
              <p key={i} className="leading-snug">
                — {c}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-porcelana/15">
        <a
          href={targetLink}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-crema text-espresso font-semibold text-sm hover:brightness-105 transition-all min-h-[44px]"
        >
          <span>Ver en Amazon</span>
        </a>
        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-humo-claro font-sans">
          <span>{AFFILIATE_BADGE_TEXT}</span>
          <span>{store === 'es' ? 'Amazon España' : 'Amazon EE. UU.'}</span>
        </div>
      </div>
    </div>
  );
}
