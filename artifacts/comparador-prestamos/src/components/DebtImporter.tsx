import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Image as ImageIcon, X, Plus, CheckCircle2,
  AlertTriangle, HelpCircle, ChevronRight, ChevronDown, ChevronUp,
  Trash2, Sparkles, CreditCard, Eye, ShieldCheck, Lock, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/calculations';
import { extractPdfText, parseStatement, type ParsedStatement } from '@/lib/pdfParser';
import { simulateSnowball, simulateAvalanche, simulateMinimumOnly, type Debt } from '@/lib/debtStrategies';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ─── Bank TNA defaults ───────────────────────────────────────────────────────

const BANK_TNA: Record<string, number> = {
  'Banco Nación': 62, 'Banco Ciudad': 68, 'Banco Provincia': 66,
  'Mercado Pago': 70, 'Banco Macro': 74, 'Banco Patagonia': 76,
  'Banco Galicia': 78, 'Banco Supervielle': 79, 'ICBC': 81,
  'Santander': 84, 'BBVA': 87, 'HSBC': 88, 'Naranja X': 92,
  'Uala': 95, 'American Express': 76,
};

const ALL_BANKS = Object.keys(BANK_TNA);

// ─── Field hints ─────────────────────────────────────────────────────────────

const FIELD_HINTS: Record<string, { label: string; hint: string; keywords: string[] }> = {
  balance: {
    label: 'Saldo total',
    hint: 'El monto total que debés. Buscá "Saldo Total", "Total Adeudado" o "Saldo Financiado" en tu resumen.',
    keywords: ['Saldo Total', 'Total a Pagar', 'Saldo Financiado', 'Importe Total', 'Total Adeudado'],
  },
  minPayment: {
    label: 'Pago mínimo',
    hint: 'El monto mínimo que el banco te pide pagar este mes. Buscá "Pago Mínimo" o "Importe Mínimo".',
    keywords: ['Pago Mínimo', 'Importe Mínimo', 'Mínimo a Pagar', 'Pago Reducido'],
  },
  tna: {
    label: 'TNA (%)',
    hint: 'Tasa Nominal Anual. Aparece como "TNA" o "Tasa Nominal Anual" seguido de un porcentaje.',
    keywords: ['TNA', 'Tasa Nominal Anual', 'T.N.A.', 'Tasa de Financiación'],
  },
};

// ─── Statement guide illustration ────────────────────────────────────────────

function StatementGuide() {
  return (
    <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono space-y-1.5 select-none">
      <div className="text-slate-500 mb-3 font-sans text-xs font-semibold uppercase tracking-wide">Resumen de tarjeta típico</div>

      <div className="bg-slate-800 rounded-lg p-3 space-y-2">
        <div className="text-slate-400 text-xs font-sans font-bold">BANCO EJEMPLO — Resumen de Cuenta</div>
        <div className="border-b border-slate-700 pb-2 text-slate-500">Período: 01/05/2025 — 31/05/2025</div>

        <div className="flex justify-between items-center py-1.5 rounded px-2 bg-rose-950/40 border border-rose-800/50">
          <span className="text-slate-300">Saldo Total</span>
          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-bold">$ 250.000,00</span>
            <div className="bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded font-sans font-bold">← Saldo</div>
          </div>
        </div>

        <div className="flex justify-between items-center py-1.5 rounded px-2 bg-amber-950/40 border border-amber-800/50">
          <span className="text-slate-300">Pago Mínimo</span>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">$ 12.500,00</span>
            <div className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-sans font-bold">← Mínimo</div>
          </div>
        </div>

        <div className="flex justify-between items-center py-1.5 rounded px-2 bg-blue-950/40 border border-blue-800/50">
          <span className="text-slate-300">Fecha de Vencimiento</span>
          <span className="text-blue-400 font-bold">15/06/2025</span>
        </div>

        <div className="border-t border-slate-700 pt-2 flex justify-between items-center py-1.5 rounded px-2 bg-violet-950/40 border border-violet-800/50 mt-1">
          <span className="text-slate-300">TNA de financiación</span>
          <div className="flex items-center gap-2">
            <span className="text-violet-400 font-bold">84,00 %</span>
            <div className="bg-violet-500 text-white text-xs px-1.5 py-0.5 rounded font-sans font-bold">← TNA</div>
          </div>
        </div>
      </div>

      <div className="font-sans text-slate-500 text-xs pt-1 leading-relaxed">
        Si no encontrás la TNA, seleccioná tu banco y usamos la tasa referencial.
      </div>
    </div>
  );
}

