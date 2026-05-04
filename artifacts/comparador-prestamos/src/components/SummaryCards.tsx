import { motion } from 'framer-motion';
import { CalculatedResult } from '@/pages/Comparador';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface SummaryCardsProps {
  bestOption: CalculatedResult;
  worstOption: CalculatedResult;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
};

export function SummaryCards({ bestOption, worstOption }: SummaryCardsProps) {
  const maxSavings = worstOption.totalPayment - bestOption.totalPayment;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Best rate */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
        <div className="relative rounded-2xl overflow-hidden shadow-lg card-glow-navy h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          {/* Teal glow blob */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-accent/20 p-1.5 rounded-lg">
                <TrendingDown size={15} className="text-accent" />
              </div>
              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Mejor TNA</span>
            </div>
            <div className="text-4xl font-black text-accent tabular-nums leading-none mb-1">
              {formatPercentage(bestOption.tna)}
            </div>
            <div className="text-white/80 text-sm font-semibold mt-2">{bestOption.name}</div>
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40">
              CFT {formatPercentage(bestOption.cft)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Best monthly payment */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white border border-slate-200/80 h-full card-glow-teal">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-xl" />
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-accent/10 p-1.5 rounded-lg">
                <Wallet size={15} className="text-accent" />
              </div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Menor Cuota</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tabular-nums leading-none mb-1">
              {formatCurrency(bestOption.monthlyPayment)}
            </div>
            <div className="text-slate-700 text-sm font-semibold mt-2">{bestOption.name}</div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
              Total: {formatCurrency(bestOption.totalPayment)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Max savings */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white border border-slate-200/80 h-full">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/60 via-emerald-500 to-emerald-400/60" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-xl" />
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-50 p-1.5 rounded-lg">
                <PiggyBank size={15} className="text-emerald-600" />
              </div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Ahorro Máx.</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 tabular-nums leading-none mb-1">
              {formatCurrency(maxSavings)}
            </div>
            <div className="text-slate-500 text-xs font-medium mt-2 leading-relaxed">
              Diferencia total entre {bestOption.name} y la opción más costosa
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
              Si elegís bien, pagás menos
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
