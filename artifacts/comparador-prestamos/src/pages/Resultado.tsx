import { useMemo } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, Clock, Home, Calculator,
  CreditCard, MessageCircle, RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResultsTable } from '@/components/ResultsTable';
import { ContactForm } from '@/components/ContactForm';
import { getDynamicPersonalBanks, getDynamicHipotecarioBanks, getRatesLastUpdated, LoanType } from '@/data/banks';
import {
  buildAmortizationSchedule,
  getFirstPayment,
  getAveragePayment,
  AmortizationMethod,
} from '@/lib/calculations';
import type { CalculatedResult } from '@/pages/Comparador';

const WA = '5491140353764';

function getQueryParams(): Record<string, string> {
  const out: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((v, k) => { out[k] = v; });
  return out;
}

interface SavedParams {
  loanType: LoanType;
  amount: number;
  months: number;
  method: AmortizationMethod;
  timestamp: number;
}

function getSavedParams(): SavedParams | null {
  try {
    const raw = localStorage.getItem('calculadora_params');
    if (!raw) return null;
    return JSON.parse(raw) as SavedParams;
  } catch {
    return null;
  }
}

const METHOD_LABEL: Record<AmortizationMethod, string> = {
  frances: 'Sistema Francés',
  aleman: 'Sistema Alemán',
  americano: 'Sistema Americano',
};

