import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { simulatePrepayment, formatCurrency, AmortizationMethod } from '@/lib/calculations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Clock, DollarSign, Zap } from 'lucide-react';

const schema = z.object({
  extraMonthly: z.number().min(0).max(500000000),
  lumpSumPeriod: z.number().min(1).max(360),
  lumpSumAmount: z.number().min(0).max(500000000)
});

type FormValues = z.infer<typeof schema>;

interface EarlyPaymentSimulatorProps {
  principal: number;
  tna: number;
  months: number;
  method: AmortizationMethod;
  originalTotal: number;
  originalInterest: number;
}

export function EarlyPaymentSimulator({ principal, tna, months, method, originalTotal, originalInterest }: EarlyPaymentSimulatorProps) {
  const [params, setParams] = useState<FormValues>({
    extraMonthly: 0,
    lumpSumPeriod: 6,
    lumpSumAmount: 0
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: params,
    mode: 'onChange'
  });

  const result = useMemo(() => {
    if (params.extraMonthly === 0 && params.lumpSumAmount === 0) return null;
    return simulatePrepayment(
      principal, tna, months, method,
      params.extraMonthly,
      params.lumpSumPeriod,
      params.lumpSumAmount
    );
  }, [params, principal, tna, months, method]);

  const onSubmit = (values: FormValues) => setParams(values);

  const handleInputChange = (fieldName: keyof FormValues, rawValue: string) => {
    const num = parseInt(rawValue.replace(/\D/g, ''), 10);
    form.setValue(fieldName, isNaN(num) ? 0 : num, { shouldValidate: true });
  };

  return (
    <div className="space-y-5 pt-2">
      <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <Zap size={14} className="text-accent" />
            Cuota extra mensual fija
          </h4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="extraMonthly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-600">Monto adicional por mes</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <Input
                          type="text"
                          placeholder="0"
                          value={field.value === 0 ? '' : field.value.toLocaleString('es-AR')}
                          onChange={(e) => handleInputChange('extraMonthly', e.target.value)}
                          className="pl-7 h-10 bg-white text-sm"
                          data-testid="input-extra-monthly"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <p className="text-xs text-slate-500 mt-2">Se aplica al capital todos los meses, reduciendo el saldo y el plazo.</p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <DollarSign size={14} className="text-accent" />
            Pago único extraordinario
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600 block mb-1">En la cuota N°</label>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="lumpSumPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={months}
                            value={field.value}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            className="h-10 bg-white text-sm w-24"
                            data-testid="input-lump-sum-period"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">Monto del pago único</label>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="lumpSumAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                            <Input
                              type="text"
                              placeholder="0"
                              value={field.value === 0 ? '' : field.value.toLocaleString('es-AR')}
                              onChange={(e) => handleInputChange('lumpSumAmount', e.target.value)}
                              className="pl-7 h-10 bg-white text-sm"
                              data-testid="input-lump-sum-amount"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={form.handleSubmit(onSubmit)}
        className="w-full sm:w-auto font-bold"
        data-testid="button-simulate-prepayment"
      >
        Simular prepago
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <Clock size={18} className="text-emerald-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-700">{result.finalPeriod}</div>
              <div className="text-xs text-emerald-600 font-medium">meses restantes</div>
              {result.monthsSaved > 0 && (
                <Badge className="mt-1 bg-emerald-100 text-emerald-700 border-none text-xs">
                  -{result.monthsSaved} meses
                </Badge>
              )}
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
              <TrendingDown size={18} className="text-rose-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-rose-700">{formatCurrency(result.totalInterest)}</div>
              <div className="text-xs text-rose-600 font-medium">intereses con prepago</div>
              {result.interestSaved > 0 && (
                <Badge className="mt-1 bg-rose-100 text-rose-700 border-none text-xs">
                  -{formatCurrency(result.interestSaved)}
                </Badge>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
              <DollarSign size={18} className="text-slate-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-slate-800">{formatCurrency(result.totalPaid)}</div>
              <div className="text-xs text-slate-500 font-medium">total a pagar</div>
              <div className="text-xs text-slate-400 mt-0.5">antes: {formatCurrency(originalTotal)}</div>
            </div>

            {result.interestSaved > 0 && (
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                <Zap size={18} className="text-accent mx-auto mb-1" />
                <div className="text-lg font-bold text-primary">{formatCurrency(result.interestSaved)}</div>
                <div className="text-xs text-primary/70 font-medium">ahorro total en intereses</div>
                <div className="text-xs text-primary/50 mt-0.5">
                  {((result.interestSaved / originalInterest) * 100).toFixed(0)}% del interés original
                </div>
              </div>
            )}
          </div>

          {/* Mini schedule with prepayment */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Tabla con prepago aplicado</span>
            </div>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-slate-500">Cuota</th>
                    <th className="px-3 py-2 text-right text-slate-500">Pago</th>
                    <th className="px-3 py-2 text-right text-rose-500">Interés</th>
                    <th className="px-3 py-2 text-right text-emerald-600">Capital</th>
                    <th className="px-3 py-2 text-right text-slate-500">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {result.schedule.map((row, i) => (
                    <tr
                      key={row.period}
                      className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} ${row.period === params.lumpSumPeriod && params.lumpSumAmount > 0 ? 'bg-accent/10' : ''}`}
                      data-testid={`row-prepayment-${row.period}`}
                    >
                      <td className="px-3 py-1.5 text-slate-400 font-medium">
                        #{row.period}
                        {row.period === params.lumpSumPeriod && params.lumpSumAmount > 0 && (
                          <Badge className="ml-1 bg-accent/20 text-primary border-none text-xs px-1">+extra</Badge>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-right font-bold text-slate-800">{formatCurrency(row.payment)}</td>
                      <td className="px-3 py-1.5 text-right text-rose-600">{formatCurrency(row.interest)}</td>
                      <td className="px-3 py-1.5 text-right text-emerald-700 font-medium">{formatCurrency(row.amortization)}</td>
                      <td className="px-3 py-1.5 text-right text-slate-600">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {!result && (
        <div className="text-center text-sm text-slate-400 py-4">
          Ingresa un monto de prepago para ver el impacto en tu préstamo.
        </div>
      )}
    </div>
  );
}
