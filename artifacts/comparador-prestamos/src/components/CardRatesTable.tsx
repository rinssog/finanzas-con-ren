import { useState } from 'react';
import { motion } from 'framer-motion';
import { visaCards, mastercardCards, amexCards, CardBrand, BRAND_INFO } from '@/data/cards';
import { formatPercentage } from '@/lib/calculations';
import { Badge } from '@/components/ui/badge';
import { Trophy, AlertTriangle } from 'lucide-react';

const ALL_BRANDS: CardBrand[] = ['visa', 'mastercard', 'amex'];

const DATA: Record<CardBrand, typeof visaCards> = {
  visa: visaCards,
  mastercard: mastercardCards,
  amex: amexCards,
};

export function CardRatesTable() {
  const [activeBrand, setActiveBrand] = useState<CardBrand>('visa');
  const cards = [...DATA[activeBrand]].sort((a, b) => a.cft - b.cft);
  const info = BRAND_INFO[activeBrand];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Trophy size={18} className="text-accent" />
          Tasas de financiación por tarjeta
        </h2>
        <p className="text-xs text-slate-500 mt-1">Ordenadas por CFT (costo real) — menor es mejor</p>
      </div>

      {/* Brand tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        {ALL_BRANDS.map(brand => {
          const bi = BRAND_INFO[brand];
          const isActive = activeBrand === brand;
          return (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              data-testid={`tab-card-${brand}`}
              className={`flex-1 py-3 px-4 text-sm font-bold transition-all border-b-2 ${
                isActive
                  ? `border-accent ${bi.color} bg-white`
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/60'
              }`}
            >
              {bi.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-14">Pos.</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Banco</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">TNA</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-accent uppercase tracking-wider">CFT</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Interés mensual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cards.map((card, i) => {
              const isWinner = i === 0;
              const isDanger = card.tna >= 90;
              const monthlyInterest = card.tna / 12 / 100;

              return (
                <motion.tr
                  key={`${card.bank}-${card.brand}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`transition-colors ${isWinner ? 'bg-accent/5 hover:bg-accent/8' : 'hover:bg-slate-50'}`}
                  data-testid={`row-card-${i}`}
                >
                  <td className="px-4 py-3.5 text-center">
                    {isWinner ? (
                      <div className="w-7 h-7 mx-auto rounded-full bg-accent flex items-center justify-center">
                        <Trophy size={12} className="text-white" />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-slate-300">#{i + 1}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isWinner ? 'bg-accent text-white' : `${info.bg} ${info.color}`
                      }`}>
                        {card.logo}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                          {card.bank}
                          {isWinner && (
                            <Badge className="bg-accent/15 text-accent border border-accent/25 text-xs hidden sm:inline-flex">
                              Menor costo
                            </Badge>
                          )}
                          {isDanger && (
                            <Badge className="bg-rose-50 text-rose-600 border border-rose-200 text-xs gap-0.5">
                              <AlertTriangle size={9} /> Alta tasa
                            </Badge>
                          )}
                        </div>
                        <div className={`text-xs font-semibold mt-0.5 ${info.color}`}>{info.label}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`font-semibold tabular-nums ${isDanger ? 'text-rose-600' : 'text-slate-700'}`}>
                      {formatPercentage(card.tna)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`font-bold px-2.5 py-1 rounded-lg text-sm tabular-nums ${
                      isWinner ? 'bg-accent/15 text-accent' : isDanger ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {formatPercentage(card.cft)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                    <span className="text-sm font-medium text-slate-500 tabular-nums">
                      {(monthlyInterest * 100).toFixed(2)}% mensual
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
        <p className="text-xs text-amber-700 font-medium">
          Si financiás el saldo de tu tarjeta, estas son las tasas que te cobran. Pagar el total antes del vencimiento evita cualquier interés.
        </p>
      </div>
    </div>
  );
}
