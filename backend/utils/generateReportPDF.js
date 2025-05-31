// utils/generateReportPDF.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReportPDF = (userName, reportType, startDate, endDate, expenses, totalAmount, totalCount, averageAmount) => {
  const doc = new jsPDF();

  // Title
  const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report for ${userName}`;
  doc.setFontSize(20).text(title, 105, 15, { align: 'center' });

  // Date range
  doc.setFontSize(12);
  doc.text(
    `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
    105,
    25,
    { align: 'center' }
  );

  // Summary
  doc.setFontSize(14).text('Summary', 14, 40);
  doc.setFontSize(10)
     .text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, 50)
     .text(`Total Items: ${totalCount}`, 14, 55)
     .text(`Average Amount: $${averageAmount.toFixed(2)}`, 14, 60);

  // Table
  doc.setFontSize(14).text('Details', 14, 75);
  const tableColumns = ['Name','Amount','Description','Category','Vendor','Date'];
  const tableRows = expenses.map(e => [
    e.name,
    `$${e.amount.toFixed(2)}`,
    e.description,
    e.category,
    e.vendor,
    new Date(e.date).toLocaleDateString(),
  ]);

  autoTable(doc, {
    startY: 80,
    head: [tableColumns],
    body: tableRows,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37,99,235] }
  });

  return doc;
};
