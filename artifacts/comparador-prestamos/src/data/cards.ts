export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'cabal' | 'naranja';

export interface CardRate {
  bank: string;
  logo: string;
  tna: number;
  cft: number;
  minPaymentPct: number; // % del saldo como pago mínimo
  brand: CardBrand;
  highlight?: string;
}

// Tasas de financiación actualizadas — mayo 2026
// Fuente: BCRA, Santander (TNA 81.80% vigente 4/5 al 8/6/2026), sitios oficiales de cada banco
export const visaCards: CardRate[] = [
  { bank: 'Santander',        logo: 'SAN', tna: 82,  cft: 108, minPaymentPct: 5, brand: 'visa' },   // TNA 81.80% oficial mayo 2026
  { bank: 'Banco Nación',     logo: 'BNA', tna: 85,  cft: 103, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Provincia',  logo: 'BPC', tna: 88,  cft: 113, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Ciudad',     logo: 'BCO', tna: 90,  cft: 115, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Mercado Pago',     logo: 'MPC', tna: 92,  cft: 120, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Patagonia',  logo: 'PAT', tna: 92,  cft: 118, minPaymentPct: 5, brand: 'visa' },
  { bank: 'ICBC',             logo: 'ICB', tna: 92,  cft: 120, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Macro',      logo: 'MAC', tna: 95,  cft: 125, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Galicia',    logo: 'GAL', tna: 95,  cft: 125, minPaymentPct: 5, brand: 'visa' },
  { bank: 'Banco Supervielle',logo: 'SUP', tna: 99,  cft: 135, minPaymentPct: 5, brand: 'visa' },
  { bank: 'HSBC',             logo: 'HSB', tna: 100, cft: 135, minPaymentPct: 5, brand: 'visa', highlight: 'Alta tasa' },
  { bank: 'BBVA',             logo: 'BBV', tna: 105, cft: 140, minPaymentPct: 5, brand: 'visa', highlight: 'Alta tasa' },
  { bank: 'Naranja X',        logo: 'NAR', tna: 110, cft: 148, minPaymentPct: 5, brand: 'visa', highlight: 'Alta tasa' },
];

export const mastercardCards: CardRate[] = [
  { bank: 'Santander',       logo: 'SAN', tna: 82,  cft: 108, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Nación',    logo: 'BNA', tna: 85,  cft: 103, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Provincia', logo: 'BPC', tna: 88,  cft: 113, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Ciudad',    logo: 'BCO', tna: 90,  cft: 115, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Macro',     logo: 'MAC', tna: 95,  cft: 125, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'Banco Galicia',   logo: 'GAL', tna: 95,  cft: 125, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'ICBC',            logo: 'ICB', tna: 92,  cft: 120, minPaymentPct: 5, brand: 'mastercard' },
  { bank: 'HSBC',            logo: 'HSB', tna: 100, cft: 135, minPaymentPct: 5, brand: 'mastercard', highlight: 'Alta tasa' },
  { bank: 'BBVA',            logo: 'BBV', tna: 105, cft: 140, minPaymentPct: 5, brand: 'mastercard', highlight: 'Alta tasa' },
  { bank: 'Ualá',            logo: 'UAL', tna: 110, cft: 148, minPaymentPct: 5, brand: 'mastercard', highlight: 'Alta tasa' },
];

export const amexCards: CardRate[] = [
  { bank: 'American Express',       logo: 'AEX', tna: 90,  cft: 120, minPaymentPct: 5, brand: 'amex' },
  { bank: 'Banco Galicia Amex',     logo: 'GAL', tna: 95,  cft: 125, minPaymentPct: 5, brand: 'amex' },
  { bank: 'Banco Supervielle Amex', logo: 'SUP', tna: 99,  cft: 132, minPaymentPct: 5, brand: 'amex' },
  { bank: 'HSBC Amex',              logo: 'HSB', tna: 105, cft: 140, minPaymentPct: 5, brand: 'amex', highlight: 'Alta tasa' },
];

export const cabalCards: CardRate[] = [
  { bank: 'Banco Nación Cabal',    logo: 'BNA', tna: 85,  cft: 103, minPaymentPct: 5, brand: 'cabal' },
  { bank: 'Cabal (Red Link)',       logo: 'CAB', tna: 88,  cft: 114, minPaymentPct: 5, brand: 'cabal' },
  { bank: 'Banco Credicoop Cabal', logo: 'CRE', tna: 90,  cft: 118, minPaymentPct: 5, brand: 'cabal' },
  { bank: 'Banco Comafi Cabal',    logo: 'COM', tna: 95,  cft: 125, minPaymentPct: 5, brand: 'cabal' },
  { bank: 'Tarjeta Shopping',      logo: 'SHO', tna: 110, cft: 148, minPaymentPct: 5, brand: 'cabal', highlight: 'Alta tasa' },
];

export const naranjaCards: CardRate[] = [
  { bank: 'Personal Pay',       logo: 'PPA', tna: 100, cft: 135, minPaymentPct: 5, brand: 'naranja' },
  { bank: 'Naranja (clásica)',  logo: 'NRJ', tna: 105, cft: 140, minPaymentPct: 5, brand: 'naranja', highlight: 'Alta tasa' },
  { bank: 'Naranja X',          logo: 'NAR', tna: 110, cft: 148, minPaymentPct: 5, brand: 'naranja', highlight: 'Alta tasa' },
  { bank: 'Ualá',               logo: 'UAL', tna: 110, cft: 148, minPaymentPct: 5, brand: 'naranja', highlight: 'Alta tasa' },
];

export const BRAND_INFO: Record<CardBrand, { label: string; color: string; bg: string; border: string }> = {
  visa:       { label: 'Visa',              color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
  mastercard: { label: 'Mastercard',         color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200' },
  amex:       { label: 'American Express',   color: 'text-slate-700',   bg: 'bg-slate-100',  border: 'border-slate-300' },
  cabal:      { label: 'Cabal / Shopping',   color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  naranja:    { label: 'Naranja / Fintechs', color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200' },
};
