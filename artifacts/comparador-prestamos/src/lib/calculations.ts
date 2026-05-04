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

export const calculatePMT = (principal: number, tna: number, months: number): number => {
  if (months === 0) return 0;
  if (tna === 0) return principal / months;
  
  const monthlyRate = (tna / 12) / 100;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
};
