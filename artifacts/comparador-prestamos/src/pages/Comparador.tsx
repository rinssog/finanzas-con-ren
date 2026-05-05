import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'wouter';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ResultsTable } from '@/components/ResultsTable';
import { SummaryCards } from '@/components/SummaryCards';
import { ComparisonChart } from '@/components/ComparisonChart';
import { AmortizationSchedule } from '@/components/AmortizationSchedule';
import { personalBanks, hipotecarioBanks, LoanType, BankRate } from '@/data/banks';
import { buildAmortizationSchedule, getFirstPayment, getAveragePayment, AmortizationMethod } from '@/lib/calculations';
import { exportComparisonPdf } from '@/lib/pdfExport';
import { Building2, FileDown, BarChart3, Calculator, CreditCard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [exporting, setExporting] = useState(false);

  const results: CalculatedResult[] = useMemo(() => {
    const banks = loanType === 'personal' ? personalBanks : hipotecarioBanks;
    const calculated = banks.map(bank => {
      const schedule = buildAmortizationSchedule(amount, bank.tna, months, method);
      const monthlyPayment = getFirstPayment(schedule);
      const avgMonthlyPayment = getAveragePayment(schedule);
      const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
      const totalInterest = totalPayment - amount;
      return { ...bank, monthlyPayment, avgMonthlyPayment, totalPayment, totalInterest };
    });
    calculated.sort((a, b) => a.cft - b.cft);
    return calculated.map((res, index) => ({ ...res, rank: index + 1 }));
  }, [loanType, amount, months, method]);

  const bestOption = results[0];
  const worstOption = results[results.length - 1];

  const handleExportComparison = () => {
    setExporting(true);
    setTimeout(() => {
      exportComparisonPdf({ results, principal: amount, months, method, loanType });
      setExporting(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-dot-grid text-slate-900">
      {/* Header */}
      <header className="header-gradient text-primary-foreground py-5 px-6 sticky top-0 z-20 shadow-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xs">RG</span>
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight leading-none">ComparaYa</h1>
                <p className="text-primary-foreground/50 text-xs mt-0.5 font-medium">por Finanzas con Ren</p>
              </div>
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-primary-foreground/50">
            <BarChart3 size={13} />
            <span>{results.length} bancos comparados</span>
          </div>
        </div>
      </header>

      {/* Nav tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[73px] z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center">
          <Link href="/" className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold text-slate-400 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-200 transition-all mr-1">
            <Home size={13} /> Inicio
          </Link>
          <div className="w-px h-4 bg-slate-200 mr-1" />
          <span className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-accent border-b-2 border-accent transition-all">
            <Calculator size={15} />
            Préstamos
          </span>
          <Link href="/herramientas/tarjetas" className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:border-slate-300 transition-all">
            <CreditCard size={15} />
            Tarjetas
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24 flex flex-col gap-8">
        {/* Calculator card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
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
        </motion.section>

        <AnimatePresence mode="wait">
          {results.length > 0 && (
            <motion.section
              key={`${loanType}-${method}`}
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, staggerChildren: 0.08 }}
            >
              {/* Section header with export */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Resultados</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {results.length} bancos · ordenados por CFT
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-300 text-slate-700 hover:border-accent hover:text-accent font-semibold pulse-export"
                  onClick={handleExportComparison}
                  disabled={exporting}
                  data-testid="button-export-comparison"
                >
                  <FileDown size={15} />
                  {exporting ? 'Generando PDF...' : 'Exportar comparativa PDF'}
                </Button>
              </div>

              <SummaryCards bestOption={bestOption} worstOption={worstOption} />
              <ComparisonChart results={results} method={method} />
              <ResultsTable
                results={results}
                loanType={loanType}
                method={method}
                principal={amount}
                months={months}
                onViewDetail={(bank) => setDetailBank(bank)}
              />
            </motion.section>
          )}
        </AnimatePresence>

        <footer className="text-center text-xs text-slate-400 mt-6 space-y-1">
          <p>Las tasas son referenciales y pueden variar. Actualizadas mayo 2025.</p>
          {loanType === 'hipotecario' && (
            <p className="text-slate-500 font-medium">Los créditos hipotecarios ajustan su capital mensualmente por UVA. La cuota mostrada es la inicial.</p>
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
            loanType={loanType}
            onClose={() => setDetailBank(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
