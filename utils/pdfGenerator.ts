
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Quote } from '../types';
import { formatCurrency, formatDate } from './format';

export const generateQuotePDF = async (quote: Quote, shouldSave: boolean = true): Promise<string | void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  // Header Colors
  const primaryColor = [37, 99, 235]; // blue-600
  const secondaryColor = [71, 85, 105]; // slate-600
  const lightSlate = [248, 250, 252];
  
  // App Title & Logo placeholder
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, margin, 12, 12, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('ORÇA ELETRICISTA PRO', 32, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Serviços Elétricos Residenciais e Comerciais', 32, 30);

  // Quote Info (Top Right)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`Orçamento #${quote.id.toUpperCase()}`, pageWidth - margin, 20, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Emissão: ${formatDate(quote.date)}`, pageWidth - margin, 25, { align: 'right' });
  
  if (quote.validUntil) {
    doc.setTextColor(185, 28, 28); // red-700
    doc.text(`Válido até: ${formatDate(quote.validUntil)}`, pageWidth - margin, 30, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    doc.text(`Status: ${quote.status.toUpperCase()}`, pageWidth - margin, 35, { align: 'right' });
  } else {
    doc.text(`Status: ${quote.status.toUpperCase()}`, pageWidth - margin, 30, { align: 'right' });
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 40, pageWidth - margin, 40);

  // Client Info Section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO CLIENTE', margin, 50);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${quote.clientName}`, margin, 58);
  doc.text(`WhatsApp: ${quote.clientPhone || 'Não informado'}`, margin, 64);
  doc.text(`Endereço: ${quote.address || 'Não informado'}`, margin, 70);

  // Services Table
  const servicesData = quote.services.map(s => [
    s.description,
    s.quantity.toString(),
    'un',
    formatCurrency(s.unitPrice),
    formatCurrency(s.quantity * s.unitPrice)
  ]);

  (doc as any).autoTable({
    startY: 80,
    head: [['Descrição do Serviço', 'Qtd', 'Un', 'V. Unitário', 'Total']],
    body: servicesData,
    headStyles: { fillColor: primaryColor, fontSize: 10, halign: 'left' },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' }
    },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: margin, right: margin }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 10;

  // Materials Table (if any)
  if (quote.materials.length > 0) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('MATERIAIS', margin, currentY);
    
    const materialsData = quote.materials.map(m => [
      m.description,
      m.quantity.toString(),
      m.unit || 'un',
      formatCurrency(m.unitPrice),
      formatCurrency(m.quantity * m.unitPrice)
    ]);

    (doc as any).autoTable({
      startY: currentY + 5,
      head: [['Descrição do Material', 'Qtd', 'Un', 'V. Unitário', 'Total']],
      body: materialsData,
      headStyles: { fillColor: [249, 115, 22], fontSize: 10 }, // orange-500
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 15, halign: 'center' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Summary and Totals
  const servicesTotal = quote.services.reduce((acc, s) => acc + (s.quantity * s.unitPrice), 0);
  const materialsTotal = quote.materials.reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0);
  const grandTotal = servicesTotal + materialsTotal + (quote.travelFee || 0) - quote.discount;

  const totalBoxWidth = 75;
  const totalBoxX = pageWidth - margin - totalBoxWidth;
  
  if (currentY > pageHeight - 70) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal Mão de Obra:', totalBoxX, currentY);
  doc.text(formatCurrency(servicesTotal), pageWidth - margin, currentY, { align: 'right' });
  
  currentY += 6;
  doc.text('Subtotal Materiais:', totalBoxX, currentY);
  doc.text(formatCurrency(materialsTotal), pageWidth - margin, currentY, { align: 'right' });

  if (quote.travelFee > 0) {
    currentY += 6;
    doc.text('Taxa de Deslocamento:', totalBoxX, currentY);
    doc.text(formatCurrency(quote.travelFee), pageWidth - margin, currentY, { align: 'right' });
  }

  if (quote.discount > 0) {
    currentY += 6;
    doc.setTextColor(22, 163, 74); // emerald-600
    doc.text('Desconto:', totalBoxX, currentY);
    doc.text(`- ${formatCurrency(quote.discount)}`, pageWidth - margin, currentY, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  }

  currentY += 10;
  doc.setLineWidth(0.5);
  doc.line(totalBoxX, currentY - 5, pageWidth - margin, currentY - 5);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL GERAL:', totalBoxX, currentY);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(formatCurrency(grandTotal), pageWidth - margin, currentY, { align: 'right' });

  // Observations Section
  if (quote.observations) {
    currentY += 20;
    
    // Split text by lines to respect user formatting
    const lines = quote.observations.split('\n');
    let allSplitLines: string[] = [];
    lines.forEach(line => {
      const split = doc.splitTextToSize(line, contentWidth);
      allSplitLines = [...allSplitLines, ...split];
    });

    const obsBoxHeight = (allSplitLines.length * 5) + 15;

    // Check if we need a new page for observations
    if (currentY + obsBoxHeight > pageHeight - 60) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES E CONDIÇÕES:', margin, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85); // slate-700
    
    // Optional: add a light gray box behind observations
    doc.setFillColor(lightSlate[0], lightSlate[1], lightSlate[2]);
    doc.rect(margin, currentY + 4, contentWidth, (allSplitLines.length * 5) + 6, 'F');
    
    doc.text(allSplitLines, margin + 2, currentY + 10);
    currentY += obsBoxHeight;
  }

  // Signatures
  // Ensure we have space for signatures at the bottom
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 40;
  } else {
    currentY = pageHeight - 45;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 5, currentY, 90, currentY);
  doc.line(pageWidth - 90, currentY, pageWidth - margin - 5, currentY);
  
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Assinatura do Profissional', margin + 47.5, currentY + 5, { align: 'center' });
  doc.text('Assinatura do Cliente', pageWidth - 47.5 - margin, currentY + 5, { align: 'center' });

  // Page numbers and footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Página ${i} de ${pageCount} - Gerado por Orça Eletricista Pro`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  if (shouldSave) {
    doc.save(`Orcamento_${quote.clientName.replace(/\s+/g, '_')}_${quote.id.toUpperCase()}.pdf`);
  } else {
    // Return blob URL for preview
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
  }
};
