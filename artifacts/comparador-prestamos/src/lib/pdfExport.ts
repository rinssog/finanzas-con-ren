import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmortizationRow, AmortizationMethod, buildAmortizationSchedule } from './calculations';

const METHOD_LABELS: Record<AmortizationMethod, string> = {
  frances: 'Sistema Francés (Cuota Fija)',
  aleman: 'Sistema Alemán (Amortización Constante)',
  americano: 'Sistema Americano (Bullet)',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

const pct = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'percent', maximumFractionDigits: 2 }).format(n / 100);

// Navy + teal palette matching the app
const NAVY = [15, 23, 42] as [number, number, number];
const TEAL = [13, 148, 136] as [number, number, number];
const SLATE = [100, 116, 139] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];
const LIGHT = [248, 250, 252] as [number, number, number];
const ROSE = [225, 29, 72] as [number, number, number];
const EMERALD = [5, 150, 105] as [number, number, number];

export interface PdfExportOptions {
  bankName: string;
  logo: string;
  tna: number;
  cft: number;
  principal: number;
  months: number;
  method: AmortizationMethod;
  loanType: 'personal' | 'hipotecario';
}

export function exportAmortizationPdf(opts: PdfExportOptions) {
  const { bankName, tna, cft, principal, months, method, loanType } = opts;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  const schedule = buildAmortizationSchedule(principal, tna, months, method);
  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const firstPayment = schedule[0]?.payment ?? 0;
  const lastPayment = schedule[schedule.length - 1]?.payment ?? 0;

  // ── Header gradient block ──────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pw, 42, 'F');

  // Teal accent bar
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, 5, 42, 'F');

  // Logo circle
  doc.setFillColor(255, 255, 255, 20);
  doc.circle(22, 21, 10, 'F');
  doc.setTextColor(...TEAL);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(opts.logo, 22, 22, { align: 'center' });

  // Title
  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ComparaYa', 36, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 210, 230);
  doc.text('Tu asesor financiero de bolsillo', 36, 22);

  // Bank name + method badge
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(bankName, 36, 33);

  doc.setFillColor(...TEAL);
  doc.roundedRect(pw - 75, 10, 65, 8, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(METHOD_LABELS[method], pw - 42, 15, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 210, 230);
  const loanLabel = loanType === 'hipotecario' ? 'Crédito Hipotecario (UVA)' : 'Préstamo Personal';
  doc.text(loanLabel, pw - 42, 25, { align: 'center' });
  doc.text(`TNA ${pct(tna)}  ·  CFT ${pct(cft)}`, pw - 42, 32, { align: 'center' });

  // ── Loan parameters strip ──────────────────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.rect(0, 42, pw, 16, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(0, 58, pw, 58);

  const params = [
    { label: 'Capital solicitado', value: fmt(principal) },
    { label: 'Plazo', value: `${months} meses` },
    { label: 'TNA', value: pct(tna) },
    { label: 'CFT', value: pct(cft) },
  ];
  params.forEach((p, i) => {
    const x = 14 + i * (pw - 28) / 4;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE);
    doc.text(p.label, x, 49);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text(p.value, x, 56);
  });

  // ── Summary cards ──────────────────────────────────────────────────────────
  const cardY = 63;
  const cards = method === 'frances'
    ? [
        { label: 'Cuota fija mensual', value: fmt(firstPayment), color: TEAL },
        { label: 'Total a pagar', value: fmt(totalPayment), color: NAVY },
        { label: 'Intereses totales', value: fmt(totalInterest), color: ROSE },
        { label: 'Capital amortizado', value: fmt(principal), color: EMERALD },
      ]
    : method === 'aleman'
    ? [
        { label: 'Cuota inicial', value: fmt(firstPayment), color: TEAL },
        { label: 'Cuota final', value: fmt(lastPayment), color: NAVY },
        { label: 'Intereses totales', value: fmt(totalInterest), color: ROSE },
        { label: 'Total a pagar', value: fmt(totalPayment), color: EMERALD },
      ]
    : [
        { label: 'Cuota mensual (int.)', value: fmt(firstPayment), color: TEAL },
        { label: 'Cuota final (capital)', value: fmt(lastPayment), color: ROSE },
        { label: 'Intereses totales', value: fmt(totalInterest), color: NAVY },
        { label: 'Total a pagar', value: fmt(totalPayment), color: EMERALD },
      ];

  const cardW = (pw - 28 - 9) / 4;
  cards.forEach((card, i) => {
    const cx = 14 + i * (cardW + 3);
    doc.setFillColor(...LIGHT);
    doc.roundedRect(cx, cardY, cardW, 20, 2, 2, 'F');
    doc.setDrawColor(...card.color);
    doc.setLineWidth(0.8);
    doc.roundedRect(cx, cardY, cardW, 20, 2, 2, 'S');
    doc.setLineWidth(0.2);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE);
    doc.text(card.label, cx + cardW / 2, cardY + 7, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...card.color);
    doc.text(card.value, cx + cardW / 2, cardY + 15, { align: 'center' });
  });

  // ── Method explanation box ─────────────────────────────────────────────────
  const methodDescs: Record<AmortizationMethod, string> = {
    frances: 'Cuota fija durante todo el plazo. Al principio pagás más intereses y menos capital; con el tiempo se invierte. Es el método más común en Argentina.',
    aleman: 'Se amortiza siempre la misma cantidad de capital. La cuota empieza alta y va bajando porque cada mes el interés se calcula sobre un saldo menor.',
    americano: 'Durante todo el plazo se pagan solo intereses sobre el capital original. En la última cuota se paga también todo el capital. Requiere disciplina de ahorro.',
  };
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(14, cardY + 24, pw - 28, 11, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...TEAL);
  doc.text(`${METHOD_LABELS[method]}:`, 18, cardY + 30);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 60, 60);
  const descLines = doc.splitTextToSize(methodDescs[method], pw - 70);
  doc.text(descLines[0] ?? '', 18 + doc.getTextWidth(`${METHOD_LABELS[method]}: `) + 1, cardY + 30);

  // ── Amortization table ─────────────────────────────────────────────────────
  const tableY = cardY + 39;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Tabla de Amortización', 14, tableY);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE);
  doc.text(`${schedule.length} cuotas · Ordenadas por período`, 14, tableY + 5);

  const rows = schedule.map((r: AmortizationRow) => [
    `#${r.period}`,
    fmt(r.payment),
    fmt(r.interest),
    fmt(r.amortization),
    fmt(r.balance),
  ]);

  autoTable(doc, {
    startY: tableY + 9,
    head: [['Cuota', 'Pago Total', 'Interés', 'Capital', 'Saldo']],
    body: rows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 },
      font: 'helvetica',
      textColor: NAVY,
    },
    headStyles: {
      fillColor: NAVY,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: LIGHT,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14, textColor: SLATE, fontStyle: 'bold' },
      1: { halign: 'right', fontStyle: 'bold' },
      2: { halign: 'right', textColor: ROSE },
      3: { halign: 'right', textColor: EMERALD },
      4: { halign: 'right', textColor: SLATE },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === 0) {
        data.cell.styles.fillColor = [240, 253, 250];
        data.cell.styles.fontStyle = 'bold';
      }
      // Last row
      if (data.section === 'body' && data.row.index === rows.length - 1) {
        data.cell.styles.fillColor = [255, 241, 242];
      }
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      const currentPage = data.pageNumber;

      // Footer on each page
      doc.setFillColor(...NAVY);
      doc.rect(0, ph - 12, pw, 12, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...WHITE);
      doc.text('ComparaYa · Tu asesor financiero de bolsillo', 14, ph - 5);
      doc.text(`Página ${currentPage} de ${pageCount}`, pw - 14, ph - 5, { align: 'right' });
      doc.setTextColor(180, 210, 230);
      doc.text('Las tasas son referenciales. Actualizadas mayo 2025.', pw / 2, ph - 5, { align: 'center' });
    },
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `ComparaYa_${bankName.replace(/\s+/g, '_')}_${METHOD_LABELS[method].split(' ')[1].replace(/\(|\)/g, '')}_${dateStr}.pdf`;
  doc.save(fileName);
}

