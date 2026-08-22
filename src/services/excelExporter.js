import * as XLSX from 'xlsx';

/**
 * Static headers strictly matching Hack2skill & Unilog expected output format
 */
export const EXPECTED_STATIC_HEADERS = [
  'Product_ID',
  'MPN',
  'Brand_Name',
  'Product_Title',
  'Short_Description',
  'Long_Description',
  'Category_Path',
  'UNSPSC_Code',
  'Primary_Specifications',
  'Enriched_Attributes',
  'Validation_Status',
  'Validation_Flags',
  'Confidence_Score',
  'AI_Reasoning_Audit',
  'Source_Reference'
];

/**
 * Converts catalog records into clean objects matching exact static headers
 */
export function formatRecordsForExport(records) {
  return records.map(rec => ({
    'Product_ID': rec.Product_ID || '',
    'MPN': rec.MPN || '',
    'Brand_Name': rec.Brand_Name || '',
    'Product_Title': rec.Product_Title || '',
    'Short_Description': rec.Short_Description || '',
    'Long_Description': rec.Long_Description || '',
    'Category_Path': rec.Category_Path || '',
    'UNSPSC_Code': rec.UNSPSC_Code || '',
    'Primary_Specifications': rec.Primary_Specifications || '',
    'Enriched_Attributes': rec.Enriched_Attributes || '',
    'Validation_Status': rec.Validation_Status || '',
    'Validation_Flags': rec.Validation_Flags || '',
    'Confidence_Score': rec.Confidence_Score || '',
    'AI_Reasoning_Audit': rec.AI_Reasoning_Audit || '',
    'Source_Reference': rec.Source_Reference || ''
  }));
}

/**
 * Downloads enriched data as an Excel (.xlsx) file
 */
export function exportToExcel(records, filename = 'ProductLens_AI_Enriched_Catalog.xlsx') {
  const formattedData = formatRecordsForExport(records);
  const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: EXPECTED_STATIC_HEADERS });
  
  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 14 }, // Product_ID
    { wch: 16 }, // MPN
    { wch: 18 }, // Brand_Name
    { wch: 45 }, // Product_Title
    { wch: 35 }, // Short_Description
    { wch: 45 }, // Long_Description
    { wch: 35 }, // Category_Path
    { wch: 14 }, // UNSPSC_Code
    { wch: 30 }, // Primary_Specifications
    { wch: 25 }, // Enriched_Attributes
    { wch: 18 }, // Validation_Status
    { wch: 35 }, // Validation_Flags
    { wch: 16 }, // Confidence_Score
    { wch: 50 }, // AI_Reasoning_Audit
    { wch: 30 }  // Source_Reference
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Enriched Product Catalog');
  XLSX.writeFile(workbook, filename);
}

/**
 * Downloads enriched data as a CSV file
 */
export function exportToCSV(records, filename = 'ProductLens_AI_Enriched_Catalog.csv') {
  const formattedData = formatRecordsForExport(records);
  const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: EXPECTED_STATIC_HEADERS });
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
