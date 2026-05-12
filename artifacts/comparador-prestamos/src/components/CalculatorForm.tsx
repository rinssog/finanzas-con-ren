import { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { LoanType } from '@/data/banks';
import { AmortizationMethod } from '@/lib/calculations';
import { formatCurrency } from '@/lib/calculations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const formSchema = z.object({
  loanType: z.enum(['personal', 'hipotecario']),
  amount: z.number().min(10000, "El monto mínimo es $10.000").max(1000000000, "El monto máximo es $1.000.000.000"),
  months: z.number(),
  method: z.enum(['frances', 'aleman', 'americano'])
});

type FormValues = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  loanType: LoanType;
  setLoanType: (type: LoanType) => void;
  amount: number;
  setAmount: (amount: number) => void;
  months: number;
  setMonths: (months: number) => void;
  method: AmortizationMethod;
  setMethod: (method: AmortizationMethod) => void;
  onCompare?: () => void;
  compareLabel?: string;
  compareLoading?: boolean;
}

const METHOD_INFO: Record<AmortizationMethod, { label: string; desc: string }> = {
  frances: {
    label: 'Francés',
    desc: 'Cuota fija todos los meses. El más común en Argentina.'
  },
  aleman: {
    label: 'Alemán',
    desc: 'Amortización constante. La cuota baja cada mes. Pagas menos interés total.'
  },
  americano: {
    label: 'Americano',
    desc: 'Solo intereses cada mes. Devolvés todo el capital en la última cuota.'
  }
};

export function CalculatorForm({ loanType, setLoanType, amount, setAmount, months, setMonths, method, setMethod, onCompare, compareLabel, compareLoading }: CalculatorFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const personalMonths = [6, 12, 18, 24, 36, 48, 60];
  const hipotecarioMonths = [60, 120, 180, 240];

  const currentMonthOptions = loanType === 'personal' ? personalMonths : hipotecarioMonths;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanType,
      amount,
      months,
      method
    },
    mode: "onChange"
  });

  const { watch, setValue } = form;
  const formValues = watch();

  useEffect(() => {
    if (formValues.loanType !== loanType) {
      setLoanType(formValues.loanType);
      if (formValues.loanType === 'personal' && !personalMonths.includes(formValues.months)) {
        setValue('months', 24);
      } else if (formValues.loanType === 'hipotecario' && !hipotecarioMonths.includes(formValues.months)) {
        setValue('months', 120);
      }
    }
  }, [formValues.loanType, loanType, setValue]);

  useEffect(() => {
    if (formValues.amount >= 10000 && formValues.amount <= 1000000000) {
      setAmount(formValues.amount);
    }
    setMonths(formValues.months);
    setMethod(formValues.method);
  }, [formValues.amount, formValues.months, formValues.method, setAmount, setMonths, setMethod]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
    if (!isNaN(val)) {
      setValue('amount', val, { shouldValidate: true });
    } else if (e.target.value === '') {
      setValue('amount', 0, { shouldValidate: true });
    }
  };

  return (
    <Card className="border-none shadow-lg bg-white overflow-hidden">
      <div className="h-2 bg-accent w-full" />
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-primary">Compará y elegí el mejor préstamo</CardTitle>
        <CardDescription className="text-base text-slate-500">Ingresá el monto y plazo — te mostramos cuál banco te cobra menos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>

            {/* Tipo de producto */}
            <FormField
              control={form.control}
              name="loanType"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel className="text-base font-semibold">Tipo de producto</FormLabel>
                  <FormControl>
                    <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100 p-1">
                        <TabsTrigger value="personal" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md" data-testid="tab-personal">Préstamo Personal</TabsTrigger>
                        <TabsTrigger value="hipotecario" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md" data-testid="tab-hipotecario">Crédito Hipotecario</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Opciones avanzadas — colapsable */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm text-slate-600 font-medium"
              >
                <span className="flex items-center gap-2">
                  <Info size={14} className="text-slate-400" />
                  Opciones avanzadas — método de amortización
                </span>
                {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {showAdvanced && (
                <div className="px-4 py-4 bg-white">
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-3">
                        <p className="text-xs text-slate-400 -mt-1">El método define cómo se divide cada cuota. El <strong>Francés</strong> es el más común en Argentina.</p>
                        <FormControl>
                          <div className="grid grid-cols-3 gap-3">
                            {(Object.keys(METHOD_INFO) as AmortizationMethod[]).map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => field.onChange(m)}
                                data-testid={`method-${m}`}
                                className={`rounded-xl border-2 px-4 py-3 text-left transition-all cursor-pointer ${
                                  field.value === m
                                    ? 'border-accent bg-accent/10 text-primary shadow-sm'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <div className="font-bold text-sm mb-1">{METHOD_INFO[m].label}</div>
                                <div className="text-xs text-slate-500 leading-tight">{METHOD_INFO[m].desc}</div>
                              </button>
                            ))}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Monto + Plazo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <FormLabel className="text-base font-semibold">Monto a solicitar</FormLabel>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(field.value)}</span>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                        <Input
                          type="text"
                          value={field.value === 0 ? '' : field.value.toLocaleString('es-AR')}
                          onChange={handleAmountChange}
                          className="pl-8 text-lg h-14 bg-slate-50 border-slate-200 focus-visible:ring-accent"
                          data-testid="input-amount"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="months"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <FormLabel className="text-base font-semibold">Plazo (meses)</FormLabel>
                      <span className="text-2xl font-bold text-primary">{field.value} meses</span>
                    </div>
                    <FormControl>
                      <div className="pt-4 pb-2 px-2">
                        <Slider
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                          min={currentMonthOptions[0]}
                          max={currentMonthOptions[currentMonthOptions.length - 1]}
                          step={loanType === 'personal' ? 6 : 60}
                          className="py-4"
                          data-testid="slider-months"
                        />
                        <div className="flex justify-between mt-2 text-xs font-medium text-slate-400 px-1">
                          <span>{currentMonthOptions[0]}m</span>
                          <span>{currentMonthOptions[currentMonthOptions.length - 1]}m</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              className="w-full md:w-auto md:self-end h-12 px-8 text-lg font-bold"
              data-testid="button-compare"
              onClick={onCompare}
              disabled={compareLoading}
            >
              {compareLoading ? 'Redirigiendo a Mercado Pago...' : (compareLabel || 'Comparar Ofertas')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
