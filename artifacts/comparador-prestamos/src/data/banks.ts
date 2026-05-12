export type LoanType = 'personal' | 'hipotecario';

export interface BankRate {
  name: string;
  tna: number;
  cft: number;
  logo: string;
  uva?: boolean;
}

// Tasas actualizadas mayo 2026 — fuentes: BNA, Provincia, BBVA, Macro, Santander, BCRA
export const personalBanks: BankRate[] = [
  { name: "Banco Ciudad",     tna: 70,  cft: 96,  logo: "BCO" }, // plan sueldo/jubilados
  { name: "Banco Macro",      tna: 79,  cft: 151, logo: "MAC" }, // plan sueldo
  { name: "Banco Nación",     tna: 85,  cft: 103, logo: "BNA" }, // tasa estándar mayo 2026
  { name: "Banco Galicia",    tna: 85,  cft: 115, logo: "GAL" },
  { name: "Santander",        tna: 85,  cft: 127, logo: "SAN" }, // TNA fija mayo 2026
  { name: "Banco Provincia",  tna: 91,  cft: 140, logo: "BPC" }, // TEA 140.40%
  { name: "ICBC",             tna: 90,  cft: 125, logo: "ICB" },
  { name: "Banco Patagonia",  tna: 88,  cft: 120, logo: "PAT" },
  { name: "HSBC",             tna: 95,  cft: 132, logo: "HSB" },
  { name: "Banco Credicoop",  tna: 88,  cft: 118, logo: "CRE" },
  { name: "Banco Supervielle",tna: 99,  cft: 213, logo: "SUP" }, // CFT con VAT 72 meses
  { name: "Naranja X",        tna: 90,  cft: 130, logo: "NAR" }, // mínimo 59%, referencia 90%
  { name: "Ualá",             tna: 120, cft: 200, logo: "UAL" },
  { name: "BBVA",             tna: 132, cft: 250, logo: "BBV" }, // máximo perfil, mayo 2026
];

// Créditos hipotecarios UVA — tasas fijas + ajuste UVA (inflación). Mayo 2026.
export const hipotecarioBanks: BankRate[] = [
  { name: "Banco Nación",      tna: 4.5,  cft: 6.0,  logo: "BNA", uva: true }, // mejor tasa del mercado
  { name: "Banco Hipotecario", tna: 5.0,  cft: 7.0,  logo: "HIP", uva: true },
  { name: "Banco Provincia",   tna: 5.0,  cft: 7.0,  logo: "BPC", uva: true },
  { name: "Banco Ciudad",      tna: 5.5,  cft: 7.5,  logo: "BCO", uva: true },
  { name: "Banco Galicia",     tna: 6.0,  cft: 8.5,  logo: "GAL", uva: true },
  { name: "Banco Macro",       tna: 7.0,  cft: 9.5,  logo: "MAC", uva: true },
  { name: "ICBC",              tna: 6.5,  cft: 9.0,  logo: "ICB", uva: true },
  { name: "BBVA",              tna: 7.5,  cft: 10.0, logo: "BBV", uva: true }, // tasa vigente mayo 2026
  { name: "Santander",         tna: 8.0,  cft: 11.0, logo: "SAN", uva: true },
  { name: "Banco Supervielle", tna: 9.0,  cft: 12.0, logo: "SUP", uva: true },
];

const LS_PERSONAL = 'rg_rates_personal';
const LS_HIPOTECARIO = 'rg_rates_hipotecario';
const LS_UPDATED_AT = 'rg_rates_updated_at';

export function getDynamicPersonalBanks(): BankRate[] {
  try {
    const raw = localStorage.getItem(LS_PERSONAL);
    if (raw) return JSON.parse(raw) as BankRate[];
  } catch { /* fallback */ }
  return personalBanks;
}

export function getDynamicHipotecarioBanks(): BankRate[] {
  try {
    const raw = localStorage.getItem(LS_HIPOTECARIO);
    if (raw) return JSON.parse(raw) as BankRate[];
  } catch { /* fallback */ }
  return hipotecarioBanks;
}

export function getRatesLastUpdated(): string | null {
  return localStorage.getItem(LS_UPDATED_AT);
}

export function saveRates(personal: BankRate[], hipotecario: BankRate[]): void {
  localStorage.setItem(LS_PERSONAL, JSON.stringify(personal));
  localStorage.setItem(LS_HIPOTECARIO, JSON.stringify(hipotecario));
  localStorage.setItem(LS_UPDATED_AT, new Date().toISOString());
}

export function resetRates(): void {
  localStorage.removeItem(LS_PERSONAL);
  localStorage.removeItem(LS_HIPOTECARIO);
  localStorage.removeItem(LS_UPDATED_AT);
}
