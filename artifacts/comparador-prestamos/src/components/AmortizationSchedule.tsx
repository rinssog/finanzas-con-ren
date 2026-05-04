import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, TrendingDown, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildAmortizationSchedule, formatCurrency, formatPercentage, AmortizationMethod } from '@/lib/calculations';
import { exportAmortizationPdf } from '@/lib/pdfExport';
import { EarlyPaymentSimulator } from './EarlyPaymentSimulator';

interface AmortizationScheduleProps {
  bankName: string;
  logo: string;
  tna: number;
  cft: number;
  principal: number;
  months: number;
  method: AmortizationMethod;
  loanType: 'personal' | 'hipotecario';
  onClose: () => void;
}

const METHOD_LABELS: Record<AmortizationMethod, string> = {
  frances: 'Sistema Francés',
  aleman: 'Sistema Alemán',
  americano: 'Sistema Americano',
};

const METHOD_DESC: Record<AmortizationMethod, string> = {
  frances: 'Cuota fija durante todo el plazo. Empezás pagando más interés y con el tiempo pagás más capital.',
  aleman: 'Amortización constante. La cuota baja cada mes porque el interés disminuye sobre el saldo.',
  americano: 'Solo pagás intereses cada mes. Al final pagás todo el capital junto (cuota final muy alta).',
};

