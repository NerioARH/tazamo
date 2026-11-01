import { useState, useEffect } from 'preact/hooks';
import { METODOS } from '../../config';

export default function PersistentMethodBar() {
  const [activeMethodId, setActiveMethodId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tazamo_active_method');
      if (saved && METODOS[saved]) {
        setActiveMethodId(saved);
      }
    } catch (e) {}

    const handleMethodChanged = (e: any) => {
      if (e.detail?.method && METODOS[e.detail.method]) {
        setActiveMethodId(e.detail.method);
        setDismissed(false);
      }
    };
    window.addEventListener('tazamo:method-changed', handleMethodChanged);
    return () => window.removeEventListener('tazamo:method-changed', handleMethodChanged);
  }, []);

  if (!activeMethodId || dismissed || !METODOS[activeMethodId]) {
    return null;
  }

  const metodo = METODOS[activeMethodId];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-cereza-profunda/95 backdrop-blur-md border-t border-porcelana/15 p-3 text-porcelana shadow-flotante transition-transform duration-base">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-crema shrink-0"></span>
          <span className="text-humo-claro truncate">
            Tu método activo:{' '}
            <strong className="text-porcelana font-semibold">{metodo.nombre}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`/equipo?metodo=${metodo.id}`}
            className="px-3 py-1.5 rounded-pill bg-crema text-espresso font-semibold text-xs hover:brightness-105 min-h-[36px] flex items-center"
          >
            Equipo para {metodo.nombre}
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-humo-claro hover:text-porcelana"
            aria-label="Ocultar aviso de método"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
