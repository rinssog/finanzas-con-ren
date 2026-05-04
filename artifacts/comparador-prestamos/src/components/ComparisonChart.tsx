import React from 'react';
import { CalculatedResult } from '@/pages/Comparador';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/calculations';

interface ComparisonChartProps {
  results: CalculatedResult[];
}

export function ComparisonChart({ results }: ComparisonChartProps) {
  // Take top 7 for readability on smaller screens
  const chartData = results.slice(0, 7).map(r => ({
    name: r.name,
    shortName: r.logo,
    cuota: Math.round(r.monthlyPayment)
  }));

  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-800">Comparativa de Cuotas (Top 7)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="shortName" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-primary text-white p-3 rounded-lg shadow-xl border-none">
                        <p className="font-bold mb-1">{data.name}</p>
                        <p className="text-accent font-bold text-lg">{formatCurrency(data.cuota)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="cuota" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(173 80% 40%)' : 'hsl(222 47% 11% / 0.8)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
