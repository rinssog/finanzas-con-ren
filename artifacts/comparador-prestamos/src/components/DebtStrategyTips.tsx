import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Snowflake, TrendingDown, ArrowRightLeft, Shield, AlertTriangle, Lightbulb } from 'lucide-react';

interface Tip {
  id: string;
  icon: React.ReactNode;
  title: string;
  tag: string;
  tagColor: string;
  summary: string;
  detail: string[];
  example?: string;
  warning?: string;
}

const TIPS: Tip[] = [
  {
    id: 'snowball',
    icon: <Snowflake size={20} />,
    title: 'Bola de nieve',
    tag: 'Motivacional',
    tagColor: 'bg-blue-100 text-blue-700',
    summary: 'Pagá la deuda más pequeña primero para acumular victorias rápidas y mantener la motivación.',
    detail: [
      'Listá todas tus deudas de menor a mayor saldo.',
      'Pagá el mínimo en todas las deudas excepto la más pequeña.',
      'Todo el dinero extra va contra la deuda más pequeña hasta cancelarla.',
      'Cuando la cancelás, tomá todo lo que pagabas ahí y sumalo a la siguiente.',
      'La "bola de nieve" crece con cada deuda que cancelás.',
    ],
    example: 'Si tenés: $50.000 en Visa, $200.000 en Mastercard y $500.000 en Amex → atacás primero la Visa.',
    warning: 'No es la estrategia más barata en intereses, pero funciona porque te da victorias rápidas.',
  },
  {
    id: 'avalanche',
    icon: <TrendingDown size={20} />,
    title: 'Avalancha de deuda',
    tag: 'Ahorro máximo',
    tagColor: 'bg-emerald-100 text-emerald-700',
    summary: 'Atacá primero la deuda con mayor tasa de interés. Matemáticamente es la estrategia más barata.',
    detail: [
      'Listá todas tus deudas de mayor a menor TNA (tasa nominal anual).',
      'Pagá el mínimo en todas excepto la de mayor tasa.',
      'Todo el excedente va contra la deuda con tasa más alta.',
      'Al cancelarla, redirigís todo ese dinero a la siguiente tasa más alta.',
      'Minimizás el interés total pagado a lo largo del tiempo.',
    ],
    example: 'Si Naranja cobra 92% TNA y Visa cobra 62% TNA → atacás Naranja primero aunque el saldo sea mayor.',
    warning: 'Requiere más paciencia que la bola de nieve, pero ahorrás más dinero en el largo plazo.',
  },
  {
    id: 'consolidation',
    icon: <ArrowRightLeft size={20} />,
    title: 'Consolidación de deuda',
    tag: 'Simplifica',
    tagColor: 'bg-violet-100 text-violet-700',
    summary: 'Unificá todas tus deudas de tarjeta en un préstamo personal con tasa más baja.',
    detail: [
      'Calculá el total de todas tus deudas de tarjeta.',
      'Pedí un préstamo personal por ese monto (las tasas suelen ser menores).',
      'Cancelás todas las tarjetas de golpe con ese préstamo.',
      'Quedás con una sola cuota fija, más baja y predecible.',
      'Cerrá o congelá las tarjetas para no volver a endeudarte.',
    ],
    example: 'Tarjetas con TNA ~88% consolidadas en un préstamo del Banco Nación al 40% TNA = ahorro significativo.',
    warning: 'Solo funciona si no volvés a usar las tarjetas para gastar de más.',
  },
  {
    id: 'minimum',
    icon: <AlertTriangle size={20} />,
    title: 'La trampa del pago mínimo',
    tag: 'Peligro',
    tagColor: 'bg-rose-100 text-rose-700',
    summary: 'Pagar solo el mínimo es la forma más cara de cancelar una deuda. Evitalo a toda costa.',
    detail: [
      'El pago mínimo suele ser el 5% del saldo o $X fijo.',
      'Con pagos mínimos, una deuda de $100.000 al 80% TNA puede tardar más de 10 años en cancelarse.',
      'Terminás pagando 3 o 4 veces el valor original solo en intereses.',
      'Cada mes que financiás tu saldo, el banco gana; vos perdés.',
      'Si te es imposible pagar más, prioritizá al menos una deuda con extra.',
    ],
    example: '$200.000 de deuda al 88% TNA con pago mínimo del 5% → pagás más de $600.000 en total.',
    warning: 'Nunca pagues solo el mínimo si podés pagar más. La diferencia es enorme.',
  },
  {
    id: 'rules',
    icon: <Shield size={20} />,
    title: 'Reglas de oro para tarjetas',
    tag: 'Prevención',
    tagColor: 'bg-amber-100 text-amber-700',
    summary: 'Hábitos simples que evitan que las tarjetas se conviertan en un problema.',
    detail: [
      'Pagá el resumen completo antes del vencimiento para evitar cualquier interés.',
      'Usá la tarjeta como herramienta de pago, no como crédito adicional.',
      'Si financiás algo, calculá el costo real con la TNA antes de hacerlo.',
      'Tenés derecho a pagar el saldo total en cualquier momento (cancelación anticipada).',
      'Revisá tu resumen cada mes y detectá cargos no reconocidos inmediatamente.',
      'El límite de tu tarjeta no es tu presupuesto: es el techo de tu deuda posible.',
    ],
    warning: undefined,
  },
  {
    id: 'tips',
    icon: <Lightbulb size={20} />,
    title: 'Tips avanzados para salir de deudas',
    tag: 'Experto',
    tagColor: 'bg-cyan-100 text-cyan-700',
    summary: 'Tácticas adicionales para acelerar la salida de deudas y ahorrar en intereses.',
    detail: [
      'Llamá al banco y pedí una reducción de tasa: a veces funciona si sos buen pagador.',
      'Aprovechá los meses sin interés (MSI) para compras planificadas, no compulsivas.',
      'Si recibís un ingreso extra (aguinaldo, bono), destinalo íntegro a la deuda de mayor tasa.',
      'Automatizá un pago extra mensual para no depender de la disciplina manual.',
      'Evitá abrir nuevas deudas mientras estás pagando: cada nueva tarjeta es un hoyo nuevo.',
      'Usá la calculadora de bola de nieve aquí arriba para ver exactamente cuánto ahorrás.',
    ],
    warning: 'La mejor deuda es la que no existe. Ahorrá antes de comprar cuando sea posible.',
  },
];

function TipCard({ tip }: { tip: Tip }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border bg-white shadow-sm overflow-hidden transition-shadow ${open ? 'shadow-md' : ''}`}>
      <button
        className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 transition-colors"
        onClick={() => setOpen(o => !o)}
        data-testid={`tip-toggle-${tip.id}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            {tip.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm">{tip.title}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tip.tagColor}`}>{tip.tag}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug pr-4">{tip.summary}</p>
          </div>
        </div>
        <div className="shrink-0 text-slate-400">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-100 bg-slate-50/40">
              <ul className="space-y-2">
                {tip.detail.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              {tip.example && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Ejemplo: </span>
                  <span className="text-sm text-blue-800">{tip.example}</span>
                </div>
              )}

              {tip.warning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-amber-800">{tip.warning}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DebtStrategyTips() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={18} className="text-amber-500" />
        <h2 className="text-lg font-bold text-slate-900">Estrategias para cancelar deudas</h2>
      </div>
      {TIPS.map(tip => (
        <TipCard key={tip.id} tip={tip} />
      ))}
    </div>
  );
}
