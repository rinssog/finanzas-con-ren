import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Building2, Zap, ChevronDown, ChevronUp, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts';

// ─── French amortization ────────────────────────────────────────────────────

interface AmortRow {
  month: number;
  payment: number;
  interest: number;
  amortization: number;
  balance: number;
}

function buildFrench(principal: number, tna: number, months: number): AmortRow[] {
  if (months <= 0 || principal <= 0) return [];
  const r = tna / 12 / 100;
  if (r === 0) {
    const payment = principal / months;
    return Array.from({ length: months }, (_, i) => ({
      month: i + 1,
      payment,
      interest: 0,
      amortization: payment,
      balance: principal - payment * (i + 1),
    }));
  }
  const payment = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const rows: AmortRow[] = [];
  let balance = principal;
  for (let i = 0; i < months; i++) {
    const interest = balance * r;
    const amortization = payment - interest;
    balance -= amortization;
    rows.push({ month: i + 1, payment, interest, amortization, balance: Math.max(0, balance) });
  }
  return rows;
}

// ─── Popular bank loan presets ───────────────────────────────────────────────

const LOAN_PRESETS = [
  { label: 'Banco Nación', tna: 40 },
  { label: 'Banco Provincia', tna: 48 },
  { label: 'Banco Ciudad', tna: 52 },
  { label: 'Banco Galicia', tna: 58 },
  { label: 'Santander', tna: 63 },
  { label: 'BBVA', tna: 65 },
];

