import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, TrendingDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildAmortizationSchedule, formatCurrency, formatPercentage, AmortizationMethod } from '@/lib/calculations';
import { EarlyPaymentSimulator } from './EarlyPaymentSimulator';

interface AmortizationScheduleProps {
  bankName: string;
  logo: string;
  tna: number;
  cft: number;
  principal: number;
  months: number;
  method: AmortizationMethod;
  onClose: () => void;
}

const METHOD_LABELS: Record<AmortizationMethod, string> = {
  frances: 'Sistema Francés',
  aleman: 'Sistema Alemán',
  americano: 'Sistema Americano'
};

const METHOD_DESC: Record<AmortizationMethod, string> = {
  frances: 'Cuota fija durante todo el plazo. Empezás pagando más interés y con el tiempo pagás más capital.',
  aleman: 'Amortización constante. La cuota baja cada mes porque el interés disminuye sobre el saldo.',
  americano: 'Solo pagás intereses cada mes. Al final pagás todo el capital junto (cuota final muy alta).'
};

export function AmortizationSchedule({ bankName, logo, tna, cft, principal, months, method, onClose }: AmortizationScheduleProps) {
  const [showPrepayment, setShowPrepayment] = useState(false);
  const [visibleRows, setVisibleRows] = useState(12);

  const schedule = useMemo(() =>
    buildAmortizationSchedule(principal, tna, months, method),
    [principal, tna, months, method]
  );

  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const totalAmortization = schedule.reduce((s, r) => s + r.amortization, 0);

  const firstPayment = schedule[0]?.payment ?? 0;
  const lastPayment = schedule[schedule.length - 1]?.payment ?? 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/70 backdrop-blur-sm p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="bg-white w-full sm:max-w-4xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-5 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm border border-white/20">
              {logo}
            </div>
            <div>
              <h2 className="text-xl font-bold">{bankName}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <Badge className="bg-accent text-primary font-bold border-none">{METHOD_LABELS[method]}</Badge>
                <span className="text-primary-foreground/80 text-sm">TNA {formatPercentage(tna)} · CFT {formatPercentage(cft)}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-white/10 shrink-0">
            <X size={20} />
          </Button>
        </div>

        {/* Method description */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 text-sm text-slate-600 shrink-0">
          <span className="font-semibold text-slate-700">{METHOD_LABELS[method]}: </span>
          {METHOD_DESC[method]}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-slate-200 shrink-0">
          <div className="px-5 py-4 border-r border-slate-100">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
              {method === 'frances' ? 'Cuota fija' : method === 'aleman' ? 'Cuota inicial' : 'Cuota mensual (int.)'}
            </div>
            <div className="text-xl font-bold text-primary">{formatCurrency(firstPayment)}</div>
            {method === 'aleman' && (
              <div className="text-xs text-slate-500 mt-0.5">Final: {formatCurrency(lastPayment)}</div>
            )}
            {method === 'americano' && (
              <div className="text-xs text-slate-500 mt-0.5">Última: {formatCurrency(lastPayment)}</div>
            )}
          </div>
          <div className="px-5 py-4 border-r border-slate-100">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Capital</div>
            <div className="text-xl font-bold text-slate-800">{formatCurrency(totalAmortization)}</div>
          </div>
          <div className="px-5 py-4 border-r border-slate-100">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Intereses totales</div>
            <div className="text-xl font-bold text-rose-600">{formatCurrency(totalInterest)}</div>
          </div>
          <div className="px-5 py-4">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Total a pagar</div>
            <div className="text-xl font-bold text-slate-900">{formatCurrency(totalPayment)}</div>
          </div>
        </div>

        {/* Prepayment toggle */}
        <div className="shrink-0 border-b border-slate-200">
          <button
            onClick={() => setShowPrepayment(!showPrepayment)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm font-semibold text-primary hover:bg-slate-50 transition-colors"
            data-testid="button-toggle-prepayment"
          >
            <span className="flex items-center gap-2">
              <TrendingDown size={16} />
              Simulador de prepago y cancelación anticipada
            </span>
            {showPrepayment ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showPrepayment && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5">
                  <EarlyPaymentSimulator
                    principal={principal}
                    tna={tna}
                    months={months}
                    method={method}
                    originalTotal={totalPayment}
                    originalInterest={totalInterest}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Amortization table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-16">Cuota</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Pago</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-rose-500 uppercase tracking-wide">Interés</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide">Capital</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.slice(0, visibleRows).map((row, i) => {
                const interestPct = row.payment > 0 ? (row.interest / row.payment) * 100 : 0;
                return (
                  <motion.tr
                    key={row.period}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className={`hover:bg-slate-50 ${i === 0 ? 'bg-primary/5' : ''}`}
                    data-testid={`row-amortization-${row.period}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-slate-400">#{row.period}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-900">{formatCurrency(row.payment)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-rose-600 font-medium">{formatCurrency(row.interest)}</span>
                      <span className="text-slate-400 text-xs ml-1">({interestPct.toFixed(0)}%)</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-emerald-700">{formatCurrency(row.amortization)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{formatCurrency(row.balance)}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {visibleRows < schedule.length && (
            <div className="text-center py-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisibleRows(v => Math.min(v + 24, schedule.length))}
                data-testid="button-load-more-rows"
              >
                Ver más cuotas ({schedule.length - visibleRows} restantes)
              </Button>
            </div>
          )}

          {visibleRows >= schedule.length && schedule.length > 12 && (
            <div className="text-center py-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleRows(12)}
                data-testid="button-collapse-rows"
              >
                <ChevronUp size={14} className="mr-1" /> Mostrar menos
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
