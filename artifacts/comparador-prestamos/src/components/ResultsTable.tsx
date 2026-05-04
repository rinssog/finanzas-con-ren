import { useState } from 'react';
import { CalculatedResult, DetailBank } from '@/pages/Comparador';
import { formatCurrency, formatPercentage, AmortizationMethod } from '@/lib/calculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ChevronRight, Trophy, FileText } from 'lucide-react';
import { exportAmortizationPdf } from '@/lib/pdfExport';

interface ResultsTableProps {
  results: CalculatedResult[];
  loanType: string;
  method: AmortizationMethod;
  principal: number;
  months: number;
  onViewDetail: (bank: DetailBank) => void;
}

const METHOD_LABELS: Record<AmortizationMethod, string> = {
  frances: 'Cuota fija',
  aleman: 'Cuota inicial',
  americano: 'Int. mensual',
};

export function ResultsTable({ results, loanType, method, principal, months, onViewDetail }: ResultsTableProps) {
  const [exportingBank, setExportingBank] = useState<string | null>(null);

  const handleExportBank = (result: CalculatedResult) => {
    setExportingBank(result.name);
    setTimeout(() => {
      exportAmortizationPdf({
        bankName: result.name,
        logo: result.logo,
        tna: result.tna,
        cft: result.cft,
        principal,
        months,
        method,
        loanType: loanType as 'personal' | 'hipotecario',
      });
      setExportingBank(null);
    }, 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
      {/* Table header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy size={18} className="text-accent" />
            Ranking de Bancos
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Ordenados por CFT (costo real) · <span className="font-semibold text-slate-700">{METHOD_LABELS[method]}</span> mostrada
          </p>
        </div>
        <p className="text-xs text-slate-400 self-end hidden sm:block">
          Clic en <span className="font-medium text-slate-600">Ver detalle</span> para tabla completa y simulador de prepago
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
              <TableHead className="w-14 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Pos.</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-wider">Banco</TableHead>
              <TableHead className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider">TNA</TableHead>
              <TableHead className="text-right text-xs font-bold text-accent uppercase tracking-wider">CFT</TableHead>
              <TableHead className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{METHOD_LABELS[method]}</TableHead>
              <TableHead className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Total</TableHead>
              <TableHead className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Intereses</TableHead>
              <TableHead className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => {
              const isWinner = index === 0;
              const interestRatio = result.totalPayment > 0 ? result.totalInterest / result.totalPayment : 0;

              return (
                <motion.tr
                  key={result.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className={`group border-b border-slate-100 last:border-0 transition-colors ${
                    isWinner
                      ? 'bg-gradient-to-r from-accent/5 via-accent/3 to-transparent hover:from-accent/8'
                      : 'hover:bg-slate-50/80'
                  }`}
                  data-testid={`row-bank-${index}`}
                >
                  {/* Rank */}
                  <TableCell className="text-center py-4">
                    {isWinner ? (
                      <div className="w-8 h-8 mx-auto rounded-full bg-accent flex items-center justify-center shadow-md">
                        <Trophy size={14} className="text-white" />
                      </div>
                    ) : (
                      <span className={`text-sm font-bold ${index === 1 ? 'text-slate-600' : index === 2 ? 'text-slate-500' : 'text-slate-300'}`}>
                        #{result.rank}
                      </span>
                    )}
                  </TableCell>

                  {/* Bank */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:scale-105 ${
                        isWinner
                          ? 'bg-accent text-white shadow-md'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {result.logo}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2 flex-wrap">
                          <span className="truncate">{result.name}</span>
                          {isWinner && (
                            <Badge className="bg-accent/15 text-accent font-bold border border-accent/25 text-xs hidden sm:inline-flex shrink-0">
                              Mejor oferta
                            </Badge>
                          )}
                        </div>
                        {result.uva && (
                          <div className="text-xs text-slate-400 font-medium mt-0.5">Ajustable por UVA</div>
                        )}
                        {/* Interest ratio mini bar */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="ratio-bar-bg w-16 h-1.5">
                            <div
                              className="ratio-bar-fill"
                              style={{ width: `${(1 - interestRatio) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{Math.round((1 - interestRatio) * 100)}% cap.</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* TNA */}
                  <TableCell className="text-right py-4">
                    <span className="text-sm font-semibold text-slate-600 tabular-nums">{formatPercentage(result.tna)}</span>
                  </TableCell>

                  {/* CFT */}
                  <TableCell className="text-right py-4">
                    <span className={`inline-flex items-center justify-end font-bold text-sm px-2.5 py-1 rounded-lg tabular-nums ${
                      isWinner ? 'bg-accent/15 text-accent' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {formatPercentage(result.cft)}
                    </span>
                  </TableCell>

                  {/* Monthly payment */}
                  <TableCell className="text-right py-4">
                    <span className={`font-black tabular-nums text-lg ${isWinner ? 'text-accent' : 'text-slate-800'}`}>
                      {formatCurrency(result.monthlyPayment)}
                    </span>
                    {method === 'aleman' && (
                      <div className="text-xs text-slate-400 font-normal tabular-nums">
                        prom. {formatCurrency(result.avgMonthlyPayment)}
                      </div>
                    )}
                  </TableCell>

                  {/* Total */}
                  <TableCell className="text-right py-4 hidden md:table-cell">
                    <span className="text-sm font-semibold text-slate-600 tabular-nums">{formatCurrency(result.totalPayment)}</span>
                  </TableCell>

                  {/* Interest */}
                  <TableCell className="text-right py-4 hidden lg:table-cell">
                    <span className="text-sm font-semibold text-rose-500 tabular-nums">{formatCurrency(result.totalInterest)}</span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center py-4 pr-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold text-slate-600 hover:text-primary hover:bg-slate-100 gap-1 border border-transparent hover:border-slate-200"
                        onClick={() => onViewDetail({ name: result.name, logo: result.logo, tna: result.tna, cft: result.cft })}
                        data-testid={`button-detail-${index}`}
                      >
                        Ver detalle <ChevronRight size={11} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20"
                        onClick={() => handleExportBank(result)}
                        disabled={exportingBank === result.name}
                        title="Exportar PDF"
                        data-testid={`button-export-bank-${index}`}
                      >
                        <FileText size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
