/**
 * ProductLens AI — E-Commerce Title Standardization Engine
 * Generates clean, structured product titles following Unilog e-commerce best practices.
 * Also generates commerce-ready short and long descriptions.
 */

/**
 * Generate a standardized e-commerce product title.
 * Format: Brand [MPN] ProductType, KeySpec1, KeySpec2, Material, Size
 * @param {Object} params
 * @returns {string} Standardized title
 */
export function generateStandardTitle({ brand, mpn, productType, specs, rawInput }) {
  const parts = [];

  // 1. Brand Name
  if (brand && brand !== 'Industrial Supply' && brand !== 'Custom Feed') {
    parts.push(brand);
  }

  // 2. MPN in brackets
  if (mpn && mpn !== 'N/A' && mpn !== 'UNKNOWN') {
    parts.push(`[${mpn}]`);
  }

  // 3. Product Type (from taxonomy)
  if (productType) {
    parts.push(productType);
  }

  // 4. Key Specifications — pick the most important ones
  const keySpecs = [];
  const specOrder = [
    'Material', 'Voltage', 'Horsepower', 'Pressure Rating', 'Amperage',
    'Port Size', 'Flow Rate', 'Bore Diameter', 'Speed (RPM)',
    'Electrical Phases', 'Poles', 'Enclosure Rating'
  ];

  for (const key of specOrder) {
    if (specs[key]) {
      keySpecs.push(specs[key]);
      if (keySpecs.length >= 4) break;
    }
  }

  if (keySpecs.length > 0) {
    parts.push(keySpecs.join(', '));
  }

  let title = parts.join(' ').replace(/\s+/g, ' ').trim();

  // Ensure minimum length — pad with raw input info if too short
  if (title.length < 30 && rawInput) {
    const cleaned = rawInput
      .replace(/\bmodel\b.*/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length > title.length) {
      title = `${brand || ''} ${mpn ? `[${mpn}]` : ''} ${cleaned}`.replace(/\s+/g, ' ').trim();
    }
  }

  return title;
}

/**
 * Generate a commerce-ready short description.
 * Concise, keyword-rich, 150-250 characters ideal.
 */
export function generateShortDescription({ brand, mpn, productType, specs, taxon }) {
  const material = specs.Material || 'Industrial-grade';
  const category = taxon?.category?.split('>').pop()?.trim() || productType || 'component';

  const highlights = [];
  if (specs['Voltage']) highlights.push(specs['Voltage']);
  if (specs['Horsepower']) highlights.push(specs['Horsepower']);
  if (specs['Pressure Rating']) highlights.push(specs['Pressure Rating']);
  if (specs['Flow Rate']) highlights.push(specs['Flow Rate']);
  if (specs['Amperage']) highlights.push(specs['Amperage']);

  const highlightStr = highlights.length > 0 ? ` Rated at ${highlights.join(', ')}.` : '';

  return `${material} ${category.toLowerCase()} by ${brand || 'manufacturer'}. MPN: ${mpn || 'N/A'}.${highlightStr} Designed for heavy-duty industrial and commercial applications. UNSPSC: ${taxon?.code || 'N/A'}.`;
}

/**
 * Generate a rich HTML long description with structured specifications.
 */
