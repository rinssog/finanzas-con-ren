export type CardBrand = 'visa' | 'mastercard' | 'amex';

export interface CardRate {
  bank: string;
  logo: string;
  tna: number;
  cft: number;
  minPaymentPct: number; // % del saldo como pago mínimo
  brand: CardBrand;
  highlight?: string;
}

export const visaCards: CardRate[] = [
  { bank: 'Banco Nación', logo: 'BNA', tna: 62, cft: 88, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Ciudad', logo: 'BCO', tna: 68, cft: 94, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Provincia', logo: 'BPC', tna: 66, cft: 92, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Mercado Pago', logo: 'MPC', tna: 70, cft: 97, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Macro', logo: 'MAC', tna: 74, cft: 101, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Patagonia', logo: 'PAT', tna: 76, cft: 103, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Galicia', logo: 'GAL', tna: 78, cft: 106, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Supervielle', logo: 'SUP', tna: 79, cft: 107, minPaymentPct: 5, brand: 'visa' },
  { bank: 'ICBC', logo: 'ICB', tna: 81, cft: 109, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Santander', logo: 'SAN', tna: 84, cft: 112, minPaymentPct: 5, brand: 'visa' },
  { bank: 'BBVA', logo: 'BBV', tna: 87, cft: 115, minPaymentPct: 5, brand: 'visa' },
  { bank: 'HSBC', logo: 'HSB', tna: 88, cft: 116, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Naranja X', logo: 'NAR', tna: 92, cft: 122, minPaymentPct: 5, brand: 'visa', highlight: 'Alta tasa' },
];

export const mastercardCards: CardRate[] = [
  { bank: 'Banco Nación', logo: 'BNA', tna: 62, cft: 88, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Ciudad', logo: 'BCO', tna: 68, cft: 94, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Provincia', logo: 'BPC', tna: 66, cft: 92, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Macro', logo: 'MAC', tna: 74, cft: 101, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Galicia', logo: 'GAL', tna: 78, cft: 106, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'ICBC', logo: 'ICB', tna: 81, cft: 109, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Santander', logo: 'SAN', tna: 84, cft: 112, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'BBVA', logo: 'BBV', tna: 87, cft: 115, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'HSBC', logo: 'HSB', tna: 88, cft: 116, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Uala', logo: 'UAL', tna: 95, cft: 126, minPaymentPct: 5, brand: 'mastercard', highlight: 'Alta tasa' },
];

export const amexCards: CardRate[] = [
  { bank: 'American Express', logo: 'AEX', tna: 76, cft: 103, minPaymentPct: 5, brand: 'amex' },
  { bank: 'Banco Galicia Amex', logo: 'GAL', tna: 81, cft: 109, minPaymentPct: 5, brand: 'amex' },
  { bank: 'Banco Supervielle Amex', logo: 'SUP', tna: 82, cft: 110, minPaymentPct: 5, brand: 'amex' },
  { bank: 'HSBC Amex', logo: 'HSB', tna: 87, cft: 115, minPaymentPct: 5, brand: 'amex' },
];

export const BRAND_INFO: Record<CardBrand, { label: string; color: string; bg: string; border: string }> = {
  visa: { label: 'Visa', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  mastercard: { label: 'Mastercard', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  amex: { label: 'American Express', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300' },
};
