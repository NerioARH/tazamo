import { useState, useEffect, useRef } from 'preact/hooks';

interface MethodRatio {
  id: string;
  nombre: string;
  ratioMultiplier: number;
  ratioString: string;
  molienda: string;
  tiempoTotalSec: number;
  fases: {
    nombre: string;
    inicioSec: number;
    finSec: number;
    instruccion: string;
  }[];
}

const METODOS_RATIO: MethodRatio[] = [
  {
    id: 'v60',
    nombre: 'V60 (Goteo)',
    ratioMultiplier: 16,
    ratioString: '1:16',
    molienda: 'Media-fina',
    tiempoTotalSec: 165, // 2:45
    fases: [
      { nombre: 'Floración (Bloom)', inicioSec: 0, finSec: 45, instruccion: 'Vierte 3x el peso de café y deja desgasificar.' },
      { nombre: 'Vertido principal', inicioSec: 45, finSec: 110, instruccion: 'Vierte en espirales concéntricas suaves.' },
      { nombre: 'Drenaje final', inicioSec: 110, finSec: 165, instruccion: 'Swirl suave y deja drenar toda la columna de agua.' },
    ],
  },
  {
    id: 'prensa-francesa',
    nombre: 'Prensa francesa',
    ratioMultiplier: 15,
    ratioString: '1:15',
    molienda: 'Gruesa',
    tiempoTotalSec: 240, // 4:00
    fases: [
      { nombre: 'Vertido completo', inicioSec: 0, finSec: 30, instruccion: 'Vierte toda el agua de golpe sobre el café.' },
      { nombre: 'Infusión en reposo', inicioSec: 30, finSec: 210, instruccion: 'No toques el émbolo. Deja reposar pacientemente.' },
      { nombre: 'Rotura y prensado suave', inicioSec: 210, finSec: 240, instruccion: 'Rompe la costra superficial y baja el émbolo sin presionar el fondo.' },
    ],
  },
  {
    id: 'aeropress',
    nombre: 'AeroPress (Invertido)',
    ratioMultiplier: 14,
    ratioString: '1:14',
    molienda: 'Media',
    tiempoTotalSec: 105, // 1:45
    fases: [
      { nombre: 'Vertido y agitación', inicioSec: 0, finSec: 30, instruccion: 'Vierte el agua a 88 °C y agita durante 10 segundos.' },
      { nombre: 'Infusión en reposo', inicioSec: 30, finSec: 75, instruccion: 'Coloca el portafiltro con papel enjuagado.' },
      { nombre: 'Prensado constante', inicioSec: 75, finSec: 105, instruccion: 'Gira sobre la taza y prensa despacio hasta oír aire.' },
    ],
  },
  {
    id: 'espresso',
    nombre: 'Espresso',
    ratioMultiplier: 2,
    ratioString: '1:2',
    molienda: 'Fina',
    tiempoTotalSec: 30,
    fases: [
      { nombre: 'Preinfusión', inicioSec: 0, finSec: 5, instruccion: 'Saturación inicial a baja presión.' },
      { nombre: 'Extracción a 9 bares', inicioSec: 5, finSec: 25, instruccion: 'Flujo continuo con crema espesa avellana.' },
      { nombre: 'Corte de bomba', inicioSec: 25, finSec: 30, instruccion: 'Detén la extracción al alcanzar los gramos meta.' },
    ],
  },
  {
    id: 'cold-brew',
    nombre: 'Cold Brew',
    ratioMultiplier: 8,
    ratioString: '1:8',
    molienda: 'Muy gruesa',
    tiempoTotalSec: 0, // no usa timer de segundos
    fases: [
      { nombre: 'Maceración en frío', inicioSec: 0, finSec: 0, instruccion: 'Mezcla café y agua en frío y guarda en nevera 14 a 16 horas.' },
    ],
  },
];