export function generateLongDescription({ brand, mpn, productType, specs, taxon, conversions, synonymsResolved }) {
  const specRows = Object.entries(specs)
    .map(([k, v]) => `<tr><td style="padding:4px 8px;font-weight:600;color:#64748b;border-bottom:1px solid #1e293b">${k}</td><td style="padding:4px 8px;color:#e2e8f0;border-bottom:1px solid #1e293b">${v}</td></tr>`)
    .join('');

  const conversionRows = (conversions || [])
    .map(c => `<tr><td style="padding:4px 8px;color:#fbbf24;border-bottom:1px solid #1e293b">${c.field}</td><td style="padding:4px 8px;border-bottom:1px solid #1e293b"><span style="color:#fbbf24">${c.imperial}</span> → <span style="color:#22d3ee">${c.metric}</span></td></tr>`)
    .join('');

  const synonymRows = (synonymsResolved || [])
    .map(s => `<li><strong>${s.original.toUpperCase()}</strong>: ${s.resolved} <em style="color:#64748b">(${s.category})</em></li>`)
    .join('');

  return `<div class="productlens-catalog-spec" style="font-family:Inter,system-ui,sans-serif;max-width:800px">
  <h2 style="font-size:16px;font-weight:700;margin-bottom:8px">${productType || 'Industrial Product'} — ${brand || 'Manufacturer'} ${mpn ? `[${mpn}]` : ''}</h2>
  
  <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin-bottom:16px">
    This ${(productType || 'component').toLowerCase()} manufactured by <strong>${brand || 'the supplier'}</strong> 
    is engineered for demanding industrial environments. Constructed from ${specs.Material || 'durable industrial materials'}, 
    it delivers reliable performance across a wide range of operating conditions.
  </p>

  <h3 style="font-size:14px;font-weight:700;margin:16px 0 8px;color:#e2e8f0">Technical Specifications</h3>
  <table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead><tr><th style="text-align:left;padding:6px 8px;color:#64748b;border-bottom:2px solid #334155;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Parameter</th><th style="text-align:left;padding:6px 8px;color:#64748b;border-bottom:2px solid #334155;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Value</th></tr></thead>
    <tbody>
      <tr><td style="padding:4px 8px;font-weight:600;color:#64748b;border-bottom:1px solid #1e293b">UNSPSC Code</td><td style="padding:4px 8px;color:#a78bfa;font-family:monospace;border-bottom:1px solid #1e293b">${taxon?.code || 'N/A'} (${taxon?.title || 'General'})</td></tr>
      <tr><td style="padding:4px 8px;font-weight:600;color:#64748b;border-bottom:1px solid #1e293b">Category Path</td><td style="padding:4px 8px;color:#e2e8f0;border-bottom:1px solid #1e293b">${taxon?.category || 'N/A'}</td></tr>
      <tr><td style="padding:4px 8px;font-weight:600;color:#64748b;border-bottom:1px solid #1e293b">Manufacturer</td><td style="padding:4px 8px;color:#e2e8f0;border-bottom:1px solid #1e293b">${brand || 'N/A'}</td></tr>
      <tr><td style="padding:4px 8px;font-weight:600;color:#64748b;border-bottom:1px solid #1e293b">Part Number (MPN)</td><td style="padding:4px 8px;color:#e2e8f0;font-family:monospace;border-bottom:1px solid #1e293b">${mpn || 'N/A'}</td></tr>
      ${specRows}
    </tbody>
  </table>

  ${conversionRows ? `
  <h3 style="font-size:14px;font-weight:700;margin:16px 0 8px;color:#e2e8f0">Unit Conversions (Imperial → Metric SI)</h3>
  <table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead><tr><th style="text-align:left;padding:6px 8px;color:#64748b;border-bottom:2px solid #334155;font-size:11px;text-transform:uppercase">Parameter</th><th style="text-align:left;padding:6px 8px;color:#64748b;border-bottom:2px solid #334155;font-size:11px;text-transform:uppercase">Conversion</th></tr></thead>
    <tbody>${conversionRows}</tbody>
  </table>` : ''}

  ${synonymRows ? `
  <h3 style="font-size:14px;font-weight:700;margin:16px 0 8px;color:#e2e8f0">Resolved Industry Abbreviations</h3>
  <ul style="list-style:none;padding:0;font-size:12px;color:#cbd5e1">${synonymRows}</ul>` : ''}

  <p style="font-size:10px;color:#475569;margin-top:16px;font-family:monospace">
    Enriched by ProductLens AI v2.0 | UNSPSC v25.0 Taxonomy | XAI Audit-Traced
  </p>
</div>`;
}
