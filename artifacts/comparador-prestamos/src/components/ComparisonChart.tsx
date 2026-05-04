import { CalculatedResult } from '@/pages/Comparador';
import { AmortizationMethod } from '@/lib/calculations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { formatCurrency } from '@/lib/calculations';

interface ComparisonChartProps {
  results: CalculatedResult[];
  method: AmortizationMethod;
}

const METHOD_CHART_LABEL: Record<AmortizationMethod, string> = {
  frances: 'Cuota fija mensual',
  aleman: 'Cuota inicial',
  americano: 'Cuota mensual (intereses)',
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; shortName: string; cuota: number; interest: number; capital: number } }> }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const total = d.interest + d.capital;
    const intPct = total > 0 ? Math.round((d.interest / total) * 100) : 0;
    const capPct = 100 - intPct;
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-sm min-w-[180px]">
        <p className="font-bold text-white mb-2">{d.name}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-white/60 text-xs">Cuota</span>
            <span className="font-bold text-accent">{formatCurrency(d.cuota)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-rose-400 text-xs">Interés ({intPct}%)</span>
            <span className="text-rose-300">{formatCurrency(d.interest)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-emerald-400 text-xs">Capital ({capPct}%)</span>
            <span className="text-emerald-300">{formatCurrency(d.capital)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ComparisonChart({ results, method }: ComparisonChartProps) {
  const top = results.slice(0, 7);
  const chartData = top.map(r => {
    const monthlyRate = r.tna / 12 / 100;
    const interest = r.monthlyPayment > 0 ? Math.round(r.monthlyPayment > 0 ? (method === 'americano' ? r.monthlyPayment : Math.min(r.monthlyPayment - 1, Math.round(r.totalInterest / r.totalPayment * r.monthlyPayment))) : 0) : 0;
    const interestApprox = method === 'americano'
      ? Math.round(r.monthlyPayment)
      : Math.round(r.avgMonthlyPayment * (r.tna / 12 / 100) / (r.tna / 12 / 100 + 1 / r.totalPayment * r.monthlyPayment) || 0);
    const capital = Math.round(r.monthlyPayment - interestApprox);
    return {
      name: r.name,
      shortName: r.logo,
      cuota: Math.round(r.monthlyPayment),
      interest: Math.max(0, interestApprox),
      capital: Math.max(0, capital),
    };
  });

  const minVal = Math.min(...chartData.map(d => d.cuota));
  const maxVal = Math.max(...chartData.map(d => d.cuota));

  return (
    <Card className="border border-slate-200/80 shadow-lg bg-white rounded-2xl overflow-hidden">
      <CardHeader className="pb-0 pt-5 px-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-800">
            {METHOD_CHART_LABEL[method]} — Top 7 bancos
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Diferencia: {formatCurrency(maxVal - minVal)} entre el más caro y el más barato
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
            Mejor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            Otros
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <div className="h-[280px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 16, left: 16, bottom: 8 }} barGap={4}>
              <defs>
                <linearGradient id="barBest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(173 80% 38%)" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(173 80% 28%)" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="barOther" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(222 47% 20%)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="hsl(222 47% 14%)" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(220 24% 92%)"
                strokeWidth={1}
              />
              <ReferenceLine
                y={minVal}
                stroke="hsl(173 80% 40%)"
                strokeDasharray="4 4"
                strokeWidth={1}
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="shortName"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 16% 47%)', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={48}
              />
              <Tooltip
                cursor={{ fill: 'hsl(220 33% 97%)', rx: 6 }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="cuota" radius={[8, 8, 0, 0]} maxBarSize={52}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? 'url(#barBest)' : 'url(#barOther)'}
                    opacity={index === 0 ? 1 : 0.65 + (index === 1 ? 0.1 : 0)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
