import { CalculatedResult, DetailBank } from '@/pages/Comparador';
import { formatCurrency, formatPercentage, AmortizationMethod } from '@/lib/calculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ResultsTableProps {
  results: CalculatedResult[];
  loanType: string;
  method: AmortizationMethod;
  onViewDetail: (bank: DetailBank) => void;
}

const METHOD_LABELS: Record<AmortizationMethod, string> = {
  frances: 'Cuota fija',
  aleman: 'Cuota inicial',
  americano: 'Cuota mensual (int.)'
};

export function ResultsTable({ results, loanType, method, onViewDetail }: ResultsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-primary">Ranking de Bancos</h2>
          <div className="text-slate-500 text-sm mt-1">
            Ordenados por CFT · <span className="font-medium text-slate-700">{METHOD_LABELS[method]}</span> mostrada
          </div>
        </div>
        <div className="text-xs text-slate-400 self-end">
          Hacé clic en <span className="font-medium text-slate-600">Ver detalle</span> para tabla de cuotas y simulador de prepago
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b-slate-200">
              <TableHead className="w-16 text-center font-semibold text-slate-600">Rank</TableHead>
              <TableHead className="font-semibold text-slate-600">Banco</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">TNA</TableHead>
              <TableHead className="text-right font-bold text-primary">CFT</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">{METHOD_LABELS[method]}</TableHead>
              <TableHead className="text-right font-semibold text-slate-600 hidden md:table-cell">Total a Pagar</TableHead>
              <TableHead className="text-right font-semibold text-slate-600 hidden lg:table-cell">Intereses</TableHead>
              <TableHead className="text-center font-semibold text-slate-600"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <motion.tr
                key={result.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className={`group ${index === 0 ? 'bg-accent/5 hover:bg-accent/10' : 'hover:bg-slate-50'}`}
                data-testid={`row-bank-${index}`}
              >
                <TableCell className="text-center">
                  <span className={`text-lg font-bold ${index === 0 ? 'text-accent' : 'text-slate-300'}`}>
                    #{result.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${index === 0 ? 'bg-accent/10 text-primary border-accent/20' : 'bg-primary/5 text-primary border-primary/10'}`}>
                      {result.logo}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                        {result.name}
                        {index === 0 && (
                          <Badge className="bg-accent text-primary font-bold hover:bg-accent border-none shadow-sm hidden sm:inline-flex">
                            Mejor oferta
                          </Badge>
                        )}
                      </div>
                      {result.uva && (
                        <div className="text-xs text-slate-500 font-medium">Ajustable por UVA</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-slate-600">
                  {formatPercentage(result.tna)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-bold px-2 py-1 rounded-md text-sm ${index === 0 ? 'bg-accent/15 text-primary' : 'bg-primary/5 text-primary'}`}>
                    {formatPercentage(result.cft)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900 text-lg">
                  {formatCurrency(result.monthlyPayment)}
                  {method === 'aleman' && (
                    <div className="text-xs text-slate-400 font-normal">promedio: {formatCurrency(result.avgMonthlyPayment)}</div>
                  )}
                </TableCell>
                <TableCell className="text-right text-slate-500 font-medium hidden md:table-cell">
                  {formatCurrency(result.totalPayment)}
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  <span className="text-rose-600 font-medium text-sm">{formatCurrency(result.totalInterest)}</span>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary border border-slate-200 hover:bg-slate-50 font-medium text-xs gap-1"
                      onClick={() => onViewDetail({ name: result.name, logo: result.logo, tna: result.tna, cft: result.cft })}
                      data-testid={`button-detail-${index}`}
                    >
                      Ver detalle <ChevronRight size={12} />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