export default function Resultado() {
  const params = getQueryParams();
  const status = params.status || params.collection_status || '';
  const isApproved = status === 'approved';
  const isFailed = status === 'failure' || status === 'rejected' || status === 'null';
  const isPending = status === 'pending' || status === 'in_process';

  const savedParams = getSavedParams();

  const results: CalculatedResult[] = useMemo(() => {
    if (!isApproved || !savedParams) return [];
    const { loanType, amount, months, method } = savedParams;
    const banks = loanType === 'personal'
      ? getDynamicPersonalBanks()
      : getDynamicHipotecarioBanks();
    const calculated = banks.map(bank => {
      const schedule = buildAmortizationSchedule(amount, bank.tna, months, method);
      const monthlyPayment = getFirstPayment(schedule);
      const avgMonthlyPayment = getAveragePayment(schedule);
      const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
      const totalInterest = totalPayment - amount;
      return { ...bank, monthlyPayment, avgMonthlyPayment, totalPayment, totalInterest };
    });
    calculated.sort((a, b) => a.cft - b.cft);
    return calculated.map((res, index) => ({ ...res, rank: index + 1 }));
  }, [isApproved, savedParams]);

  const bestOption = results[0];
  const worstOption = results[results.length - 1];
  const lastUpdated = getRatesLastUpdated();

  return (
    <div className="min-h-screen bg-dot-grid text-slate-900">
      {/* Header */}
      <header className="header-gradient text-primary-foreground py-5 px-6 sticky top-0 z-20 shadow-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xs">RG</span>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-none">ComparaYa</h1>
              <p className="text-primary-foreground/50 text-xs mt-0.5 font-medium">por Finanzas con Ren</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Home size={13} /> Inicio
            </Link>
            <Link href="/herramientas/tarjetas">
              <Button variant="ghost" size="sm" className="text-xs text-primary-foreground/60 hover:text-primary-foreground gap-1.5">
                <CreditCard size={13} /> Tarjetas
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24 space-y-10">

        {/* ── APPROVED ── */}
        {isApproved && savedParams && (
          <>
            {/* Payment confirmation banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3"
            >
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-800">Pago confirmado — resultado disponible</p>
                <p className="text-xs text-emerald-600">
                  Pago ID: {params.payment_id || '–'} ·{' '}
                  {lastUpdated
                    ? `Tasas actualizadas: ${new Date(lastUpdated).toLocaleDateString('es-AR')}`
                    : 'Tasas de referencia actuales'}
                </p>
              </div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-emerald-700 hover:bg-emerald-100 text-xs gap-1.5">
                  <RotateCcw size={12} /> Nueva consulta
                </Button>
              </Link>
            </motion.div>

            {/* Params summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm flex flex-wrap items-center gap-4"
            >
              <Calculator size={18} className="text-teal-600 shrink-0" />
              <div className="flex flex-wrap gap-4 text-sm">
                <span>
                  <span className="text-slate-400 text-xs">Tipo:</span>{' '}
                  <strong className="text-slate-800">
                    {savedParams.loanType === 'personal' ? 'Préstamo Personal' : 'Crédito Hipotecario'}
                  </strong>
                </span>
                <span>
                  <span className="text-slate-400 text-xs">Monto:</span>{' '}
                  <strong className="text-slate-800">
                    ${savedParams.amount.toLocaleString('es-AR')}
                  </strong>
                </span>
                <span>
                  <span className="text-slate-400 text-xs">Plazo:</span>{' '}
                  <strong className="text-slate-800">{savedParams.months} meses</strong>
                </span>
                <span>
                  <span className="text-slate-400 text-xs">Método:</span>{' '}
                  <strong className="text-slate-800">{METHOD_LABEL[savedParams.method]}</strong>
                </span>
              </div>
            </motion.div>

            {/* Recomendación directa */}
            {bestOption && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg"
              >
                <p className="text-teal-100 text-xs font-bold uppercase tracking-wide mb-2">✓ Mejor opción para tu caso</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black leading-tight">{bestOption.name}</h2>
                    <p className="text-teal-100 text-sm mt-1">TNA {bestOption.tna}% · CFT {bestOption.cft}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal-100 text-xs">Cuota estimada</p>
                    <p className="text-3xl font-black tabular-nums">
                      ${bestOption.monthlyPayment.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-teal-100 text-xs">por mes · {savedParams.months} meses</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-4 text-sm">
                  <span>Total a pagar: <strong>${bestOption.totalPayment.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</strong></span>
                  <span>Intereses: <strong>${bestOption.totalInterest.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</strong></span>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <motion.section
                className="flex flex-col gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <h2 className="text-base font-bold text-slate-800">Comparación de bancos</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Top {Math.min(results.length, 5)} bancos ordenados por costo total</p>
                </div>
                <ResultsTable
                  results={results.slice(0, 5)}
                  loanType={savedParams.loanType}
                  method={savedParams.method}
                  principal={savedParams.amount}
                  months={savedParams.months}
                  onViewDetail={() => {}}
                />
              </motion.section>
            )}

            {/* ── Contact form ── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5">
                <h2 className="text-white font-black text-lg">¿Querés que te ayude a tramitar el préstamo?</h2>
                <p className="text-teal-100 text-sm mt-1">
                  Dejá tus datos y Renzo te contacta — sin costo y sin compromiso.
                </p>
              </div>
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-2 bg-slate-950 p-6 hidden md:flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-white/50 text-xs uppercase tracking-wide font-bold">Contacto directo</p>
                    {[
                      { label: 'WhatsApp', val: 'Abrir chat', href: `https://wa.me/${WA}` },
                      { label: 'Instagram', val: '@finanzasconren', href: 'https://www.instagram.com/finanzasconren' },
                    ].map(item => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-white/60 hover:text-teal-400 transition-colors"
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-xs">{item.val}</p>
                      </a>
                    ))}
                  </div>
                  <a href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola Renzo! Vi los resultados del comparador y quiero consultar.')}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 mt-6">
                      <MessageCircle size={14} /> Consultar por WhatsApp
                    </Button>
                  </a>
                </div>
                <div className="md:col-span-3 p-6 sm:p-8">
                  <ContactForm />
                </div>
              </div>
            </motion.section>
          </>
        )}

        {/* ── PENDING ── */}
        {isPending && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 space-y-5"
          >
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock size={40} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Pago pendiente de confirmación</h2>
            <p className="text-slate-500 max-w-md">
              Tu pago está siendo procesado. En cuanto se confirme, podrás ver los resultados. Podés revisar el estado en Mercado Pago.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <RotateCcw size={14} /> Volver al inicio
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── FAILED / DEFAULT ── */}
        {(isFailed || (!isApproved && !isPending)) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 space-y-5"
          >
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center">
              <XCircle size={40} className="text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              {isFailed ? 'Pago no completado' : 'Acceso no disponible'}
            </h2>
            <p className="text-slate-500 max-w-md">
              {isFailed
                ? 'El pago fue rechazado o cancelado. Podés intentarlo nuevamente desde el inicio.'
                : 'Para ver los resultados necesitás completar el pago de $1.000 ARS.'}
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/">
                <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2">
                  <RotateCcw size={14} /> Intentar nuevamente
                </Button>
              </Link>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <MessageCircle size={14} /> Contactar a Renzo
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </main>

    </div>
  );
}
