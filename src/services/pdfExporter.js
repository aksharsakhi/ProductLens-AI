import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Enterprise PDF Catalog Exporter
 * Generates branded, professional PDF spec sheets from enriched data.
 */

export function exportToPDF(records, filename = 'ProductLens_Enriched_Catalog.pdf', user = null) {
  const doc = new jsPDF('landscape');
  
  // -- Header Setup --
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 300, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text('ProductLens AI - Enterprise Catalog Spec Sheet', 14, 12);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  const dateStr = new Date().toLocaleString();
  doc.text(`Generated: ${dateStr} | Records: ${records.length} | Exported By: ${user?.name || 'System Analyst'}`, 14, 18);
  
  // -- Quality Summary --
  const valid = records.filter(r => r.Validation_Status === 'VALID').length;
  const warnings = records.filter(r => r.Validation_Status === 'WARNING').length;
  const critical = records.filter(r => r.Validation_Status === 'CRITICAL_ERROR').length;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('Data Quality Assessment', 14, 35);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Commerce Ready: ${valid}`, 14, 42);
  doc.text(`Review Needed: ${warnings}`, 60, 42);
  doc.text(`Critical Errors: ${critical}`, 110, 42);

  // -- Table Data --
  const tableColumn = [
    "SKU ID", 
    "MPN", 
    "Brand", 
    "Product Title", 
    "UNSPSC", 
    "Confidence", 
    "Status"
  ];
  
  const tableRows = records.map(r => [
    r.Product_ID,
    r.MPN || 'N/A',
    r.Brand_Name || 'Generic',
    r.Product_Title || 'N/A',
    r.UNSPSC_Code || 'N/A',
    r.Confidence_Score || 'N/A',
    r.Validation_Status || 'UNKNOWN'
  ]);

  doc.autoTable({
    startY: 50,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    styles: { 
      fontSize: 8,
      cellPadding: 3,
      font: 'helvetica'
    },
    headStyles: { 
      fillColor: [79, 70, 229], // indigo-600
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50
    },
    columnStyles: {
      3: { cellWidth: 100 }, // Make title column wider
      6: { fontStyle: 'bold' } // Status
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 6) {
        if (data.cell.raw === 'VALID') {
          data.cell.styles.textColor = [16, 185, 129]; // emerald
        } else if (data.cell.raw === 'WARNING') {
          data.cell.styles.textColor = [245, 158, 11]; // amber
        } else {
          data.cell.styles.textColor = [244, 63, 94]; // rose
        }
      }
    }
  });

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `ProductLens AI | Page ${i} of ${pageCount}`, 
      doc.internal.pageSize.getWidth() / 2, 
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(filename);
}
