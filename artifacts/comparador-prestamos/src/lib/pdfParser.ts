import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface ParsedStatement {
  bankName: string;
  balance: number | null;
  minPayment: number | null;
  tna: number | null;
  dueDate: string | null;
  rawText: string;
  confidence: 'high' | 'medium' | 'low';
}

function parseArsAmount(str: string): number | null {
  // Handle Argentine number format: 1.234.567,89 or 1234567,89 or 1234567.89
  const cleaned = str.replace(/\s/g, '');
  // Check if it has commas and dots - Argentine format
  if (cleaned.includes(',')) {
    // Replace dots (thousands separator) then comma (decimal separator)
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    const val = parseFloat(normalized);
    return isNaN(val) ? null : Math.round(val);
  }
  const val = parseFloat(cleaned.replace(/\./g, ''));
  return isNaN(val) ? null : Math.round(val);
}

function findAmount(text: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m && m[1]) {
      const val = parseArsAmount(m[1]);
      if (val !== null && val > 0) return val;
    }
  }
  return null;
}

function detectBank(text: string, filename: string): string {
  const combined = (text + ' ' + filename).toLowerCase();
  const banks: [string, string[]][] = [
    ['Banco Nación', ['nacion', 'bna', 'banco de la nacion']],
    ['Banco Galicia', ['galicia']],
    ['Santander', ['santander']],
    ['BBVA', ['bbva', 'frances', 'banco francés']],
    ['Banco Macro', ['macro']],
    ['HSBC', ['hsbc']],
    ['Banco Ciudad', ['ciudad']],
    ['Banco Provincia', ['provincia', 'bapro']],
    ['ICBC', ['icbc']],
    ['Naranja X', ['naranja']],
    ['Banco Patagonia', ['patagonia']],
    ['Banco Supervielle', ['supervielle']],
    ['Mercado Pago', ['mercado pago', 'mercadopago']],
    ['Uala', ['ualá', 'uala']],
    ['American Express', ['american express', 'amex']],
  ];
  for (const [name, keywords] of banks) {
    if (keywords.some(kw => combined.includes(kw))) return name;
  }
  return '';
}

export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

export function parseStatement(text: string, filename: string): ParsedStatement {
  const lower = text.toLowerCase();

  const balance = findAmount(lower, [
    /saldo\s+total[\s:$]*([\d.,]+)/i,
    /saldo\s+(?:a\s+pagar|financiado|deudor)[\s:$]*([\d.,]+)/i,
    /total\s+(?:a\s+pagar|del\s+resumen|adeudado)[\s:$]*([\d.,]+)/i,
    /importe\s+total[\s:$]*([\d.,]+)/i,
    /deuda\s+total[\s:$]*([\d.,]+)/i,
    /capital\s+(?:adeudado|pendiente)[\s:$]*([\d.,]+)/i,
  ]);

  const minPayment = findAmount(lower, [
    /pago\s+m[íi]nimo[\s:$]*([\d.,]+)/i,
    /importe\s+m[íi]nimo[\s:$]*([\d.,]+)/i,
    /pago\s+m[íi]n[\s.:$]*([\d.,]+)/i,
    /m[íi]nimo\s+a\s+pagar[\s:$]*([\d.,]+)/i,
    /pago\s+reducido[\s:$]*([\d.,]+)/i,
  ]);

  const tnaMatch = text.match(/tna[\s:]*([0-9]+(?:[.,][0-9]+)?)\s*%/i)
    || text.match(/tasa\s+nominal\s+anual[\s:]*([0-9]+(?:[.,][0-9]+)?)\s*%/i)
    || text.match(/([0-9]+(?:[.,][0-9]+)?)\s*%\s*(?:tna|t\.n\.a)/i);
  const tna = tnaMatch ? parseFloat(tnaMatch[1].replace(',', '.')) : null;

  const dateMatch = text.match(/venc[\w]*[\s.:]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i)
    || text.match(/(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/);
  const dueDate = dateMatch ? dateMatch[1] : null;

  const bankName = detectBank(text, filename);

  const found = [balance, minPayment, tna].filter(v => v !== null).length;
  const confidence: ParsedStatement['confidence'] = found >= 3 ? 'high' : found >= 1 ? 'medium' : 'low';

  return { bankName, balance, minPayment, tna, dueDate, rawText: text, confidence };
}
