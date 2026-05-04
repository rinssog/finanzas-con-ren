import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ResultsTable } from '@/components/ResultsTable';
import { SummaryCards } from '@/components/SummaryCards';
import { ComparisonChart } from '@/components/ComparisonChart';
import { AmortizationSchedule } from '@/components/AmortizationSchedule';
import { personalBanks, hipotecarioBanks, LoanType, BankRate } from '@/data/banks';
import { buildAmortizationSchedule, getFirstPayment, getAveragePayment, AmortizationMethod } from '@/lib/calculations';
import { Building2 } from 'lucide-react';

export interface CalculatedResult extends BankRate {
  rank: number;
  monthlyPayment: number;
  avgMonthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface DetailBank {
  name: string;
  logo: string;
  tna: number;
  cft: number;
}

export default function Comparador() {
  const [loanType, setLoanType] = useState<LoanType>('personal');
  const [amount, setAmount] = useState<number>(5000000);
  const [months, setMonths] = useState<number>(24);
  const [method, setMethod] = useState<AmortizationMethod>('frances');
  const [detailBank, setDetailBank] = useState<DetailBank | null>(null);

  const results: CalculatedResult[] = useMemo(() => {
    const banks = loanType === 'personal' ? personalBanks : hipotecarioBanks;

    const calculated = banks.map(bank => {
      const schedule = buildAmortizationSchedule(amount, bank.tna, months, method);
      const monthlyPayment = getFirstPayment(schedule);
      const avgMonthlyPayment = getAveragePayment(schedule);
      const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
      const totalInterest = totalPayment - amount;

      return {
        ...bank,
        monthlyPayment,
        avgMonthlyPayment,
        totalPayment,
        totalInterest
      };
    });

    calculated.sort((a, b) => a.cft - b.cft);

    return calculated.map((res, index) => ({
      ...res,
      rank: index + 1
    }));
  }, [loanType, amount, months, method]);

  const bestOption = results[0];
  const worstOption = results[results.length - 1];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-primary text-primary-foreground py-6 px-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="bg-accent p-2 rounded-lg text-primary">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ComparaYa</h1>
            <p className="text-primary-foreground/80 text-sm">Tu asesor financiero de bolsillo</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 flex flex-col gap-10">
        <section>
          <CalculatorForm
            loanType={loanType}
            setLoanType={setLoanType}
            amount={amount}
            setAmount={setAmount}
            months={months}
            setMonths={setMonths}
            method={method}
            setMethod={setMethod}
          />
        </section>

        {results.length > 0 && (
          <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SummaryCards bestOption={bestOption} worstOption={worstOption} />

            <ComparisonChart results={results} />

            <ResultsTable
              results={results}
              loanType={loanType}
              method={method}
              onViewDetail={(bank) => setDetailBank(bank)}
            />
          </section>
        )}

        <footer className="text-center text-sm text-slate-500 mt-10">
          <p>Las tasas son referenciales y pueden variar. Actualizadas mayo 2025.</p>
          {loanType === 'hipotecario' && (
            <p className="mt-1 font-medium">Nota: Los créditos hipotecarios ajustan su capital por inflación (UVA). La cuota mostrada es la inicial.</p>
          )}
        </footer>
      </main>

      <AnimatePresence>
        {detailBank && (
          <AmortizationSchedule
            bankName={detailBank.name}
            logo={detailBank.logo}
            tna={detailBank.tna}
            cft={detailBank.cft}
            principal={amount}
            months={months}
            method={method}
            onClose={() => setDetailBank(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