export function exportComparisonPdf(opts: {
  results: Array<{ name: string; logo: string; tna: number; cft: number; monthlyPayment: number; totalPayment: number; totalInterest: number; rank: number }>;
  principal: number;
  months: number;
  method: AmortizationMethod;
  loanType: 'personal' | 'hipotecario';
}) {
  const { results, principal, months, method, loanType } = opts;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  // Header
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pw, 38, 'F');
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, 5, 38, 'F');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('ComparaYa', 14, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 210, 230);
  doc.text('Comparativa de bancos · ' + (loanType === 'hipotecario' ? 'Crédito Hipotecario (UVA)' : 'Préstamo Personal'), 14, 21);

  doc.setFontSize(8);
  doc.setTextColor(200, 220, 240);
  doc.text(`Capital: ${fmt(principal)}  ·  Plazo: ${months} meses  ·  Método: ${METHOD_LABELS[method]}`, 14, 30);

  const dateStr = new Date().toLocaleDateString('es-AR');
  doc.text(`Generado: ${dateStr}`, pw - 14, 30, { align: 'right' });

  // Params strip
  doc.setFillColor(...LIGHT);
  doc.rect(0, 38, pw, 1, 'F');

  // Table
  autoTable(doc, {
    startY: 44,
    head: [['#', 'Banco', 'TNA', 'CFT', 'Cuota Inicial', 'Total a Pagar', 'Intereses']],
    body: results.map(r => [
      `#${r.rank}`,
      r.name,
      pct(r.tna),
      pct(r.cft),
      fmt(r.monthlyPayment),
      fmt(r.totalPayment),
      fmt(r.totalInterest),
    ]),
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3, font: 'helvetica', textColor: NAVY },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: 'bold', fontSize: 8.5 },
    alternateRowStyles: { fillColor: LIGHT },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10, textColor: SLATE, fontStyle: 'bold' },
      1: { fontStyle: 'bold' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold', textColor: TEAL },
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'right', textColor: SLATE },
      6: { halign: 'right', textColor: ROSE },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === 0) {
        data.cell.styles.fillColor = [240, 253, 250];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    didDrawPage: (data) => {
      doc.setFillColor(...NAVY);
      doc.rect(0, ph - 12, pw, 12, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...WHITE);
      doc.text('ComparaYa · Tu asesor financiero de bolsillo', 14, ph - 5);
      doc.text(`Página ${data.pageNumber}`, pw - 14, ph - 5, { align: 'right' });
      doc.setTextColor(180, 210, 230);
      doc.text('Las tasas son referenciales. Actualizadas mayo 2025.', pw / 2, ph - 5, { align: 'center' });
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`ComparaYa_Comparativa_${loanType}_${dateStr.replace(/\//g, '-')}.pdf`);
}
