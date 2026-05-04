import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { LoanType } from '@/data/banks';
import { formatCurrency } from '@/lib/calculations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  loanType: z.enum(['personal', 'hipotecario']),
  amount: z.number().min(10000, "El monto mínimo es $10.000").max(1000000000, "El monto máximo es $1.000.000.000"),
  months: z.number()
});

type FormValues = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  loanType: LoanType;
  setLoanType: (type: LoanType) => void;
  amount: number;
  setAmount: (amount: number) => void;
  months: number;
  setMonths: (months: number) => void;
}

export function CalculatorForm({ loanType, setLoanType, amount, setAmount, months, setMonths }: CalculatorFormProps) {
  const personalMonths = [6, 12, 18, 24, 36, 48, 60];
  const hipotecarioMonths = [60, 120, 180, 240];

  const currentMonthOptions = loanType === 'personal' ? personalMonths : hipotecarioMonths;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanType,
      amount,
      months
    },
    mode: "onChange"
  });

  const { watch, setValue } = form;
  const formValues = watch();

  useEffect(() => {
    if (formValues.loanType !== loanType) {
      setLoanType(formValues.loanType);
      
      // Auto-adjust months when type changes
      if (formValues.loanType === 'personal' && !personalMonths.includes(formValues.months)) {
        setValue('months', 24);
      } else if (formValues.loanType === 'hipotecario' && !hipotecarioMonths.includes(formValues.months)) {
        setValue('months', 120);
      }
    }
  }, [formValues.loanType, loanType, setValue]);

  useEffect(() => {
    // Notify parent of valid changes
    if (formValues.amount >= 10000 && formValues.amount <= 1000000000) {
      setAmount(formValues.amount);
    }
    setMonths(formValues.months);
  }, [formValues.amount, formValues.months, setAmount, setMonths]);

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
        <CardTitle className="text-2xl text-primary">Simulá tu préstamo</CardTitle>
        <CardDescription className="text-base text-slate-500">Ingresá los datos para encontrar la mejor opción del mercado.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name="loanType"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel className="text-base font-semibold">Tipo de producto</FormLabel>
                  <FormControl>
                    <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100 p-1">
                        <TabsTrigger value="personal" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">Préstamo Personal</TabsTrigger>
                        <TabsTrigger value="hipotecario" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">Crédito Hipotecario</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                </FormItem>
              )}
            />

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
                          step={formValues.loanType === 'personal' ? 6 : 60}
                          className="py-4"
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
            
            <Button type="button" className="w-full md:w-auto md:self-end h-12 px-8 text-lg font-bold">
              Comparar Ofertas
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
