import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { CreditCard, Calculator, Building2, BarChart3 } from 'lucide-react';
import { CardRatesTable } from '@/components/CardRatesTable';
import { DebtCalculator } from '@/components/DebtCalculator';
import { DebtStrategyTips } from '@/components/DebtStrategyTips';
import { CuotasSimulator } from '@/components/CuotasSimulator';

export default function Tarjetas() {
  return (
    <div className="min-h-screen bg-dot-grid text-slate-900">
      {/* Header */}
      <header className="header-gradient text-primary-foreground py-5 px-6 sticky top-0 z-20 shadow-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 backdrop-blur-sm p-2.5 rounded-xl border border-accent/30">
              <Building2 size={22} className="text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">ComparaYa</h1>
              <p className="text-primary-foreground/60 text-xs mt-0.5 font-medium">Tu asesor financiero de bolsillo</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-primary-foreground/50">
            <BarChart3 size={13} />
            <span>Tarjetas de crédito</span>
          </div>
        </div>
      </header>

      {/* Nav tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[73px] z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex">
          <Link href="/" className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:border-slate-300 transition-all">
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
        {/* Hero section */}
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
                  Compará las tasas de financiación de todas las tarjetas, calculá cuánto te cuesta financiar tu saldo
                  y aprendé las estrategias más efectivas para cancelar tus deudas de forma inteligente.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full">Visa · Mastercard · Amex</span>
                  <span className="bg-accent/20 text-accent text-xs font-semibold px-3 py-1.5 rounded-full">Bola de nieve</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">Avalancha de deuda</span>
                  <span className="bg-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full">Cuotas vs. préstamo</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 1: Card rates */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-accent font-black text-xs">1</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Tasas de financiación por tarjeta y banco</h2>
          </div>
          <CardRatesTable />
        </motion.section>

        {/* Section 2: Cuotas vs Préstamo */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-accent font-black text-xs">2</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">¿Cuotas con tarjeta o préstamo personal?</h2>
          </div>
          <CuotasSimulator />
        </motion.section>

        {/* Section 3: Debt calculator */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-accent font-black text-xs">3</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Calculadora de cancelación de deudas</h2>
          </div>
          <DebtCalculator />
        </motion.section>

        {/* Section 4: Tips */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-black text-xs">4</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Estrategias y consejos para salir de deudas</h2>
          </div>
          <DebtStrategyTips />
        </motion.section>

        <footer className="text-center text-xs text-slate-400 mt-2 space-y-1">
          <p>Las tasas son referenciales y pueden variar según perfil crediticio y banco. Actualizadas mayo 2025.</p>
        </footer>
      </main>
    </div>
  );
}
