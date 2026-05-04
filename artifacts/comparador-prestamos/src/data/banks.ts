export type LoanType = 'personal' | 'hipotecario';

export interface BankRate {
  name: string;
  tna: number;
  cft: number;
  logo: string;
  uva?: boolean;
}

export const personalBanks: BankRate[] = [
  { name: "Banco Nación", tna: 40, cft: 58, logo: "BNA" },
  { name: "Banco Galicia", tna: 59, cft: 78, logo: "GAL" },
  { name: "Santander", tna: 62, cft: 82, logo: "SAN" },
  { name: "BBVA", tna: 64, cft: 85, logo: "BBV" },
  { name: "Banco Macro", tna: 55, cft: 72, logo: "MAC" },
  { name: "ICBC", tna: 60, cft: 79, logo: "ICB" },
  { name: "Brubank", tna: 49, cft: 65, logo: "BRU" },
  { name: "Mercado Crédito", tna: 45, cft: 61, logo: "MPC" },
  { name: "Naranja X", tna: 68, cft: 90, logo: "NAR" },
  { name: "Banco Ciudad", tna: 42, cft: 60, logo: "BCO" },
  { name: "Banco Provincia", tna: 44, cft: 62, logo: "BPC" },
  { name: "HSBC", tna: 66, cft: 87, logo: "HSB" },
  { name: "Banco Supervielle", tna: 63, cft: 83, logo: "SUP" },
  { name: "Banco Patagonia", tna: 58, cft: 77, logo: "PAT" },
];

export const hipotecarioBanks: BankRate[] = [
  { name: "Banco Nación", tna: 3.5, cft: 4.8, logo: "BNA", uva: true },
  { name: "Banco Ciudad", tna: 4.5, cft: 6.2, logo: "BCO", uva: true },
  { name: "Banco Provincia", tna: 4.0, cft: 5.5, logo: "BPC", uva: true },
  { name: "Banco Galicia", tna: 5.0, cft: 6.8, logo: "GAL", uva: true },
  { name: "Santander", tna: 5.5, cft: 7.2, logo: "SAN", uva: true },
  { name: "BBVA", tna: 5.75, cft: 7.5, logo: "BBV", uva: true },
  { name: "Banco Macro", tna: 4.75, cft: 6.4, logo: "MAC", uva: true },
  { name: "ICBC", tna: 5.25, cft: 7.0, logo: "ICB", uva: true },
  { name: "Banco Supervielle", tna: 5.5, cft: 7.3, logo: "SUP", uva: true },
  { name: "Banco Hipotecario", tna: 3.75, cft: 5.2, logo: "HIP", uva: true },
];
