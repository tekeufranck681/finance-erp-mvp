import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (reportData) => {
  if (!reportData) return null;
  
  const doc = new jsPDF();
  const { filters, data, summary } = reportData;
  
  // Add title
  doc.setFontSize(20);
  doc.text(
    `${filters.reportType.charAt(0).toUpperCase() + filters.reportType.slice(1)} Report`,
    105,
    15,
    { align: 'center' }
  );
  
  // Add date range
  doc.setFontSize(12);
  doc.text(
    `Period: ${new Date(filters.startDate).toLocaleDateString()} - ${new Date(
      filters.endDate
    ).toLocaleDateString()}`,
    105,
    25,
    { align: 'center' }
  );
  
  // Add summary
  doc.setFontSize(14);
  doc.text('Summary', 14, 40);
  
  doc.setFontSize(10);
  doc.text(`Total Amount: $${summary.totalAmount.toFixed(2)}`, 14, 50);
  doc.text(`Total Items: ${summary.totalCount}`, 14, 55);
  doc.text(`Average Amount: $${summary.averageAmount.toFixed(2)}`, 14, 60);
  
  // Add table
  doc.setFontSize(14);
  doc.text('Details', 14, 75);
  
  const tableColumn = ['Description', 'Category', 'Date', 'Amount'];
  const tableRows = data.map((item) => [
    item.description,
    item.category,
    new Date(item.date).toLocaleDateString(),
    `$${item.amount.toFixed(2)}`,
  ]);
  
  doc.autoTable({
    startY: 80,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });
  
  return doc;
};

export const downloadPDF = (reportData, fileName) => {
  const doc = generatePDF(reportData);
  if (doc) {
    doc.save(fileName || `report_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  }
  return false;
};