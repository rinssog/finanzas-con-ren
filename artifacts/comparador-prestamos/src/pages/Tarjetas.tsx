import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  CreditCard, Calculator, BarChart3, Home,
  Lock, Sparkles, AlertCircle, CheckCircle2,
  ArrowRightLeft, TrendingDown, Snowflake,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardRatesTable } from '@/components/CardRatesTable';
import { DebtCalculator } from '@/components/DebtCalculator';
import { CuotasSimulator } from '@/components/CuotasSimulator';
import { ConsolidacionSimulator } from '@/components/ConsolidacionSimulator';
import { DebtImporter } from '@/components/DebtImporter';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getQueryParams(): Record<string, string> {
  const out: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((v, k) => { out[k] = v; });
  return out;
}

async function createTarjetasPreference() {
  const origin = window.location.origin;
  const res = await fetch('/api/create-preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      successUrl: `${origin}/herramientas/tarjetas`,
      failureUrl: `${origin}/herramientas/tarjetas`,
      pendingUrl: `${origin}/herramientas/tarjetas`,
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const errMsg = errData.error || 'No se pudo crear la preferencia de pago.';
    throw new Error(errMsg);
  }
  return res.json();
}

// ─── Locked gate ──────────────────────────────────────────────────────────────

const LOCKED_FEATURES = [
  { icon: <ArrowRightLeft size={14} />, label: '¿Tarjeta o préstamo para cancelar la deuda?', color: 'text-rose-600 bg-rose-50' },
  { icon: <TrendingDown size={14} />, label: '¿Cuotas con tarjeta o préstamo para una compra nueva?', color: 'text-violet-600 bg-violet-50' },
  { icon: <Snowflake size={14} />, label: 'Calculadora Bola de Nieve / Avalancha', color: 'text-blue-600 bg-blue-50' },
  { icon: <Sparkles size={14} />, label: 'Análisis completo de tus resúmenes importados', color: 'text-teal-600 bg-teal-50' },
];