export default function RatioCalculator() {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('v60');
  const [gramosCafe, setGramosCafe] = useState<number>(15);
  const [mlAgua, setMlAgua] = useState<number>(240);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  const activeMethod = METODOS_RATIO.find((m) => m.id === selectedMethodId) || METODOS_RATIO[0];

  const handleMethodChange = (methodId: string) => {
    setSelectedMethodId(methodId);
    const m = METODOS_RATIO.find((x) => x.id === methodId);
    if (m) {
      if (m.id === 'espresso') {
        setGramosCafe(18);
        setMlAgua(36);
      } else if (m.id === 'cold-brew') {
        setGramosCafe(60);
        setMlAgua(480);
      } else {
        const calculatedAgua = Math.round(gramosCafe * m.ratioMultiplier);
        setMlAgua(calculatedAgua);
      }
    }
    resetTimer();
  };

  const onCafeChange = (val: number) => {
    const safeVal = Math.max(1, val || 0);
    setGramosCafe(safeVal);
    setMlAgua(Math.round(safeVal * activeMethod.ratioMultiplier));
  };

  const onAguaChange = (val: number) => {
    const safeVal = Math.max(1, val || 0);
    setMlAgua(safeVal);
    setGramosCafe(parseFloat((safeVal / activeMethod.ratioMultiplier).toFixed(1)));
  };

  // Timer controls
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Format time mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine current active phase
  const currentFase = activeMethod.fases.find(
    (f) => secondsElapsed >= f.inicioSec && (f.finSec === 0 || secondsElapsed <= f.finSec)
  ) || activeMethod.fases[activeMethod.fases.length - 1];

  return (
    <div className="w-full bg-porcelana rounded-lg border border-espresso/10 p-6 sm:p-8 shadow-sm text-espresso">
      {/* Selector de método */}
      <div className="mb-6">
        <label className="block text-xs uppercase font-bold text-humo tracking-wider mb-2">
          Selecciona tu método de preparación:
        </label>
        <div className="flex flex-wrap gap-2">
          {METODOS_RATIO.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMethodChange(m.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all min-h-[44px] ${
                selectedMethodId === m.id
                  ? 'bg-cereza-oscura text-porcelana shadow-sm'
                  : 'bg-porcelana text-espresso border border-espresso/20 hover:bg-espresso/5'
              }`}
            >
              {m.nombre} ({m.ratioString})
            </button>
          ))}
        </div>
      </div>

      {/* Entradas duales reactivas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="p-4 rounded-md border border-espresso/15 bg-white">
          <label htmlFor="input-cafe" className="block text-xs font-semibold text-humo mb-1">
            Café seco molido
          </label>
          <div className="flex items-baseline gap-2">
            <input
              id="input-cafe"
              type="number"
              step="0.5"
              min="1"
              max="200"
              value={gramosCafe}
              onChange={(e: any) => onCafeChange(parseFloat(e.target.value))}
              className="font-display text-4xl font-bold text-espresso w-32 tabular-nums focus:outline-none"
            />
            <span className="text-humo font-medium text-lg">gramos</span>
          </div>
          <span className="text-[11px] text-humo mt-1 block">
            Molienda recomendada: <strong className="text-espresso">{activeMethod.molienda}</strong>
          </span>
        </div>

        <div className="p-4 rounded-md border border-espresso/15 bg-white">
          <label htmlFor="input-agua" className="block text-xs font-semibold text-humo mb-1">
            Agua caliente
          </label>
          <div className="flex items-baseline gap-2">
            <input
              id="input-agua"
              type="number"
              step="10"
              min="10"
              max="2000"
              value={mlAgua}
              onChange={(e: any) => onAguaChange(parseFloat(e.target.value))}
              className="font-display text-4xl font-bold text-espresso w-36 tabular-nums focus:outline-none"
            />
            <span className="text-humo font-medium text-lg">ml (o gramos)</span>
          </div>
          <span className="text-[11px] text-humo mt-1 block">
            Ratio aplicado: <strong className="text-espresso">{activeMethod.ratioString}</strong>
          </span>
        </div>
      </div>

      {/* Temporizador por fases (solo si el método tiene tiempo en segundos) */}
      {activeMethod.tiempoTotalSec > 0 && (
        <div className="p-6 rounded-md bg-cereza-profunda text-porcelana border border-porcelana/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-crema font-bold font-mono">
                Temporizador de extracción
              </span>
              <h3 className="font-display text-2xl text-porcelana mt-0.5">
                {activeMethod.nombre}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-humo-claro block">Objetivo estimado</span>
              <span className="text-sm font-semibold text-porcelana tabular-nums">
                {formatTime(activeMethod.tiempoTotalSec)} min
              </span>
            </div>
          </div>

          {/* Reloj con cifras tabulares grandes */}
          <div className="text-center py-6 bg-cereza-oscura/80 rounded border border-porcelana/10 mb-6">
            <div className="font-display text-6xl sm:text-7xl text-crema tabular-nums tracking-tight">
              {formatTime(secondsElapsed)}
            </div>
            {currentFase && (
              <div className="mt-3 px-4">
                <span className="inline-block px-3 py-1 rounded-pill bg-crema/20 text-crema text-xs font-semibold uppercase tracking-wider mb-1">
                  Fase activa: {currentFase.nombre}
                </span>
                <p className="text-xs text-humo-claro italic mt-1">
                  {currentFase.instruccion}
                </p>
              </div>
            )}
          </div>

          {/* Botones de control táctiles grandes (mínimo 44 px) */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`px-8 py-3.5 rounded-pill font-semibold text-sm transition-all min-h-[48px] min-w-[140px] shadow-sm flex items-center justify-center gap-2 ${
                isRunning
                  ? 'bg-porcelana text-cereza-oscura hover:bg-porcelana/90'
                  : 'bg-crema text-espresso hover:brightness-105'
              }`}
            >
              {isRunning ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>{secondsElapsed > 0 ? 'Reanudar' : 'Iniciar extracción'}</span>
                </>
              )}
            </button>

            {secondsElapsed > 0 && (
              <button
                onClick={resetTimer}
                className="px-5 py-3.5 rounded-pill border border-porcelana/30 text-porcelana hover:bg-porcelana/10 text-xs font-medium min-h-[48px] transition-all"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
