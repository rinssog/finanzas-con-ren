export interface Debt {
  id: string;
  name: string;
  balance: number;
  tna: number;
  minPayment: number;
}

export interface DebtPayoffRow {
  month: number;
  payments: Record<string, number>;
  balances: Record<string, number>;
  totalBalance: number;
  totalInterestPaid: number;
}

export interface StrategyResult {
  schedule: DebtPayoffRow[];
  totalPaid: number;
  totalInterest: number;
  months: number;
  payoffOrder: string[];
}

function monthlyRate(tna: number) {
  return tna / 12 / 100;
}

function runStrategy(
  debts: Debt[],
  extraMonthly: number,
  order: 'snowball' | 'avalanche' | 'minimum'
): StrategyResult {
  // Sort debts by strategy
  const sorted = [...debts].sort((a, b) => {
    if (order === 'snowball') return a.balance - b.balance;
    if (order === 'avalanche') return b.tna - a.tna;
    return 0;
  });

  let balances: Record<string, number> = {};
  debts.forEach(d => { balances[d.id] = d.balance; });

  const schedule: DebtPayoffRow[] = [];
  const payoffOrder: string[] = [];
  let month = 0;
  let totalPaid = 0;
  let totalInterest = 0;

  while (Object.values(balances).some(b => b > 0.01) && month < 600) {
    month++;
    const payments: Record<string, number> = {};

    // Accrue interest on all debts
    const interest: Record<string, number> = {};
    debts.forEach(d => {
      if (balances[d.id] > 0) {
        interest[d.id] = balances[d.id] * monthlyRate(d.tna);
        balances[d.id] += interest[d.id];
        totalInterest += interest[d.id];
      }
    });

    // Pay minimums on all
    let extra = extraMonthly;
    debts.forEach(d => {
      if (balances[d.id] > 0) {
        const min = Math.min(balances[d.id], Math.max(d.minPayment, balances[d.id] * 0.05));
        payments[d.id] = min;
        balances[d.id] -= min;
        balances[d.id] = Math.max(0, balances[d.id]);
        totalPaid += min;
      } else {
        payments[d.id] = 0;
      }
    });

    // Apply extra to priority debt (minimum payments only if order === 'minimum')
    if (order !== 'minimum' && extra > 0) {
      for (const d of sorted) {
        if (balances[d.id] > 0.01) {
          const apply = Math.min(extra, balances[d.id]);
          payments[d.id] = (payments[d.id] || 0) + apply;
          balances[d.id] -= apply;
          balances[d.id] = Math.max(0, balances[d.id]);
          totalPaid += apply;
          extra -= apply;
          if (extra <= 0) break;
        }
      }
    }

    // Check payoffs this month
    debts.forEach(d => {
      if (balances[d.id] <= 0.01 && !payoffOrder.includes(d.id)) {
        payoffOrder.push(d.id);
        balances[d.id] = 0;
      }
    });

    const totalBalance = Object.values(balances).reduce((s, v) => s + v, 0);

    schedule.push({
      month,
      payments: { ...payments },
      balances: { ...balances },
      totalBalance,
      totalInterestPaid: totalInterest,
    });

    if (totalBalance <= 0.01) break;
  }

  return { schedule, totalPaid, totalInterest, months: month, payoffOrder };
}

export function simulateSnowball(debts: Debt[], extra: number): StrategyResult {
  return runStrategy(debts, extra, 'snowball');
}

export function simulateAvalanche(debts: Debt[], extra: number): StrategyResult {
  return runStrategy(debts, extra, 'avalanche');
}

export function simulateMinimumOnly(debts: Debt[]): StrategyResult {
  return runStrategy(debts, 0, 'minimum');
}
