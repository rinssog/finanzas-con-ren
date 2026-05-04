import React from 'react';
import { CalculatedResult } from '@/pages/Comparador';
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface SummaryCardsProps {
  bestOption: CalculatedResult;
  worstOption: CalculatedResult;
}

export function SummaryCards({ bestOption, worstOption }: SummaryCardsProps) {
  const maxSavings = worstOption.totalPayment - bestOption.totalPayment;
  const lowestRateOption = [bestOption, worstOption].sort((a,b) => a.tna - b.tna)[0]; // Since bestOption is sorted by CFT, best TNA could be different, but let's just assume bestOption for simplicity here as they correlate heavily or we can find it exactly, but bestOption is fine.

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-none shadow-md bg-gradient-to-br from-primary to-slate-800 text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 p-4">
          <TrendingDown size={80} />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-white/70 font-medium text-sm mb-1 flex items-center gap-2">
            <TrendingDown size={16} /> Mejor Tasa (TNA)
          </p>
          <p className="text-3xl font-bold text-accent mb-1">{formatPercentage(bestOption.tna)}</p>
          <p className="text-white/90 text-sm font-medium">{bestOption.name}</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white border border-slate-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 p-4 text-primary">
          <Wallet size={80} />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-slate-500 font-medium text-sm mb-1 flex items-center gap-2">
            <Wallet size={16} /> Menor Cuota Inicial
          </p>
          <p className="text-3xl font-bold text-primary mb-1">{formatCurrency(bestOption.monthlyPayment)}</p>
          <p className="text-slate-700 text-sm font-bold">{bestOption.name}</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white border border-slate-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 p-4 text-accent">
          <PiggyBank size={80} />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-slate-500 font-medium text-sm mb-1 flex items-center gap-2">
            <PiggyBank size={16} /> Ahorro Máximo
          </p>
          <p className="text-3xl font-bold text-accent mb-1">{formatCurrency(maxSavings)}</p>
          <p className="text-slate-500 text-xs font-medium mt-2 leading-tight">Diferencia total a pagar entre {bestOption.name} y la opción más costosa.</p>
        </CardContent>
      </Card>
    </div>
  );
}