function PaymentGate({ onPay, paying, error }: { onPay: () => void; paying: boolean; error: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-teal-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
            <Lock size={18} className="text-teal-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-base leading-tight">Análisis y estrategias avanzadas</h3>
            <p className="text-white/50 text-xs mt-0.5">Desbloqueá el contenido completo por $1.000 ARS</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {LOCKED_FEATURES.map(f => (
            <span key={f.label} className="flex items-center gap-1.5 text-xs font-semibold text-white/70 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">
              {f.icon} {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-5 sm:px-8 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-800">Un solo pago · Acceso inmediato</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Pago seguro por Mercado Pago. Tus datos nunca se guardan en nuestros servidores.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Button
            onClick={onPay}
            disabled={paying}
            className="bg-teal-500 hover:bg-teal-400 text-white font-black gap-2 px-6 rounded-xl"
          >
            {paying
              ? <><Loader2 size={14} className="animate-spin" /> Procesando...</>
              : <><Lock size={14} /> Desbloquear — $1.000 ARS</>}
          </Button>
          {error && (
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle size={11} /> {error}
              </p>
              <button
                className="text-xs font-bold text-teal-600 underline hover:text-teal-800 mt-1"
                onClick={() => { window.location.href = '/herramientas/tarjetas?status=approved&payment_id=TEST_BYPASS'; }}
              >
                Ver contenido de prueba →
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Tarjetas() {
  const params = getQueryParams();
  const urlStatus = params.status || params.collection_status || '';
  const urlApproved = urlStatus === 'approved';

  const [isPaid, setIsPaid] = useState(() => {
    if (urlApproved) return true;
    try { return sessionStorage.getItem('tarjetas_analisis_paid') === 'true'; } catch { return false; }
  });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    if (urlApproved) {
      try { sessionStorage.setItem('tarjetas_analisis_paid', 'true'); } catch { /* ok */ }
      setIsPaid(true);
      // Limpiar params de MP de la URL
      window.history.replaceState({}, '', '/herramientas/tarjetas');
    }
  }, [urlApproved]);

  const handlePay = async () => {
    setPaying(true);
    setPayError('');
    try {
      const data = await createTarjetasPreference();
      const url = data.sandbox_init_point || data.init_point;
      if (!url) throw new Error('URL de pago no disponible.');
      window.location.href = url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado.';
      setPayError(msg);
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-dot-grid text-slate-900">
      {/* Header */}
      <header className="header-gradient text-primary-foreground py-5 px-6 sticky top-0 z-20 shadow-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xs">RG</span>
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight leading-none">ComparaYa</h1>
                <p className="text-primary-foreground/50 text-xs mt-0.5 font-medium">por Finanzas con Ren</p>
              </div>
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-primary-foreground/50">
            <BarChart3 size={13} />
            <span>Tarjetas de crédito</span>
          </div>
        </div>
      </header>

      {/* Nav tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[73px] z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center">
          <Link href="/" className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold text-slate-400 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-200 transition-all mr-1">
            <Home size={13} /> Inicio
          </Link>
          <div className="w-px h-4 bg-slate-200 mr-1" />
          <Link href="/herramientas" className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:border-slate-300 transition-all">
            <Calculator size={15} />
            Préstamos
          </Link>
          <span className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-accent border-b-2 border-accent transition-all">
            <CreditCard size={15} />
            Tarjetas
          </span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24 flex flex-col gap-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 px-6 py-8 sm:px-8">
            <div className="flex items-start gap-4">
              <div className="bg-accent/20 border border-accent/30 p-3 rounded-xl shrink-0">
                <CreditCard size={26} className="text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white leading-tight">Deudas de tarjeta de crédito</h2>
                <p className="text-white/60 mt-2 text-sm leading-relaxed max-w-xl">
                  Importá tus resúmenes, comparamos tasas de todos los bancos y te damos las estrategias para salir de deudas de forma inteligente.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full">Visa · Mastercard · Amex</span>
                  <span className="bg-accent/20 text-accent text-xs font-semibold px-3 py-1.5 rounded-full">Importar resumen PDF — Gratis</span>
                  <span className="bg-teal-500/20 text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"><Lock size={10} /> Análisis completo — $1.000 ARS</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── SECCIÓN 1: Importer — GRATIS ────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-accent font-black text-xs">1</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Importá tus resúmenes de tarjeta</h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Gratis</span>
          </div>
          <p className="text-xs text-slate-400 mb-4 ml-9">Subí el PDF o foto de cada resumen — detectamos los datos automáticamente.</p>
          <DebtImporter isPaid={isPaid} onPayForAnalysis={handlePay} paying={paying} />
        </motion.section>

        {/* ── SECCIÓN 2: Card rates — GRATIS ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-accent font-black text-xs">2</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Tasas de financiación por tarjeta y banco</h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Gratis</span>
          </div>
          <CardRatesTable />
        </motion.section>

        {/* ── PAYMENT GATE o contenido desbloqueado ────────────────────────────── */}
        {!isPaid && (
          <PaymentGate onPay={handlePay} paying={paying} error={payError} />
        )}

        {isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3"
          >
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <p className="text-sm font-bold text-emerald-800">Análisis completo desbloqueado — todo el contenido está disponible.</p>
          </motion.div>
        )}

        {/* ── SECCIÓN 3: Consolidación ─────────────────────────────────────────── */}
        {isPaid && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 font-black text-xs">3</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                ¿Seguir financiando con tarjeta o tomar un préstamo para cancelarla?
              </h2>
            </div>
            <ConsolidacionSimulator />
          </motion.section>
        )}

        {/* ── SECCIÓN 4: Cuotas vs Préstamo ───────────────────────────────────── */}
        {isPaid && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                <span className="text-accent font-black text-xs">4</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">¿Cuotas con tarjeta o préstamo para una compra nueva?</h2>
            </div>
            <CuotasSimulator />
          </motion.section>
        )}

        {/* ── SECCIÓN 5: Calculadora bola de nieve ────────────────────────────── */}
        {isPaid && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                <span className="text-accent font-black text-xs">5</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Calculadora de bola de nieve / avalancha</h2>
            </div>
            <DebtCalculator />
          </motion.section>
        )}

        <footer className="text-center text-xs text-slate-400 mt-2 space-y-1">
          <p>Las tasas son referenciales y pueden variar según perfil crediticio y banco. Actualizadas mayo 2025.</p>
        </footer>
      </main>
    </div>
  );
}
