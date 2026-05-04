import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Zap, TrendingDown, Snowflake, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { Debt, simulateSnowball, simulateAvalanche, simulateMinimumOnly } from '@/lib/debtStrategies';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const DEFAULT_DEBTS: Debt[] = [
  { id: '1', name: 'Visa Galicia', balance: 150000, tna: 78, minPayment: 7500 },
  { id: '2', name: 'Mastercard BBVA', balance: 80000, tna: 87, minPayment: 4000 },
  { id: '3', name: 'Naranja X', balance: 35000, tna: 92, minPayment: 1750 },
];

type Strategy = 'snowball' | 'avalanche' | 'comparison';

const STRATEGY_INFO = {
  snowball: { label: 'Bola de nieve', icon: <Snowflake size={15} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  avalanche: { label: 'Avalancha', icon: <TrendingDown size={15} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  comparison: { label: 'Comparar estrategias', icon: <Zap size={15} />, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30' },
};

function generateId() {
  return Math.random().toString(36).slice(2, 8);
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-sm">
        <p className="font-bold mb-2 text-white/70">Mes {label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex justify-between gap-4">
            <span style={{ color: p.color }} className="text-xs font-semibold">{p.name}</span>
            <span className="font-bold tabular-nums">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function DebtCalculator() {
  const [debts, setDebts] = useState<Debt[]>(DEFAULT_DEBTS);
  const [extraMonthly, setExtraMonthly] = useState(20000);
  const [strategy, setStrategy] = useState<Strategy>('comparison');
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleRows, setScheduleRows] = useState(12);

  const snowball = useMemo(() => simulateSnowball(debts, extraMonthly), [debts, extraMonthly]);
  const avalanche = useMemo(() => simulateAvalanche(debts, extraMonthly), [debts, extraMonthly]);
  const minimum = useMemo(() => simulateMinimumOnly(debts), [debts]);

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinPayment = debts.reduce((s, d) => s + d.minPayment, 0);

  const addDebt = () => {
    setDebts(prev => [...prev, { id: generateId(), name: '', balance: 50000, tna: 80, minPayment: 2500 }]);
  };

  const removeDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleNumericInput = (id: string, field: keyof Debt, raw: string) => {
    const val = parseFloat(raw.replace(/\D/g, ''));
    if (!isNaN(val)) updateDebt(id, field, val);
  };

  // Chart data: monthly total balance across strategies
  const chartData = useMemo(() => {
    const maxMonths = Math.min(Math.max(snowball.months, avalanche.months, 6), 120);
    return Array.from({ length: maxMonths + 1 }, (_, i) => {
      const snRow = snowball.schedule[i - 1];
      const avRow = avalanche.schedule[i - 1];
      const mnRow = minimum.schedule[i - 1];
      return {
        month: i,
        'Bola de nieve': i === 0 ? totalDebt : (snRow?.totalBalance ?? 0),
        'Avalancha': i === 0 ? totalDebt : (avRow?.totalBalance ?? 0),
        'Solo mínimos': i === 0 ? totalDebt : (mnRow?.totalBalance ?? 0),
      };
    });
  }, [snowball, avalanche, minimum, totalDebt]);

  // Payoff order names
  const debtName = (id: string) => debts.find(d => d.id === id)?.name || id;

  const activeResult = strategy === 'snowball' ? snowball : strategy === 'avalanche' ? avalanche : snowball;
  const activeSchedule = strategy === 'snowball' ? snowball.schedule : strategy === 'avalanche' ? avalanche.schedule : snowball.schedule;

  return (
    <div className="space-y-6">
      {/* Debt list */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Mis deudas</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ingresá todas tus deudas de tarjeta para calcular la estrategia óptima</p>
          </div>
          <Button size="sm" variant="outline" onClick={addDebt} className="gap-1.5 font-semibold text-xs border-slate-300" data-testid="button-add-debt">
            <Plus size={13} /> Agregar deuda
          </Button>
        </div>

        <div className="divide-y divide-slate-100">
          {debts.map((debt, i) => (
            <motion.div
              key={debt.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-4"
              data-testid={`debt-row-${i}`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Nombre</label>
                  <Input
                    value={debt.name}
                    onChange={e => updateDebt(debt.id, 'name', e.target.value)}
                    placeholder="Ej: Visa Galicia"
                    className="h-9 text-sm"
                    data-testid={`input-debt-name-${i}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Saldo ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <Input
                      type="text"
                      value={debt.balance === 0 ? '' : debt.balance.toLocaleString('es-AR')}
                      onChange={e => handleNumericInput(debt.id, 'balance', e.target.value)}
                      className="h-9 text-sm pl-6"
                      data-testid={`input-debt-balance-${i}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">TNA (%)</label>
                  <Input
                    type="number"
                    value={debt.tna}
                    onChange={e => updateDebt(debt.id, 'tna', parseFloat(e.target.value) || 0)}
                    className="h-9 text-sm"
                    min={0}
                    max={300}
                    data-testid={`input-debt-tna-${i}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Pago mínimo ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <Input
                      type="text"
                      value={debt.minPayment === 0 ? '' : debt.minPayment.toLocaleString('es-AR')}
                      onChange={e => handleNumericInput(debt.id, 'minPayment', e.target.value)}
                      className="h-9 text-sm pl-6"
                      data-testid={`input-debt-min-${i}`}
                    />
                  </div>
                </div>
                <div className="flex items-end justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                    onClick={() => removeDebt(debt.id)}
                    disabled={debts.length === 1}
                    data-testid={`button-remove-debt-${i}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra monthly payment */}
        <div className="px-6 py-4 bg-accent/5 border-t border-accent/15">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <label className="text-sm font-bold text-slate-800 block">Pago extra mensual disponible</label>
              <p className="text-xs text-slate-500 mt-0.5">Dinero adicional que podés destinar a deudas cada mes</p>
            </div>
            <div className="relative w-44">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <Input
                type="text"
                value={extraMonthly === 0 ? '' : extraMonthly.toLocaleString('es-AR')}
                onChange={e => {
                  const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
                  setExtraMonthly(isNaN(val) ? 0 : val);
                }}
                className="h-10 text-sm pl-7 font-bold"
                data-testid="input-extra-monthly"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <div className="text-lg font-black text-slate-900 tabular-nums">{formatCurrency(totalDebt)}</div>
              <div className="text-xs text-slate-500 font-medium">Deuda total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-slate-700 tabular-nums">{formatCurrency(totalMinPayment)}</div>
              <div className="text-xs text-slate-500 font-medium">Mínimos/mes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-accent tabular-nums">{formatCurrency(totalMinPayment + extraMonthly)}</div>
              <div className="text-xs text-slate-500 font-medium">Total mensual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy selector */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(STRATEGY_INFO) as Strategy[]).map(s => {
          const info = STRATEGY_INFO[s];
          const isActive = strategy === s;
          return (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              data-testid={`strategy-${s}`}
              className={`rounded-xl border-2 px-4 py-3 text-left transition-all cursor-pointer ${
                isActive ? `border-accent ${info.bg} shadow-sm` : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`flex items-center gap-1.5 font-bold text-sm mb-0.5 ${isActive ? info.color : 'text-slate-700'}`}>
                {info.icon} {info.label}
              </div>
              <div className="text-xs text-slate-400 leading-tight">
                {s === 'snowball' ? 'Menor saldo primero' : s === 'avalanche' ? 'Mayor tasa primero' : 'Ver ambas estrategias'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Results comparison or single strategy */}
      {strategy === 'comparison' ? (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Bola de nieve', result: snowball, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
              { label: 'Avalancha', result: avalanche, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
              { label: 'Solo mínimos', result: minimum, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
            ].map(({ label, result, color, bg, border }) => (
              <div key={label} className={`rounded-xl border-2 ${border} ${bg} p-4`}>
                <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${color}`}>{label}</div>
                <div className={`text-2xl font-black tabular-nums ${color}`}>{result.months} meses</div>
                <div className="text-xs text-slate-600 mt-1">para cancelar todo</div>
                <div className="mt-3 pt-3 border-t border-black/10 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Interés total:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(result.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total pagado:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(result.totalPaid)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Savings highlight */}
          {snowball.totalInterest < minimum.totalInterest && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-center gap-3">
              <Zap size={20} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-800 text-sm">
                  Con la estrategia avalancha ahorrás {formatCurrency(minimum.totalInterest - avalanche.totalInterest)} en intereses
                  y cancelás {minimum.months - avalanche.months} meses antes que pagando solo el mínimo.
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Pagando {formatCurrency(extraMonthly)} extra por mes hacés una diferencia enorme.
                </p>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Evolución del saldo total por estrategia</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 16, left: 16, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 24% 92%)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10 }} label={{ value: 'Meses', position: 'insideBottom', offset: -2, fontSize: 10, fill: 'hsl(215 16% 47%)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={52} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="Bola de nieve" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Avalancha" stroke="#059669" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Solo mínimos" stroke="#e11d48" strokeWidth={2} strokeDasharray="5 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Single strategy result */}
          <div className={`rounded-xl border-2 ${STRATEGY_INFO[strategy].border} ${STRATEGY_INFO[strategy].bg} px-5 py-4`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Plazo total</div>
                <div className={`text-2xl font-black tabular-nums ${STRATEGY_INFO[strategy].color}`}>{activeResult.months} meses</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Intereses</div>
                <div className="text-xl font-black text-rose-600 tabular-nums">{formatCurrency(activeResult.totalInterest)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Total pagado</div>
                <div className="text-xl font-black text-slate-800 tabular-nums">{formatCurrency(activeResult.totalPaid)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Orden de pago</div>
                <div className="space-y-1 mt-1">
                  {activeResult.payoffOrder.map((id, i) => (
                    <div key={id} className="flex items-center gap-1.5 text-xs">
                      <span className="w-4 h-4 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</span>
                      <span className="font-semibold text-slate-700 truncate">{debtName(id)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Month-by-month schedule toggle */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden">
            <button
              onClick={() => setShowSchedule(s => !s)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              data-testid="button-toggle-schedule"
            >
              <span>Ver tabla mes a mes</span>
              {showSchedule ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            <AnimatePresence>
              {showSchedule && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="overflow-x-auto max-h-72 overflow-y-auto border-t border-slate-100">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5 text-left font-bold text-slate-500 uppercase tracking-wider">Mes</th>
                          {debts.map(d => (
                            <th key={d.id} className="px-4 py-2.5 text-right font-bold text-slate-500 uppercase tracking-wider">{d.name || 'Deuda'}</th>
                          ))}
                          <th className="px-4 py-2.5 text-right font-bold text-slate-500 uppercase tracking-wider">Saldo total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {activeSchedule.slice(0, scheduleRows).map((row, i) => (
                          <tr key={row.month} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="px-4 py-2 font-bold text-slate-400">#{row.month}</td>
                            {debts.map(d => (
                              <td key={d.id} className={`px-4 py-2 text-right tabular-nums font-medium ${row.balances[d.id] <= 0 ? 'text-emerald-500' : 'text-slate-700'}`}>
                                {row.balances[d.id] <= 0 ? 'Cancelada' : formatCurrency(row.balances[d.id])}
                              </td>
                            ))}
                            <td className="px-4 py-2 text-right font-bold text-slate-900 tabular-nums">{formatCurrency(row.totalBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {scheduleRows < activeSchedule.length && (
                      <div className="text-center py-3 border-t border-slate-100 bg-slate-50/50">
                        <Button variant="outline" size="sm" onClick={() => setScheduleRows(r => r + 12)} className="text-xs">
                          Ver más meses ({activeSchedule.length - scheduleRows} restantes)
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Warning: minimum only danger */}
      {minimum.months > 120 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-800 text-sm">Con solo el pago mínimo tardarías más de {minimum.months} meses ({(minimum.months / 12).toFixed(0)} años) en cancelar.</p>
            <p className="text-xs text-rose-600 mt-1">Pagando {formatCurrency(extraMonthly)} extra por mes reducís el plazo a {snowball.months} meses y ahorrás {formatCurrency(minimum.totalInterest - snowball.totalInterest)} en intereses.</p>
          </div>
        </div>
      )}
    </div>
  );
}
