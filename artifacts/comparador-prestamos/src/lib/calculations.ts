export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (rate: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(rate / 100);
};

export type AmortizationMethod = 'frances' | 'aleman' | 'americano';

export interface AmortizationRow {
  period: number;
  payment: number;
  interest: number;
  amortization: number;
  balance: number;
}

export interface PrepaymentResult {
  schedule: AmortizationRow[];
  totalPaid: number;
  totalInterest: number;
  monthsSaved: number;
  interestSaved: number;
  finalPeriod: number;
}

// Sistema Francés: cuota fija, interés decreciente, amortización creciente
function buildFrench(principal: number, monthlyRate: number, months: number): AmortizationRow[] {
  if (monthlyRate === 0) {
    const payment = principal / months;
    return Array.from({ length: months }, (_, i) => ({
      period: i + 1,
      payment,
      interest: 0,
      amortization: payment,
      balance: principal - payment * (i + 1)
    }));
  }
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const rows: AmortizationRow[] = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const amortization = payment - interest;
    balance = Math.max(0, balance - amortization);
    rows.push({ period: i, payment, interest, amortization, balance });
  }
  return rows;
}

// Sistema Alemán: amortización fija, cuota decreciente
function buildGerman(principal: number, monthlyRate: number, months: number): AmortizationRow[] {
  const amortization = principal / months;
  const rows: AmortizationRow[] = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const payment = amortization + interest;
    balance = Math.max(0, balance - amortization);
    rows.push({ period: i, payment, interest, amortization, balance });
  }
  return rows;
}

// Sistema Americano (bullet): solo intereses, capital al final
function buildAmerican(principal: number, monthlyRate: number, months: number): AmortizationRow[] {
  const rows: AmortizationRow[] = [];
  for (let i = 1; i <= months; i++) {
    const interest = principal * monthlyRate;
    const isLast = i === months;
    const amortization = isLast ? principal : 0;
    const payment = interest + amortization;
    const balance = isLast ? 0 : principal;
    rows.push({ period: i, payment, interest, amortization, balance });
  }
  return rows;
}

export function buildAmortizationSchedule(
  principal: number,
  tna: number,
  months: number,
  method: AmortizationMethod
): AmortizationRow[] {
  const monthlyRate = tna / 12 / 100;
  switch (method) {
    case 'frances': return buildFrench(principal, monthlyRate, months);
    case 'aleman': return buildGerman(principal, monthlyRate, months);
    case 'americano': return buildAmerican(principal, monthlyRate, months);
  }
}

// Obtiene la cuota del primer periodo (para comparación de bancos)
export function getFirstPayment(schedule: AmortizationRow[]): number {
  return schedule[0]?.payment ?? 0;
}

// Obtiene la cuota promedio (útil para alemán donde varía)
export function getAveragePayment(schedule: AmortizationRow[]): number {
  if (schedule.length === 0) return 0;
  return schedule.reduce((sum, r) => sum + r.payment, 0) / schedule.length;
}

// Simula prepago: cuota extra mensual fija + opción de pago único
export function simulatePrepayment(
  principal: number,
  tna: number,
  months: number,
  method: AmortizationMethod,
  extraMonthly: number,
  lumpSumPeriod: number,
  lumpSumAmount: number
): PrepaymentResult {
  const monthlyRate = tna / 12 / 100;
  const originalSchedule = buildAmortizationSchedule(principal, tna, months, method);
  const originalTotal = originalSchedule.reduce((s, r) => s + r.payment, 0);
  const originalInterest = originalSchedule.reduce((s, r) => s + r.interest, 0);

  // Simular con prepagos usando método francés (el más común para prepago)
  // Para el método elegido, recalculamos dinámicamente aplicando abonos extra
  const rows: AmortizationRow[] = [];
  let balance = principal;
  let period = 0;

  // Cuota base del método original (para francés es fija; para otros usamos la del schedule)
  const basePayment = method === 'frances'
    ? (originalSchedule[0]?.payment ?? 0)
    : 0;

  while (balance > 0.01 && period < months * 2) {
    period++;
    const interest = balance * monthlyRate;

    let amortization: number;
    let payment: number;

    if (method === 'frances') {
      amortization = Math.min(basePayment - interest + extraMonthly, balance);
      payment = interest + amortization;
    } else if (method === 'aleman') {
      const fixedAmort = principal / months;
      amortization = Math.min(fixedAmort + extraMonthly, balance);
      payment = interest + amortization;
    } else {
      // Americano: si hay prepago, se aplica al capital; si es la última cuota real, paga todo
      const extra = extraMonthly;
      amortization = Math.min(extra, balance);
      payment = interest + amortization;
      if (period === months) {
        amortization = balance;
        payment = interest + balance;
      }
    }

    // Aplicar pago único en el periodo indicado
    if (period === lumpSumPeriod && lumpSumAmount > 0) {
      amortization = Math.min(amortization + lumpSumAmount, balance);
      payment = interest + amortization;
    }

    balance = Math.max(0, balance - amortization);
    rows.push({ period, payment, interest, amortization, balance });

    if (balance <= 0.01) break;
  }

  const totalPaid = rows.reduce((s, r) => s + r.payment, 0);
  const totalInterest = rows.reduce((s, r) => s + r.interest, 0);
  const monthsSaved = months - rows.length;
  const interestSaved = originalInterest - totalInterest;

  return {
    schedule: rows,
    totalPaid,
    totalInterest,
    monthsSaved: Math.max(0, monthsSaved),
    interestSaved: Math.max(0, interestSaved),
    finalPeriod: rows.length
  };
}

// PMT simple para comparación rápida entre bancos
export function calculatePMT(principal: number, tna: number, months: number): number {
  if (months === 0) return 0;
  if (tna === 0) return principal / months;
  const monthlyRate = (tna / 12) / 100;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}
