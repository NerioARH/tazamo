import { useState } from 'preact/hooks';

export default function NewsletterForm() {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Por favor introduce una dirección de correo válida.');
      return;
    }

    setStatus('loading');

    // Adaptador configurable para proveedores de email (Buttondown, ConvertKit, Formspree, etc.)
    // TODO: Reemplazar este endpoint simulado por el webhook oficial de tu proveedor configurado
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage('Hubo un error al conectar. Por favor inténtalo de nuevo.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {status === 'success' ? (
        <div className="p-5 rounded-md bg-cereza-profunda border border-crema/40 text-center text-porcelana">
          <div className="w-8 h-8 rounded-full bg-crema text-espresso font-bold flex items-center justify-center mx-auto mb-2 text-sm">
            ✓
          </div>
          <h4 className="font-display text-xl text-porcelana mb-1">
            ¡Suscripción confirmada!
          </h4>
          <p className="text-xs text-humo-claro leading-relaxed">
            Te hemos enviado un correo de confirmación. Cada domingo recibirás una receta o ajuste de extracción sin promociones invasivas.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e: any) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="tu.correo@ejemplo.com"
              required
              aria-label="Correo electrónico para la newsletter"
              className="flex-1 px-4 py-3 rounded-md bg-cereza-profunda border border-porcelana/20 text-porcelana placeholder-humo-claro text-sm focus:outline-none focus:border-crema min-h-[44px]"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-md bg-crema text-espresso font-semibold text-sm hover:brightness-105 transition-all duration-fast shrink-0 min-h-[44px] flex items-center justify-center"
            >
              {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
            </button>
          </div>

          {status === 'error' && (
            <p className="text-xs text-error font-medium" role="alert">
              {errorMessage}
            </p>
          )}

          <p className="text-[11px] text-humo-claro text-center sm:text-left leading-relaxed">
            Un solo correo cada domingo con una técnica o receta de café. Sin publicidad molesta ni enlaces de afiliados en tus emails. Te das de baja con un clic.
          </p>
        </form>
      )}
    </div>
  );
}
