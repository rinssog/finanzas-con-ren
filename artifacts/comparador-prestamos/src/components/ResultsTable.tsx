import React from 'react';
import { CalculatedResult } from '@/pages/Comparador';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface ResultsTableProps {
  results: CalculatedResult[];
  loanType: string;
}

export function ResultsTable({ results, loanType }: ResultsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-primary">Ranking de Bancos</h2>
        <p className="text-slate-500 text-sm mt-1">Ordenados por Costo Financiero Total (CFT), la métrica más importante.</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b-slate-200">
              <TableHead className="w-16 text-center font-semibold text-slate-600">Rank</TableHead>
              <TableHead className="font-semibold text-slate-600">Banco</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">TNA</TableHead>
              <TableHead className="text-right font-bold text-primary">CFT</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Cuota Inicial</TableHead>
              <TableHead className="text-right font-semibold text-slate-600 hidden md:table-cell">Total a Pagar</TableHead>
              <TableHead className="text-center font-semibold text-slate-600"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <motion.tr 
                key={result.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`group ${index === 0 ? 'bg-accent/5 hover:bg-accent/10' : 'hover:bg-slate-50'}`}
              >
                <TableCell className="text-center font-bold text-slate-400">
                  #{result.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs border border-primary/10">
                      {result.logo}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {result.name}
                        {index === 0 && <Badge className="bg-accent text-primary font-bold hover:bg-accent border-none shadow-sm hidden sm:inline-flex">Mejor oferta</Badge>}
                      </div>
                      {result.uva && <div className="text-xs text-slate-500 font-medium">Ajustable por UVA</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-slate-600">
                  {formatPercentage(result.tna)}
                </TableCell>
                <TableCell className="text-right font-bold text-primary bg-primary/5 rounded-md my-1 inline-block float-right px-3 py-1">
                  {formatPercentage(result.cft)}
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900 text-lg">
                  {formatCurrency(result.monthlyPayment)}
                </TableCell>
                <TableCell className="text-right text-slate-500 font-medium hidden md:table-cell">
                  {formatCurrency(result.totalPayment)}
                </TableCell>
                <TableCell className="text-right pr-4">
                  <Button variant={index === 0 ? "default" : "outline"} className={`font-semibold ${index === 0 ? 'bg-primary text-white shadow-md' : 'text-primary border-slate-300'}`}>
                    Solicitar
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