const CARD_PRESETS = [
  { label: 'Banco Nación', tna: 62 },
  { label: 'Banco Provincia', tna: 66 },
  { label: 'Banco Galicia', tna: 78 },
  { label: 'Santander', tna: 84 },
  { label: 'BBVA', tna: 87 },
  { label: 'HSBC', tna: 88 },
  { label: 'Naranja X', tna: 92 },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────

const CustomBarTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-sm space-y-1">
        <p className="font-bold text-white/70 mb-2">{label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex justify-between gap-6">
            <span style={{ color: p.fill }} className="text-xs font-semibold">{p.name}</span>
            <span className="font-bold tabular-nums">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main component ───────────────────────────────────────────────────────────

export function CuotasSimulator() {
  const [amount, setAmount] = useState(500000);
  const [cardMonths, setCardMonths] = useState(12);
  const [cardTna, setCardTna] = useState(84);
  const [loanMonths, setLoanMonths] = useState(12);
  const [loanTna, setLoanTna] = useState(48);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleTab, setScheduleTab] = useState<'card' | 'loan'>('card');

  // calculations
  const cardRows = useMemo(() => buildFrench(amount, cardTna, cardMonths), [amount, cardTna, cardMonths]);
  const loanRows = useMemo(() => buildFrench(amount, loanTna, loanMonths), [amount, loanTna, loanMonths]);

  const cardPayment = cardRows[0]?.payment ?? 0;
  const loanPayment = loanRows[0]?.payment ?? 0;
  const cardTotal = cardPayment * cardMonths;
  const loanTotal = loanPayment * loanMonths;
  const cardInterest = cardTotal - amount;
  const loanInterest = loanTotal - amount;

  const cheaper = cardTotal <= loanTotal ? 'card' : 'loan';
  const saving = Math.abs(cardTotal - loanTotal);
  const savingPct = (saving / Math.max(cardTotal, loanTotal)) * 100;

  // chart data
  const barData = [
    { name: 'Capital', 'Cuotas tarjeta': amount, 'Préstamo personal': amount },
    { name: 'Intereses', 'Cuotas tarjeta': cardInterest, 'Préstamo personal': loanInterest },
    { name: 'Total pagado', 'Cuotas tarjeta': cardTotal, 'Préstamo personal': loanTotal },
  ];

  const handleAmountInput = (raw: string) => {
    const val = parseInt(raw.replace(/\D/g, ''), 10);
    if (!isNaN(val) && val > 0) setAmount(val);
  };

  return (
    <div className="space-y-6">
      {/* Input panel */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h3 className="text-base font-bold text-slate-900">Parámetros de la simulación</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ingresá el monto a financiar y configurá ambas opciones</p>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Amount */}
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Monto a financiar</label>
            <div className="relative max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input
                type="text"
                value={amount.toLocaleString('es-AR')}
                onChange={e => handleAmountInput(e.target.value)}
                className="pl-8 h-11 text-lg font-bold"
                data-testid="input-amount"
              />
            </div>
          </div>

          {/* Two-column config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card option */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <CreditCard size={15} className="text-white" />
                </div>
                <span className="font-bold text-blue-900 text-sm">Cuotas con tarjeta</span>
              </div>

              {/* Card presets */}
              <div>
                <label className="text-xs font-semibold text-blue-700 mb-1.5 block">Banco emisor</label>
                <div className="flex flex-wrap gap-1.5">
                  {CARD_PRESETS.map(p => (
                    <button
                      key={p.label}
                      onClick={() => setCardTna(p.tna)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${
                        cardTna === p.tna
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-blue-700 border-blue-200 hover:border-blue-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-blue-700 mb-1.5 block">TNA tarjeta (%)</label>
                  <Input
                    type="number"
                    value={cardTna}
                    onChange={e => setCardTna(parseFloat(e.target.value) || 0)}
                    className="h-9 text-sm font-bold"
                    min={0}
                    max={300}
                    data-testid="input-card-tna"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-blue-700 mb-1.5 block">Cuotas</label>
                  <Input
                    type="number"
                    value={cardMonths}
                    onChange={e => setCardMonths(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-9 text-sm font-bold"
                    min={1}
                    max={60}
                    data-testid="input-card-months"
                  />
                </div>
              </div>

              {/* Card result preview */}
              <div className="bg-white rounded-lg px-4 py-3 border border-blue-200 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Cuota mensual</span>
                  <span className="font-black text-blue-700 tabular-nums text-sm">{formatCurrency(cardPayment)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total a pagar</span>
                  <span className="font-bold text-slate-800 tabular-nums">{formatCurrency(cardTotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Intereses</span>
                  <span className="font-bold text-rose-600 tabular-nums">{formatCurrency(cardInterest)}</span>
                </div>
              </div>
            </div>

            {/* Loan option */}
            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Building2 size={15} className="text-white" />
                </div>
                <span className="font-bold text-emerald-900 text-sm">Préstamo personal</span>
              </div>

              {/* Loan presets */}
              <div>
                <label className="text-xs font-semibold text-emerald-700 mb-1.5 block">Banco prestamista</label>
                <div className="flex flex-wrap gap-1.5">
                  {LOAN_PRESETS.map(p => (
                    <button
                      key={p.label}
                      onClick={() => setLoanTna(p.tna)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${
                        loanTna === p.tna
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-emerald-700 mb-1.5 block">TNA préstamo (%)</label>
                  <Input
                    type="number"
                    value={loanTna}
                    onChange={e => setLoanTna(parseFloat(e.target.value) || 0)}
                    className="h-9 text-sm font-bold"
                    min={0}
                    max={200}
                    data-testid="input-loan-tna"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-700 mb-1.5 block">Cuotas</label>
                  <Input
                    type="number"
                    value={loanMonths}
                    onChange={e => setLoanMonths(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-9 text-sm font-bold"
                    min={1}
                    max={120}
                    data-testid="input-loan-months"
                  />
                </div>
              </div>

              {/* Loan result preview */}
              <div className="bg-white rounded-lg px-4 py-3 border border-emerald-200 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Cuota mensual</span>
                  <span className="font-black text-emerald-700 tabular-nums text-sm">{formatCurrency(loanPayment)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total a pagar</span>
                  <span className="font-bold text-slate-800 tabular-nums">{formatCurrency(loanTotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Intereses</span>
                  <span className="font-bold text-rose-600 tabular-nums">{formatCurrency(loanInterest)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verdict banner */}
      <motion.div
        key={cheaper}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl border-2 overflow-hidden shadow-lg ${
          cheaper === 'loan'
            ? 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50'
            : 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50'
        }`}
      >
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            cheaper === 'loan' ? 'bg-emerald-500' : 'bg-blue-500'
          }`}>
            <Zap size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-base font-black leading-snug ${cheaper === 'loan' ? 'text-emerald-900' : 'text-blue-900'}`}>
              {cheaper === 'loan'
                ? `El préstamo personal es ${savingPct.toFixed(1)}% más barato`
                : `Las cuotas de tarjeta son ${savingPct.toFixed(1)}% más baratas`}
            </p>
            <p className={`text-sm mt-1 ${cheaper === 'loan' ? 'text-emerald-700' : 'text-blue-700'}`}>
              {cheaper === 'loan'
                ? `Elegir el préstamo te ahorra ${formatCurrency(saving)} en intereses vs. financiar con tarjeta.`
                : `En este caso, la tarjeta tiene condiciones más favorables que el préstamo seleccionado.`}
            </p>
          </div>
          <Badge className={`shrink-0 font-black text-base px-4 py-2 ${
            cheaper === 'loan'
              ? 'bg-emerald-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            Ahorro: {formatCurrency(saving)}
          </Badge>
        </div>

        {/* Quick comparison row */}
        <div className="px-6 pb-5 grid grid-cols-2 gap-3">
          <div className={`rounded-xl p-3 flex items-start gap-3 ${
            cheaper === 'card' ? 'bg-blue-100 border border-blue-300' : 'bg-white/60 border border-blue-200/60'
          }`}>
            {cheaper === 'card'
              ? <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
              : <XCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
            }
            <div>
              <div className="text-xs font-bold text-blue-800">Cuotas tarjeta</div>
              <div className="text-lg font-black text-blue-900 tabular-nums">{formatCurrency(cardTotal)}</div>
              <div className="text-xs text-blue-600 tabular-nums">{cardMonths} cuotas de {formatCurrency(cardPayment)}</div>
            </div>
          </div>
          <div className={`rounded-xl p-3 flex items-start gap-3 ${
            cheaper === 'loan' ? 'bg-emerald-100 border border-emerald-300' : 'bg-white/60 border border-emerald-200/60'
          }`}>
            {cheaper === 'loan'
              ? <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
              : <XCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
            }
            <div>
              <div className="text-xs font-bold text-emerald-800">Préstamo personal</div>
              <div className="text-lg font-black text-emerald-900 tabular-nums">{formatCurrency(loanTotal)}</div>
              <div className="text-xs text-emerald-600 tabular-nums">{loanMonths} cuotas de {formatCurrency(loanPayment)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bar chart comparison */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Comparación visual de costos</h3>
        <p className="text-xs text-slate-500 mb-4">Capital financiado, intereses pagados y total por cada opción</p>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 16, left: 16, bottom: 5 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 24% 92%)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 16% 47%)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={52} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Cuotas tarjeta" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={i === 2 && cheaper === 'card' ? '#2563eb' : i === 2 ? '#93c5fd' : '#bfdbfe'} />
                ))}
              </Bar>
              <Bar dataKey="Préstamo personal" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={i === 2 && cheaper === 'loan' ? '#059669' : i === 2 ? '#6ee7b7' : '#a7f3d0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interest breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Interés mensual promedio',
            card: cardInterest / cardMonths,
            loan: loanInterest / loanMonths,
          },
          {
            label: 'Interés total pagado',
            card: cardInterest,
            loan: loanInterest,
          },
          {
            label: 'Costo del dinero (sobre capital)',
            card: (cardInterest / amount) * 100,
            loan: (loanInterest / amount) * 100,
            isPct: true,
          },
        ].map(({ label, card, loan, isPct }) => {
          const cardWins = card <= loan;
          return (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-3 leading-snug">{label}</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-xs text-slate-600">Tarjeta</span>
                  </div>
                  <span className={`text-sm font-black tabular-nums ${cardWins ? 'text-blue-600' : 'text-rose-600'}`}>
                    {isPct ? `${card.toFixed(1)}%` : formatCurrency(card)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-xs text-slate-600">Préstamo</span>
                  </div>
                  <span className={`text-sm font-black tabular-nums ${!cardWins ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isPct ? `${loan.toFixed(1)}%` : formatCurrency(loan)}
                  </span>
                </div>
                {/* Mini bar */}
                <div className="pt-1 space-y-1">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min((card / Math.max(card, loan)) * 100, 100)}%` }} />
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min((loan / Math.max(card, loan)) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Amortization schedule (toggleable) */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden">
        <button
          onClick={() => setShowSchedule(s => !s)}
          className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          data-testid="button-toggle-schedule"
        >
          <span className="flex items-center gap-2">
            <ArrowRight size={14} className="text-accent" />
            Ver plan de pagos mes a mes
          </span>
          {showSchedule ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        <AnimatePresence>
          {showSchedule && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-100">
              {/* Tab selector */}
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                {(['card', 'loan'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setScheduleTab(tab)}
                    className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                      scheduleTab === tab
                        ? tab === 'card' ? 'border-blue-500 text-blue-700 bg-white' : 'border-emerald-500 text-emerald-700 bg-white'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab === 'card' ? '💳 Cuotas tarjeta' : '🏦 Préstamo personal'}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Cuota', 'Pago', 'Interés', 'Capital', 'Saldo'].map(h => (
                        <th key={h} className={`px-4 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-right first:text-left`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(scheduleTab === 'card' ? cardRows : loanRows).map((row, i) => (
                      <tr key={row.month} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-4 py-2 font-bold text-slate-400">#{row.month}</td>
                        <td className="px-4 py-2 text-right font-bold text-slate-800 tabular-nums">{formatCurrency(row.payment)}</td>
                        <td className="px-4 py-2 text-right font-medium text-rose-600 tabular-nums">{formatCurrency(row.interest)}</td>
                        <td className="px-4 py-2 text-right font-medium text-emerald-600 tabular-nums">{formatCurrency(row.amortization)}</td>
                        <td className="px-4 py-2 text-right font-medium text-slate-600 tabular-nums">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
        <p className="font-bold mb-1">¿Cómo usar esta comparación?</p>
        <ul className="space-y-1 text-xs text-amber-700 list-disc list-inside">
          <li>Fijá el mismo monto y plazo en ambas opciones para comparar equitativamente.</li>
          <li>Los préstamos personales suelen tener TNA menor a la financiación de tarjeta.</li>
          <li>Si el banco te ofrece cuotas sin interés (MSI), podría ser más conveniente — pero verificá si el precio fue inflado.</li>
          <li>Considerá también el tiempo de tramitación: las cuotas de tarjeta son inmediatas, el préstamo puede tardar días.</li>
        </ul>
      </div>
    </div>
  );
}