export function AmortizationSchedule({ bankName, logo, tna, cft, principal, months, method, loanType, onClose }: AmortizationScheduleProps) {
  const [showPrepayment, setShowPrepayment] = useState(false);
  const [visibleRows, setVisibleRows] = useState(12);
  const [exporting, setExporting] = useState(false);

  const schedule = useMemo(() =>
    buildAmortizationSchedule(principal, tna, months, method),
    [principal, tna, months, method]
  );

  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const totalAmortization = schedule.reduce((s, r) => s + r.amortization, 0);
  const firstPayment = schedule[0]?.payment ?? 0;
  const lastPayment = schedule[schedule.length - 1]?.payment ?? 0;
  const interestRatio = totalPayment > 0 ? totalInterest / totalPayment : 0;

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      exportAmortizationPdf({ bankName, logo, tna, cft, principal, months, method, loanType });
      setExporting(false);
    }, 100);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/75 backdrop-blur-sm p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="bg-white w-full sm:max-w-4xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
      >
        {/* Header */}
        <div className="header-gradient text-primary-foreground px-6 py-5 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center font-black text-sm border border-white/20 text-accent">
              {logo}
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-tight">{bankName}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge className="bg-accent text-slate-900 font-bold border-none text-xs">{METHOD_LABELS[method]}</Badge>
                <span className="text-white/60 text-xs">TNA {formatPercentage(tna)} · CFT {formatPercentage(cft)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              className="text-white/80 hover:bg-white/10 hover:text-white gap-1.5 text-xs font-semibold hidden sm:flex"
              data-testid="button-export-pdf"
            >
              <FileDown size={14} />
              {exporting ? 'Generando...' : 'PDF'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/80 hover:bg-white/10 hover:text-white">
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Method description */}
        <div className="bg-accent/5 border-b border-accent/15 px-6 py-2.5 shrink-0">
          <p className="text-sm text-slate-700">
            <span className="font-bold text-accent">{METHOD_LABELS[method]}: </span>
            {METHOD_DESC[method]}
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 shrink-0 border-b border-slate-100">
          {[
            {
              label: method === 'frances' ? 'Cuota fija' : method === 'aleman' ? 'Cuota inicial' : 'Cuota mensual',
              value: formatCurrency(firstPayment),
              sub: method === 'aleman' ? `Final: ${formatCurrency(lastPayment)}` : method === 'americano' ? `Última: ${formatCurrency(lastPayment)}` : null,
              color: 'text-accent',
            },
            { label: 'Capital', value: formatCurrency(totalAmortization), sub: null, color: 'text-emerald-600' },
            { label: 'Intereses', value: formatCurrency(totalInterest), sub: `${Math.round(interestRatio * 100)}% del total`, color: 'text-rose-500' },
            { label: 'Total a pagar', value: formatCurrency(totalPayment), sub: null, color: 'text-slate-900' },
          ].map((stat, i) => (
            <div key={i} className={`px-5 py-4 ${i < 3 ? 'border-r border-slate-100' : ''}`}>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">{stat.label}</div>
              <div className={`text-lg font-black tabular-nums ${stat.color}`}>{stat.value}</div>
              {stat.sub && <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>}
            </div>
          ))}
        </div>

        {/* Interest ratio bar */}
        <div className="px-6 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium w-28 shrink-0">Capital vs Interés</span>
            <div className="flex-1 h-2.5 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: `${(1 - interestRatio) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 w-28 text-right shrink-0">
              <span className="text-accent font-bold">{Math.round((1 - interestRatio) * 100)}% cap.</span>
              {' / '}
              <span className="text-rose-500 font-bold">{Math.round(interestRatio * 100)}% int.</span>
            </span>
          </div>
        </div>

        {/* Prepayment toggle */}
        <div className="shrink-0 border-b border-slate-100">
          <button
            onClick={() => setShowPrepayment(!showPrepayment)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm font-bold text-primary hover:bg-slate-50 transition-colors"
            data-testid="button-toggle-prepayment"
          >
            <span className="flex items-center gap-2">
              <TrendingDown size={15} className="text-accent" />
              Simulador de prepago y cancelación anticipada
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-normal">
              {showPrepayment ? 'Cerrar' : 'Abrir'}
              {showPrepayment ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          <AnimatePresence>
            {showPrepayment && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 bg-slate-50/50">
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
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">Cuota</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Pago</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-rose-500 uppercase tracking-wider">Interés</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-emerald-600 uppercase tracking-wider">Capital</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">% Int.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.slice(0, visibleRows).map((row, i) => {
                const intPct = row.payment > 0 ? (row.interest / row.payment) * 100 : 0;
                const isFirst = i === 0;
                const isLast = row.period === schedule.length;
                return (
                  <motion.tr
                    key={row.period}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.015, 0.25) }}
                    className={`hover:bg-slate-50 transition-colors ${isFirst ? 'bg-accent/5' : isLast ? 'bg-rose-50/50' : ''}`}
                    data-testid={`row-amortization-${row.period}`}
                  >
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-bold tabular-nums ${isFirst ? 'text-accent' : isLast ? 'text-rose-500' : 'text-slate-400'}`}>
                        #{row.period}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-900 tabular-nums">{formatCurrency(row.payment)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      <span className="text-rose-600 font-semibold">{formatCurrency(row.interest)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      <span className="text-emerald-700 font-semibold">{formatCurrency(row.amortization)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-500 tabular-nums font-medium">{formatCurrency(row.balance)}</td>
                    <td className="px-4 py-2.5 text-right hidden sm:table-cell">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-12 h-1.5 bg-rose-100 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${100 - intPct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 w-8">{intPct.toFixed(0)}%</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {visibleRows < schedule.length && (
            <div className="text-center py-4 border-t border-slate-100 bg-slate-50/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisibleRows(v => Math.min(v + 24, schedule.length))}
                className="text-xs gap-1.5 font-semibold"
                data-testid="button-load-more-rows"
              >
                <ChevronDown size={13} />
                Ver más cuotas ({schedule.length - visibleRows} restantes)
              </Button>
            </div>
          )}

          {visibleRows >= schedule.length && schedule.length > 12 && (
            <div className="text-center py-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setVisibleRows(12)} className="text-xs gap-1 text-slate-400" data-testid="button-collapse-rows">
                <ChevronUp size={13} /> Mostrar menos
              </Button>
            </div>
          )}
        </div>

        {/* Bottom export bar */}
        <div className="shrink-0 px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            {schedule.length} cuotas · {formatCurrency(principal)} de capital
          </p>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={exporting}
            className="gap-2 font-bold text-xs bg-accent hover:bg-accent/90 text-slate-900"
            data-testid="button-export-pdf-bottom"
          >
            <FileDown size={14} />
            {exporting ? 'Generando PDF...' : 'Exportar tabla PDF'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