// ─── Hint tooltip ─────────────────────────────────────────────────────────────

function FieldHint({ field }: { field: keyof typeof FIELD_HINTS }) {
  const [open, setOpen] = useState(false);
  const info = FIELD_HINTS[field];
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(o => !o)} className="text-slate-400 hover:text-accent transition-colors ml-1">
        <HelpCircle size={13} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute left-0 top-6 z-30 bg-slate-900 text-white rounded-xl p-3 w-64 shadow-2xl border border-white/10 text-xs"
            onMouseLeave={() => setOpen(false)}>
            <p className="font-bold mb-1.5 text-white">{info.label}</p>
            <p className="text-white/70 leading-relaxed mb-2">{info.hint}</p>
            <div className="flex flex-wrap gap-1">
              {info.keywords.map(kw => (
                <span key={kw} className="bg-white/10 text-white/80 px-1.5 py-0.5 rounded text-xs font-mono">{kw}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImportedDebt {
  id: string;
  name: string;
  bank: string;
  balance: number;
  minPayment: number;
  tna: number;
  fileName?: string;
  parsed?: ParsedStatement;
  confidence?: ParsedStatement['confidence'];
}

interface FileSlot {
  id: string;
  file: File;
  previewUrl: string;
  isPdf: boolean;
  parsing: boolean;
  error?: string;
  parsed?: ParsedStatement;
  confidence?: ParsedStatement['confidence'];
  draft: {
    name: string;
    bank: string;
    balance: string;
    minPayment: string;
    tna: string;
  };
  confirmed: boolean;
}

function genId() { return Math.random().toString(36).slice(2, 8); }

function formatAmountInput(val: number | null, raw: string): string {
  if (val !== null && val > 0) return val.toLocaleString('es-AR');
  return raw;
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f =>
      f.type === 'application/pdf' || f.type.startsWith('image/')
    );
    if (files.length) onFiles(files);
  }, [onFiles]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragging
        ? 'border-accent bg-accent/5 scale-[1.01]'
        : 'border-slate-300 hover:border-accent/60 hover:bg-slate-50'
        }`}
    >
      <input ref={inputRef} type="file" accept=".pdf,image/*" multiple className="hidden"
        onChange={e => { if (e.target.files?.length) onFiles(Array.from(e.target.files)); }} />

      <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
        <Upload size={24} className="text-accent" />
      </div>
      <p className="font-bold text-slate-800 text-base">Arrastrá tu resumen de tarjeta aquí</p>
      <p className="text-slate-500 text-sm mt-1">o <span className="text-accent font-semibold">hacé click para seleccionarlo</span></p>
      <div className="flex items-center justify-center gap-4 mt-4">
        <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          <FileText size={12} /> PDF
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          <ImageIcon size={12} /> JPG / PNG
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-3">Podés subir varios resúmenes a la vez (uno por tarjeta)</p>
    </div>
  );
}

// ─── File card ────────────────────────────────────────────────────────────────

function FileCard({
  slot,
  onUpdate,
  onConfirm,
  onRemove,
}: {
  slot: FileSlot;
  onUpdate: (id: string, field: string, value: string) => void;
  onConfirm: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleNum = (field: string, raw: string) => {
    onUpdate(slot.id, field, raw.replace(/[^0-9.,]/g, ''));
  };

  const balanceVal = parseFloat(slot.draft.balance.replace(/\./g, '').replace(',', '.'));
  const minVal = parseFloat(slot.draft.minPayment.replace(/\./g, '').replace(',', '.'));
  const tnaVal = parseFloat(slot.draft.tna.replace(',', '.'));
  const canConfirm = !isNaN(balanceVal) && balanceVal > 0 && !isNaN(minVal) && minVal > 0 && !isNaN(tnaVal) && tnaVal > 0 && slot.draft.name.trim().length > 0;

  const confColor = slot.confidence === 'high' ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : slot.confidence === 'medium' ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-rose-600 bg-rose-50 border-rose-200';
  const confLabel = slot.confidence === 'high' ? '✓ Detectado automáticamente'
    : slot.confidence === 'medium' ? '⚠ Detección parcial — verificá los datos'
    : '✏ Ingresá los datos manualmente';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 overflow-hidden ${slot.confirmed ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 bg-white'} shadow-sm`}>

      {/* Card header */}
      <div className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${slot.isPdf ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {slot.isPdf ? <FileText size={17} /> : <ImageIcon size={17} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{slot.file.name}</p>
            <p className="text-xs text-slate-400">{(slot.file.size / 1024).toFixed(0)} KB</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {slot.parsing && (
            <span className="text-xs text-slate-500 animate-pulse">Analizando...</span>
          )}
          {slot.confirmed && <CheckCircle2 size={18} className="text-emerald-500" />}
          <button onClick={() => setShowPreview(s => !s)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Ver archivo">
            <Eye size={14} />
          </button>
          <button onClick={() => onRemove(slot.id)}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* File preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-b border-slate-100">
            {slot.isPdf
              ? <iframe src={slot.previewUrl} className="w-full h-64" title="Vista previa" />
              : <img src={slot.previewUrl} alt="Vista previa" className="w-full max-h-64 object-contain bg-slate-50" />
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confidence badge */}
      {slot.confidence && !slot.confirmed && (
        <div className={`px-5 py-2 text-xs font-semibold border-b flex items-center gap-1.5 ${confColor}`}>
          {confLabel}
        </div>
      )}

      {!slot.confirmed ? (
        <div className="px-5 py-4 space-y-4">
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-3">
            {/* Name */}
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-600 mb-1.5 block">Nombre de la tarjeta</label>
              <Input value={slot.draft.name}
                onChange={e => onUpdate(slot.id, 'name', e.target.value)}
                placeholder="Ej: Visa Galicia" className="h-9 text-sm" />
            </div>

            {/* Bank */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-slate-600 mb-1.5 block">Banco emisor</label>
              <select value={slot.draft.bank}
                onChange={e => {
                  onUpdate(slot.id, 'bank', e.target.value);
                  if (!slot.parsed?.tna && BANK_TNA[e.target.value]) {
                    onUpdate(slot.id, 'tna', BANK_TNA[e.target.value].toString());
                  }
                }}
                className="w-full h-9 text-sm rounded-md border border-input bg-background px-3 font-medium">
                <option value="">Seleccioná el banco</option>
                {ALL_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* TNA */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center">
                TNA de financiación (%)
                <FieldHint field="tna" />
              </label>
              <Input value={slot.draft.tna}
                onChange={e => onUpdate(slot.id, 'tna', e.target.value)}
                placeholder="Ej: 84" className="h-9 text-sm"
                type="number" min={0} max={300} />
            </div>

            {/* Balance */}
            <div>
              <label className="text-xs font-bold text-rose-600 mb-1.5 flex items-center">
                Saldo total ($)
                <FieldHint field="balance" />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <Input value={slot.draft.balance}
                  onChange={e => handleNum('balance', e.target.value)}
                  placeholder="250.000" className="h-9 text-sm pl-6 border-rose-200 focus-visible:ring-rose-400" />
              </div>
            </div>

            {/* Min payment */}
            <div>
              <label className="text-xs font-bold text-amber-600 mb-1.5 flex items-center">
                Pago mínimo ($)
                <FieldHint field="minPayment" />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <Input value={slot.draft.minPayment}
                  onChange={e => handleNum('minPayment', e.target.value)}
                  placeholder="12.500" className="h-9 text-sm pl-6 border-amber-200 focus-visible:ring-amber-400" />
              </div>
            </div>
          </div>

          {/* Guide toggle */}
          <button onClick={() => setShowGuide(s => !s)}
            className="flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline">
            {showGuide ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            ¿Dónde encuentro estos datos en mi resumen?
          </button>
          <AnimatePresence>
            {showGuide && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <StatementGuide />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm button */}
          <Button onClick={() => onConfirm(slot.id)} disabled={!canConfirm}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold gap-2" size="sm">
            <CheckCircle2 size={14} /> Confirmar datos de esta tarjeta
          </Button>
        </div>
      ) : (
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CreditCard size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{slot.draft.name}</p>
              <p className="text-xs text-slate-500">
                Saldo: <span className="font-bold text-rose-600">{formatCurrency(balanceVal)}</span> · TNA: {slot.draft.tna}%
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 h-8 px-2"
            onClick={() => onRemove(slot.id)}>
            <Trash2 size={13} />
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Analysis panel ───────────────────────────────────────────────────────────

function AnalysisPanel({ debts }: { debts: ImportedDebt[] }) {
  const [extra, setExtra] = useState(20000);

  const snowball = simulateSnowball(debts.map(d => ({
    id: d.id, name: d.name, balance: d.balance, tna: d.tna, minPayment: d.minPayment,
  })), extra);
  const avalanche = simulateAvalanche(debts.map(d => ({
    id: d.id, name: d.name, balance: d.balance, tna: d.tna, minPayment: d.minPayment,
  })), extra);
  const minimum = simulateMinimumOnly(debts.map(d => ({
    id: d.id, name: d.name, balance: d.balance, tna: d.tna, minPayment: d.minPayment,
  })));

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);

  const maxM = Math.min(Math.max(snowball.months, avalanche.months, 6), 120);
  const chartData = Array.from({ length: maxM + 1 }, (_, i) => ({
    month: i,
    'Bola de nieve': i === 0 ? totalDebt : (snowball.schedule[i - 1]?.totalBalance ?? 0),
    'Avalancha': i === 0 ? totalDebt : (avalanche.schedule[i - 1]?.totalBalance ?? 0),
    'Solo mínimos': i === 0 ? totalDebt : (minimum.schedule[i - 1]?.totalBalance ?? 0),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-accent" />
          <h3 className="font-bold text-base">Análisis de {debts.length} deuda{debts.length > 1 ? 's' : ''}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><div className="text-white/50 text-xs mb-1">Deuda total</div><div className="text-xl font-black text-rose-400 tabular-nums">{formatCurrency(totalDebt)}</div></div>
          <div><div className="text-white/50 text-xs mb-1">Bola de nieve</div><div className="text-xl font-black text-blue-400 tabular-nums">{snowball.months} meses</div></div>
          <div><div className="text-white/50 text-xs mb-1">Avalancha</div><div className="text-xl font-black text-emerald-400 tabular-nums">{avalanche.months} meses</div></div>
          <div><div className="text-white/50 text-xs mb-1">Solo mínimos</div><div className="text-xl font-black text-slate-400 tabular-nums">{minimum.months > 200 ? '∞' : `${minimum.months}m`}</div></div>
        </div>
      </div>

      {/* Extra payment */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl px-5 py-3.5 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">Pago extra mensual disponible</p>
          <p className="text-xs text-slate-500">¿Cuánto más podés pagar por mes además del mínimo?</p>
        </div>
        <div className="relative w-40 shrink-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <Input type="text" value={extra.toLocaleString('es-AR')}
            onChange={e => { const v = parseInt(e.target.value.replace(/\D/g, '')); setExtra(isNaN(v) ? 0 : v); }}
            className="pl-7 h-9 text-sm font-bold" />
        </div>
      </div>

      {/* Savings callout */}
      {minimum.totalInterest > avalanche.totalInterest && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-emerald-800 text-sm">Con estrategia avalancha ahorrás {formatCurrency(minimum.totalInterest - avalanche.totalInterest)} en intereses</p>
            <p className="text-xs text-emerald-600 mt-0.5">Y cancelás {minimum.months - avalanche.months} meses antes que pagando solo el mínimo. Recomendamos empezar con avalancha.</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <p className="text-sm font-bold text-slate-800 mb-4">Evolución del saldo total — {debts.length} tarjeta{debts.length > 1 ? 's' : ''}</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 16, left: 16, bottom: 5 }}>
              <defs>
                <linearGradient id="gSn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.1} /><stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gMn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} /><stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 24% 92%)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={52} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={l => `Mes ${l}`} contentStyle={{ borderRadius: 12, border: 'none', background: '#0f172a', color: '#fff', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="Bola de nieve" stroke="#2563eb" strokeWidth={2} fill="url(#gSn)" dot={false} />
              <Area type="monotone" dataKey="Avalancha" stroke="#059669" strokeWidth={2} fill="url(#gAv)" dot={false} />
              <Area type="monotone" dataKey="Solo mínimos" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" fill="url(#gMn)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-debt table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-100 text-sm font-bold text-slate-700">Detalle por tarjeta</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Tarjeta', 'Saldo', 'TNA', 'Mínimo', 'Interés/mes'].map(h => (
                <th key={h} className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right first:text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...debts].sort((a, b) => b.tna - a.tna).map((d, i) => (
              <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-800">{d.name}</div>
                  <div className="text-xs text-slate-400">{d.bank}</div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-rose-600 tabular-nums">{formatCurrency(d.balance)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold text-sm px-2 py-0.5 rounded-lg tabular-nums ${d.tna >= 90 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                    {d.tna}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-600 tabular-nums">{formatCurrency(d.minPayment)}</td>
                <td className="px-4 py-3 text-right font-medium text-amber-600 tabular-nums">
                  {formatCurrency(d.balance * d.tna / 12 / 100)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DebtImporterProps {
  isPaid?: boolean;
  onPayForAnalysis?: () => void;
  paying?: boolean;
}

export function DebtImporter({ isPaid = false, onPayForAnalysis, paying = false }: DebtImporterProps) {
  const [slots, setSlots] = useState<FileSlot[]>([]);
  const [confirmedDebts, setConfirmedDebts] = useState<ImportedDebt[]>([]);
  const [showGuideOnly, setShowGuideOnly] = useState(false);

  const addFiles = async (files: File[]) => {
    const newSlots: FileSlot[] = files.map(file => ({
      id: genId(),
      file,
      previewUrl: URL.createObjectURL(file),
      isPdf: file.type === 'application/pdf',
      parsing: file.type === 'application/pdf',
      draft: { name: file.name.replace(/\.[^.]+$/, ''), bank: '', balance: '', minPayment: '', tna: '' },
      confirmed: false,
    }));

    setSlots(prev => [...prev, ...newSlots]);

    // Parse PDFs
    for (const slot of newSlots) {
      if (!slot.isPdf) continue;
      try {
        const text = await extractPdfText(slot.file);
        const parsed = parseStatement(text, slot.file.name);
        setSlots(prev => prev.map(s => s.id === slot.id ? {
          ...s,
          parsing: false,
          parsed,
          confidence: parsed.confidence,
          draft: {
            name: parsed.bankName || s.draft.name,
            bank: parsed.bankName || '',
            balance: parsed.balance ? parsed.balance.toLocaleString('es-AR') : '',
            minPayment: parsed.minPayment ? parsed.minPayment.toLocaleString('es-AR') : '',
            tna: parsed.tna ? parsed.tna.toString() : (parsed.bankName && BANK_TNA[parsed.bankName] ? BANK_TNA[parsed.bankName].toString() : ''),
          },
        } : s));
      } catch {
        setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, parsing: false, confidence: 'low', error: 'No se pudo leer el PDF' } : s));
      }
    }
  };

  const updateSlot = (id: string, field: string, value: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, draft: { ...s.draft, [field]: value } } : s));
  };

  const confirmSlot = (id: string) => {
    const slot = slots.find(s => s.id === id);
    if (!slot) return;
    const balance = parseFloat(slot.draft.balance.replace(/\./g, '').replace(',', '.'));
    const minPayment = parseFloat(slot.draft.minPayment.replace(/\./g, '').replace(',', '.'));
    const tna = parseFloat(slot.draft.tna.replace(',', '.'));
    const debt: ImportedDebt = {
      id: slot.id,
      name: slot.draft.name || slot.draft.bank || 'Tarjeta',
      bank: slot.draft.bank,
      balance,
      minPayment,
      tna,
      fileName: slot.file.name,
      confidence: slot.confidence,
    };
    setSlots(prev => prev.map(s => s.id === id ? { ...s, confirmed: true } : s));
    setConfirmedDebts(prev => {
      const without = prev.filter(d => d.id !== id);
      return [...without, debt];
    });
  };

  const removeSlot = (id: string) => {
    setSlots(prev => {
      const slot = prev.find(s => s.id === id);
      if (slot) URL.revokeObjectURL(slot.previewUrl);
      return prev.filter(s => s.id !== id);
    });
    setConfirmedDebts(prev => prev.filter(d => d.id !== id));
  };

  const addManual = () => {
    const id = genId();
    setSlots(prev => [...prev, {
      id,
      file: new File([], 'Manual'),
      previewUrl: '',
      isPdf: false,
      parsing: false,
      confidence: 'low',
      draft: { name: '', bank: '', balance: '', minPayment: '', tna: '' },
      confirmed: false,
    }]);
  };

  return (
    <div className="space-y-6">
      {/* Intro panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              Importá tus resúmenes de tarjeta
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Subí el PDF o foto de cada resumen — leemos los datos por vos. También podés ingresar todo a mano.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 border-slate-300" onClick={() => setShowGuideOnly(s => !s)}>
              <HelpCircle size={12} /> {showGuideOnly ? 'Ocultar guía' : 'Ver guía de datos'}
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1.5 border-slate-300" onClick={addManual}>
              <Plus size={12} /> Agregar manualmente
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Privacy notice */}
          <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3.5">
            <ShieldCheck size={16} className="text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-teal-800">Tu privacidad está completamente protegida</p>
              <p className="text-xs text-teal-700 mt-0.5 leading-relaxed">
                Los resúmenes que subís se procesan <strong>únicamente en tu navegador</strong> y nunca se envían a ningún servidor.
                No almacenamos tus saldos, datos de tarjetas ni información financiera personal.
                El único dato que se guarda, si así lo elegís, es el del <strong>formulario de contacto</strong> para coordinar una consulta con Renzo.
              </p>
            </div>
          </div>

          {/* Visual guide */}
          <AnimatePresence>
            {showGuideOnly && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <StatementGuide />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drop zone */}
          <DropZone onFiles={addFiles} />

          {/* Steps legend */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { step: '1', icon: <Upload size={13} />, label: 'Subí el resumen', desc: 'PDF o foto' },
              { step: '2', icon: <Sparkles size={13} />, label: 'Revisá los datos', desc: 'Auto-detectados' },
              { step: '3', icon: <CheckCircle2 size={13} />, label: 'Confirmá', desc: 'Y analizamos todo' },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center text-center gap-1.5 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent">{s.icon}</div>
                <span className="text-xs font-bold text-slate-700">{s.label}</span>
                <span className="text-xs text-slate-400">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* File cards */}
      {slots.length > 0 && (
        <div className="space-y-3">
          {slots.map(slot => (
            <FileCard key={slot.id} slot={slot} onUpdate={updateSlot} onConfirm={confirmSlot} onRemove={removeSlot} />
          ))}
          {slots.some(s => !s.confirmed) && (
            <button onClick={addFiles.bind(null, [])} className="hidden" />
          )}
        </div>
      )}

      {/* Add more button */}
      {slots.length > 0 && (
        <label className="flex items-center justify-center gap-2 text-sm font-semibold text-accent border-2 border-dashed border-accent/30 rounded-xl py-3.5 cursor-pointer hover:border-accent/60 hover:bg-accent/5 transition-all">
          <Plus size={16} /> Agregar otra tarjeta
          <input type="file" accept=".pdf,image/*" multiple className="hidden"
            onChange={e => { if (e.target.files?.length) addFiles(Array.from(e.target.files)); }} />
        </label>
      )}

      {/* Analysis — gated */}
      {confirmedDebts.length > 0 && isPaid && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
              <Sparkles size={13} className="text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Análisis de tus {confirmedDebts.length} deuda{confirmedDebts.length > 1 ? 's' : ''}
            </h3>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
              {confirmedDebts.length} tarjeta{confirmedDebts.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <AnalysisPanel debts={confirmedDebts} />
        </div>
      )}

      {/* Locked teaser when debts confirmed but not paid */}
      {confirmedDebts.length > 0 && !isPaid && (() => {
        const totalDebt = confirmedDebts.reduce((s, d) => s + d.balance, 0);
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-teal-100 shadow-sm overflow-hidden"
          >
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                  <Sparkles size={16} className="text-teal-400" />
                </div>
                <div>
                  <p className="text-white font-black text-sm">Análisis listo para {confirmedDebts.length} tarjeta{confirmedDebts.length > 1 ? 's' : ''}</p>
                  <p className="text-white/50 text-xs">Deuda total detectada: <span className="text-rose-400 font-bold">${totalDebt.toLocaleString('es-AR')}</span></p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Bola de nieve vs. Avalancha', 'Gráfico de evolución', 'Estrategia óptima', 'Ahorro en intereses'].map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs font-semibold text-white/60 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">
                    <Lock size={9} /> {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-800">Desbloqueá el análisis completo</p>
                <p className="text-xs text-slate-500">Pago único de $1.000 ARS por Mercado Pago · Acceso inmediato</p>
              </div>
              <Button
                onClick={onPayForAnalysis}
                disabled={paying}
                className="shrink-0 bg-teal-500 hover:bg-teal-400 text-white font-black gap-2 rounded-xl"
              >
                {paying
                  ? <><Loader2 size={13} className="animate-spin" /> Procesando...</>
                  : <><Lock size={13} /> Ver análisis — $1.000 ARS</>}
              </Button>
            </div>
          </motion.div>
        );
      })()}

      {/* Empty state for analysis */}
      {slots.length > 0 && confirmedDebts.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">Confirmá al menos una tarjeta para ver el análisis</p>
        </div>
      )}
    </div>
  );
}
