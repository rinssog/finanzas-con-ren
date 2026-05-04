import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Building2, TrendingDown, Zap, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/calculations';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

// ─── helpers ────────────────────────────────────────────────────────────────

interface MonthRow { month: number; balance: number; interestPaid: number; capitalPaid: number; payment: number; }

function simulateCard(balance: number, tna: number, monthlyPayment: number): MonthRow[] {
  if (balance <= 0 || monthlyPayment <= 0) return [];
  const r = tna / 12 / 100;
  const rows: MonthRow[] = [];
  let bal = balance;
  let totalInterest = 0;
  for (let m = 1; m <= 600; m++) {
    const interest = bal * r;
    totalInterest += interest;
    bal += interest;
    const pay = Math.min(monthlyPayment, bal);
    const capital = pay - interest > 0 ? pay - interest : 0;
    bal -= pay;
    bal = Math.max(0, bal);
    rows.push({ month: m, balance: bal, interestPaid: totalInterest, capitalPaid: capital, payment: pay });
    if (bal <= 0.5) break;
  }
  return rows;
}

function buildFrench(principal: number, tna: number, months: number): MonthRow[] {
  if (months <= 0 || principal <= 0) return [];
  const r = tna / 12 / 100;
  const payment = r === 0 ? principal / months
    : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const rows: MonthRow[] = [];
  let bal = principal;
  let totalInterest = 0;
  for (let i = 0; i < months; i++) {
    const interest = bal * r;
    totalInterest += interest;
    const capital = payment - interest;
    bal -= capital;
    bal = Math.max(0, bal);
    rows.push({ month: i + 1, balance: bal, interestPaid: totalInterest, capitalPaid: capital, payment });
  }
  return rows;
}

// ─── presets ────────────────────────────────────────────────────────────────

const CARD_PRESETS = [
  { label: 'Banco Nación', tna: 62 },
  { label: 'Galicia', tna: 78 },
  { label: 'Santander', tna: 84 },
  { label: 'BBVA', tna: 87 },
  { label: 'HSBC', tna: 88 },
  { label: 'Naranja X', tna: 92 },
];

const LOAN_PRESETS = [
  { label: 'Banco Nación', tna: 40 },
  { label: 'Provincia', tna: 48 },
  { label: 'Ciudad', tna: 52 },
  { label: 'Galicia', tna: 58 },
  { label: 'Santander', tna: 63 },
  { label: 'BBVA', tna: 65 },
];

// ─── tooltip ────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-sm">
      <p className="font-bold text-white/60 mb-2 text-xs">Mes {label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-6">
          <span style={{ color: p.color }} className="text-xs font-semibold">{p.name}</span>
          <span className="font-bold tabular-nums">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ─── main ────────────────────────────────────────────────────────────────────

export function ConsolidacionSimulator() {
  const [balance, setBalance] = useState(300000);
  const [cardTna, setCardTna] = useState(84);
  const [monthlyPayment, setMonthlyPayment] = useState(25000);
  const [loanTna, setLoanTna] = useState(48);
  const [loanMonths, setLoanMonths] = useState(18);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleTab, setScheduleTab] = useState<'card' | 'loan'>('card');

  const cardRows = useMemo(() => simulateCard(balance, cardTna, monthlyPayment), [balance, cardTna, monthlyPayment]);
  const loanRows = useMemo(() => buildFrench(balance, loanTna, loanMonths), [balance, loanTna, loanMonths]);

  const cardMonths = cardRows.length;
  const cardTotalPaid = cardRows.reduce((s, r) => s + r.payment, 0);
  const cardTotalInterest = cardTotalPaid - balance;

  const loanPayment = loanRows[0]?.payment ?? 0;
  const loanTotalPaid = loanPayment * loanMonths;
  const loanTotalInterest = loanTotalPaid - balance;

  const interestSaved = cardTotalInterest - loanTotalInterest;
  const monthsSaved = cardMonths - loanMonths;
  const loanWins = loanTotalPaid < cardTotalPaid;

  const minPaymentRequired = balance * (cardTna / 12 / 100) * 1.01; // slightly above interest only
  const paymentTooLow = monthlyPayment <= balance * (cardTna / 12 / 100);

  // chart: balance over time, max 120 months
  const maxM = Math.min(Math.max(cardMonths, loanMonths, 6), 120);
  const chartData = useMemo(() =>
    Array.from({ length: maxM + 1 }, (_, i) => ({
      month: i,
      'Deuda tarjeta': i === 0 ? balance : (cardRows[i - 1]?.balance ?? 0),
      'Préstamo personal': i === 0 ? balance : (loanRows[i - 1]?.balance ?? 0),
    })),
    [cardRows, loanRows, balance, maxM]
  );

  const handleNum = (raw: string, set: (v: number) => void) => {
    const v = parseInt(raw.replace(/\D/g, ''), 10);
    if (!isNaN(v) && v >= 0) set(v);
  };

  return (
    <div className="space-y-6">

      {/* ── Input panel ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h3 className="text-base font-bold text-slate-900">Tu deuda de tarjeta</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ingresá el saldo actual y cuánto podés pagar por mes</p>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Balance + monthly payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1.5 block">Saldo de la tarjeta</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <Input type="text" value={balance.toLocaleString('es-AR')}
                  onChange={e => handleNum(e.target.value, setBalance)}
                  className="pl-8 h-11 text-base font-bold" data-testid="input-balance" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1.5 block">Cuánto podés pagar por mes</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <Input type="text" value={monthlyPayment.toLocaleString('es-AR')}
                  onChange={e => handleNum(e.target.value, setMonthlyPayment)}
                  className={`pl-8 h-11 text-base font-bold ${paymentTooLow ? 'border-rose-400 focus-visible:ring-rose-400' : ''}`}
                  data-testid="input-monthly-payment" />
              </div>
              {paymentTooLow && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertTriangle size={11} /> El pago no cubre los intereses. La deuda nunca bajaría.
                </p>
              )}
            </div>
          </div>

          {/* Two columns: card config (red) + loan config (green) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* ── RED: tarjeta ──────────────────────────────── */}
            <div className="rounded-xl border-2 border-rose-200 bg-rose-50/40 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
                  <CreditCard size={14} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-rose-900 text-sm block">Deuda en tarjeta</span>
                  <span className="text-xs text-rose-500">Seguir pagando con cuotas propias</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-rose-700 mb-1.5 block">Banco / tarjeta</label>
                <div className="flex flex-wrap gap-1.5">
                  {CARD_PRESETS.map(p => (
                    <button key={p.label} onClick={() => setCardTna(p.tna)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${cardTna === p.tna
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-rose-700 border-rose-200 hover:border-rose-400'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-rose-700 mb-1.5 block">TNA de financiación (%)</label>
                <Input type="number" value={cardTna}
                  onChange={e => setCardTna(parseFloat(e.target.value) || 0)}
                  className="h-9 text-sm font-bold border-rose-200 focus-visible:ring-rose-400"
                  min={0} max={300} data-testid="input-card-tna" />
              </div>

              {/* Card result */}
              <div className={`bg-white rounded-xl px-4 py-3.5 border-2 border-rose-200 space-y-2 ${paymentTooLow ? 'opacity-40' : ''}`}>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Pago mensual</span>
                  <span className="font-black text-rose-700 tabular-nums">{formatCurrency(monthlyPayment)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Meses para cancelar</span>
                  <span className="font-black text-rose-700 tabular-nums">{paymentTooLow ? '∞' : `${cardMonths} meses`}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Intereses totales</span>
                  <span className="font-bold text-rose-600 tabular-nums">{paymentTooLow ? '–' : formatCurrency(cardTotalInterest)}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-rose-100 pt-2 mt-1">
                  <span className="text-slate-600 font-semibold">Total pagado</span>
                  <span className="font-black text-rose-800 tabular-nums">{paymentTooLow ? '–' : formatCurrency(cardTotalPaid)}</span>
                </div>
              </div>
            </div>

            {/* ── GREEN: préstamo ───────────────────────────── */}
            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/40 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Building2 size={14} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-emerald-900 text-sm block">Préstamo personal</span>
                  <span className="text-xs text-emerald-500">Cancelar tarjeta y pagar el préstamo</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-700 mb-1.5 block">Banco prestamista</label>
                <div className="flex flex-wrap gap-1.5">
                  {LOAN_PRESETS.map(p => (
                    <button key={p.label} onClick={() => setLoanTna(p.tna)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${loanTna === p.tna
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-emerald-700 mb-1.5 block">TNA préstamo (%)</label>
                  <Input type="number" value={loanTna}
                    onChange={e => setLoanTna(parseFloat(e.target.value) || 0)}
                    className="h-9 text-sm font-bold border-emerald-200 focus-visible:ring-emerald-400"
                    min={0} max={200} data-testid="input-loan-tna" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-700 mb-1.5 block">Plazo (meses)</label>
                  <Input type="number" value={loanMonths}
                    onChange={e => setLoanMonths(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-9 text-sm font-bold border-emerald-200 focus-visible:ring-emerald-400"
                    min={1} max={120} data-testid="input-loan-months" />
                </div>
              </div>

              {/* Loan result */}
              <div className="bg-white rounded-xl px-4 py-3.5 border-2 border-emerald-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Cuota mensual fija</span>
                  <span className="font-black text-emerald-700 tabular-nums">{formatCurrency(loanPayment)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Plazo exacto</span>
                  <span className="font-black text-emerald-700 tabular-nums">{loanMonths} meses</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Intereses totales</span>
                  <span className="font-bold text-emerald-600 tabular-nums">{formatCurrency(loanTotalInterest)}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-emerald-100 pt-2 mt-1">
                  <span className="text-slate-600 font-semibold">Total pagado</span>
                  <span className="font-black text-emerald-800 tabular-nums">{formatCurrency(loanTotalPaid)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Verdict ────────────────────────────────────────────────── */}
      {!paymentTooLow && (
        <motion.div
          key={`${loanWins}-${interestSaved}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-300"
        >
          {/* Top bar */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Zap size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-lg leading-tight">
                {loanWins
                  ? `El préstamo te ahorra ${formatCurrency(interestSaved)} en intereses`
                  : 'En este escenario, seguir pagando la tarjeta es similar al préstamo'}
              </p>
              <p className="text-white/75 text-sm mt-1">
                {loanWins
                  ? `Y cancelás ${monthsSaved > 0 ? `${monthsSaved} meses antes` : 'al mismo plazo'}. Con cuota fija mensual de ${formatCurrency(loanPayment)}.`
                  : 'Ajustá el plazo o buscá un banco con menor TNA para mejorar el resultado.'}
              </p>
            </div>
            <Badge className="bg-white text-emerald-700 font-black text-sm px-4 py-2 shrink-0 shadow-md">
              Ahorrás {formatCurrency(interestSaved)}
            </Badge>
          </div>

          {/* Metric cards below */}
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-white">
            {[
              {
                label: 'Interés tarjeta',
                value: formatCurrency(cardTotalInterest),
                sub: `en ${cardMonths} meses`,
                color: 'text-rose-600',
                icon: <CreditCard size={14} />,
                bg: 'bg-rose-50',
                border: 'border-rose-100',
              },
              {
                label: 'Interés préstamo',
                value: formatCurrency(loanTotalInterest),
                sub: `en ${loanMonths} meses`,
                color: 'text-emerald-600',
                icon: <Building2 size={14} />,
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
              },
              {
                label: 'Meses ahorrados',
                value: monthsSaved > 0 ? `${monthsSaved} meses` : 'Sin cambio',
                sub: `${cardMonths} → ${loanMonths} meses`,
                color: monthsSaved > 0 ? 'text-teal-600' : 'text-slate-400',
                icon: <TrendingDown size={14} />,
                bg: 'bg-teal-50',
                border: 'border-teal-100',
              },
              {
                label: 'Cuota fija préstamo',
                value: formatCurrency(loanPayment),
                sub: 'todos los meses igual',
                color: 'text-emerald-700',
                icon: <CheckCircle2 size={14} />,
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
              },
            ].map(({ label, value, sub, color, icon, bg, border }, i) => (
              <div key={i} className={`p-4 border-r border-t ${border} last:border-r-0 ${bg}`}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${color}`}>
                  {icon} {label}
                </div>
                <div className={`text-xl font-black tabular-nums ${color}`}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Balance evolution chart ─────────────────────────────────── */}
      {!paymentTooLow && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Evolución del saldo: tarjeta vs. préstamo</h3>
          <p className="text-xs text-slate-500 mb-5">
            La línea <span className="text-rose-500 font-semibold">roja</span> es cómo baja la deuda pagando la tarjeta directamente.
            La <span className="text-emerald-500 font-semibold">verde</span> es el saldo del préstamo con cuota fija.
          </p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 16, left: 16, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradCard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradLoan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 24% 92%)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10 }}
                  label={{ value: 'Meses', position: 'insideBottom', offset: -2, fontSize: 10, fill: 'hsl(215 16% 47%)' }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10 }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={52} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={0} stroke="hsl(215 16% 80%)" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="Deuda tarjeta" stroke="#f43f5e" strokeWidth={2.5}
                  fill="url(#gradCard)" dot={false} />
                <Area type="monotone" dataKey="Préstamo personal" stroke="#10b981" strokeWidth={2.5}
                  fill="url(#gradLoan)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Month-by-month schedule ─────────────────────────────────── */}
      {!paymentTooLow && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden">
          <button onClick={() => setShowSchedule(s => !s)}
            className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            data-testid="button-toggle-schedule">
            <span className="flex items-center gap-2">
              <ArrowRight size={14} className="text-accent" />
              Ver plan de pagos mes a mes
            </span>
            {showSchedule ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showSchedule && (
            <div className="border-t border-slate-100">
              {/* Tab selector */}
              <div className="flex border-b border-slate-100">
                {(['card', 'loan'] as const).map(tab => (
                  <button key={tab} onClick={() => setScheduleTab(tab)}
                    className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${scheduleTab === tab
                      ? tab === 'card'
                        ? 'border-rose-500 text-rose-700 bg-rose-50/50'
                        : 'border-emerald-500 text-emerald-700 bg-emerald-50/50'
                      : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                    {tab === 'card' ? '🔴 Pago tarjeta' : '🟢 Préstamo personal'}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Mes', 'Pago', 'Interés', 'Capital', 'Saldo restante'].map(h => (
                        <th key={h} className="px-4 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-right first:text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(scheduleTab === 'card' ? cardRows : loanRows).map((row, i) => {
                      const isLast = row.balance <= 0.5;
                      const accent = scheduleTab === 'card' ? 'text-rose-600' : 'text-emerald-600';
                      return (
                        <tr key={row.month}
                          className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} ${isLast ? scheduleTab === 'card' ? 'bg-rose-50' : 'bg-emerald-50' : ''}`}>
                          <td className="px-4 py-2 font-bold text-slate-400">#{row.month}</td>
                          <td className={`px-4 py-2 text-right font-bold tabular-nums ${accent}`}>{formatCurrency(row.payment)}</td>
                          <td className="px-4 py-2 text-right font-medium text-rose-500 tabular-nums">
                            {formatCurrency(row.payment - row.capitalPaid)}
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-slate-600 tabular-nums">{formatCurrency(row.capitalPaid)}</td>
                          <td className={`px-4 py-2 text-right font-bold tabular-nums ${isLast ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {isLast ? '✓ Cancelada' : formatCurrency(row.balance)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Info box ────────────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Zap size={18} className="text-accent" />
        </div>
        <div className="space-y-1.5 text-sm">
          <p className="font-bold text-white">¿Cómo funciona la consolidación?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Pedís un préstamo personal por el monto de tu deuda de tarjeta. Con ese dinero cancelás la tarjeta <span className="text-rose-400 font-semibold">de golpe</span>.
            Luego pagás el préstamo en cuotas fijas a una tasa significativamente menor.
            El resultado: menos intereses, cuota predecible y fecha de cancelación exacta.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-white/50">
            <span>✓ Cuota fija todos los meses</span>
            <span>✓ Fecha de fin exacta</span>
            <span>✓ Menor tasa que la tarjeta</span>
            <span>✓ Libera el límite de la tarjeta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
