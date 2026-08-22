/**
 * ProductLens AI — Cross-Field Validation & Anomaly Detection Engine
 * Performs multi-dimensional quality checks across extracted fields.
 * Returns weighted confidence score with granular factor breakdown.
 */

/**
 * @typedef {Object} ValidationResult
 * @property {string} status - 'VALID' | 'WARNING' | 'CRITICAL_ERROR'
 * @property {number} score - Composite confidence score (0-100)
 * @property {Array<ValidationFlag>} flags - Individual validation flags
 * @property {Object} factorBreakdown - Score contribution by factor
 */

/**
 * @typedef {Object} ValidationFlag
 * @property {string} severity - 'INFO' | 'WARNING' | 'CRITICAL'
 * @property {string} code - Machine-readable flag code
 * @property {string} message - Human-readable message
 * @property {number} penalty - Score penalty applied
 * @property {string} suggestion - Remediation suggestion
 */

const VALIDATION_WEIGHTS = {
  MPN_PRESENT: { weight: 20, label: 'Manufacturer Part Number' },
  MATERIAL_SPECIFIED: { weight: 12, label: 'Material Identification' },
  TAXONOMY_CLASSIFIED: { weight: 15, label: 'UNSPSC Classification' },
  TITLE_QUALITY: { weight: 10, label: 'Title Standardization' },
  DESCRIPTION_QUALITY: { weight: 8, label: 'Description Completeness' },
  SPECS_EXTRACTED: { weight: 15, label: 'Specification Extraction' },
  UNIT_NORMALIZATION: { weight: 8, label: 'Unit Normalization' },
  BRAND_PRESENT: { weight: 7, label: 'Brand Attribution' },
  SOURCE_TRACED: { weight: 5, label: 'Source Provenance' },
};

/**
 * Run comprehensive validation on an enriched product record.
 * @param {Object} record - The enriched product record
 * @param {Object} options - Validation options
 * @returns {ValidationResult}
 */
export function validateProductRecord(record, options = {}) {
  const flags = [];
  const factorBreakdown = {};
  let totalScore = 0;
  let maxPossible = 0;

  // ── Factor 1: MPN Present ──
  const mpnFactor = VALIDATION_WEIGHTS.MPN_PRESENT;
  maxPossible += mpnFactor.weight;
  if (!record.MPN || record.MPN === 'N/A' || record.MPN === 'UNKNOWN') {
    flags.push({
      severity: 'CRITICAL',
      code: 'MISSING_MPN',
      message: '🚨 Missing Manufacturer Part Number (MPN)',
      penalty: mpnFactor.weight,
      suggestion: 'Add the manufacturer part number from the product label or datasheet.',
    });
    factorBreakdown[mpnFactor.label] = { earned: 0, max: mpnFactor.weight, status: 'FAIL' };
  } else {
    totalScore += mpnFactor.weight;
    factorBreakdown[mpnFactor.label] = { earned: mpnFactor.weight, max: mpnFactor.weight, status: 'PASS' };
    flags.push({
      severity: 'INFO',
      code: 'MPN_VERIFIED',
      message: `✅ MPN verified: ${record.MPN}`,
      penalty: 0,
      suggestion: '',
    });
  }

  // ── Factor 2: Material Specified ──
  const matFactor = VALIDATION_WEIGHTS.MATERIAL_SPECIFIED;
  maxPossible += matFactor.weight;
  const material = record._extractedSpecsObj?.Material || '';
  if (!material || material.includes('Unspecified')) {
    flags.push({
      severity: 'WARNING',
      code: 'MISSING_MATERIAL',
      message: '⚠️ No explicit material callout in raw specification',
      penalty: matFactor.weight,
      suggestion: 'Specify material (e.g., 316SS, Brass, Cast Iron, PVC).',
    });
    factorBreakdown[matFactor.label] = { earned: 0, max: matFactor.weight, status: 'FAIL' };
  } else {
    totalScore += matFactor.weight;
    factorBreakdown[matFactor.label] = { earned: matFactor.weight, max: matFactor.weight, status: 'PASS' };
    flags.push({
      severity: 'INFO',
      code: 'MATERIAL_IDENTIFIED',
      message: `✅ Material identified: ${material}`,
      penalty: 0,
      suggestion: '',
    });
  }

  // ── Factor 3: Taxonomy Classified ──
  const taxFactor = VALIDATION_WEIGHTS.TAXONOMY_CLASSIFIED;
  maxPossible += taxFactor.weight;
  if (!record.UNSPSC_Code || record.UNSPSC_Code === '31160000') {
    const partialScore = Math.round(taxFactor.weight * 0.3);
    totalScore += partialScore;
    flags.push({
      severity: 'WARNING',
      code: 'FALLBACK_TAXONOMY',
      message: '⚠️ UNSPSC classification fell back to general hardware category',
      penalty: taxFactor.weight - partialScore,
      suggestion: 'Review product type keywords to improve taxonomy matching.',
    });
    factorBreakdown[taxFactor.label] = { earned: partialScore, max: taxFactor.weight, status: 'PARTIAL' };
  } else {
    totalScore += taxFactor.weight;
    factorBreakdown[taxFactor.label] = { earned: taxFactor.weight, max: taxFactor.weight, status: 'PASS' };
    flags.push({
      severity: 'INFO',
      code: 'TAXONOMY_MAPPED',
      message: `✅ Classified to UNSPSC ${record.UNSPSC_Code}`,
      penalty: 0,
      suggestion: '',
    });
  }

  // ── Factor 4: Title Quality ──
  const titleFactor = VALIDATION_WEIGHTS.TITLE_QUALITY;
  maxPossible += titleFactor.weight;
  const titleLen = (record.Product_Title || '').length;
  if (titleLen < 20) {
    flags.push({
      severity: 'WARNING',
      code: 'SHORT_TITLE',
      message: '⚠️ Product title is too short for e-commerce standards',
      penalty: titleFactor.weight,
      suggestion: 'Product titles should include brand, MPN, product type, and key specs.',
    });
    factorBreakdown[titleFactor.label] = { earned: 0, max: titleFactor.weight, status: 'FAIL' };
  } else if (titleLen < 50) {
    const partial = Math.round(titleFactor.weight * 0.6);
    totalScore += partial;
    factorBreakdown[titleFactor.label] = { earned: partial, max: titleFactor.weight, status: 'PARTIAL' };
  } else {
    totalScore += titleFactor.weight;
    factorBreakdown[titleFactor.label] = { earned: titleFactor.weight, max: titleFactor.weight, status: 'PASS' };
  }

  // ── Factor 5: Description Quality ──
  const descFactor = VALIDATION_WEIGHTS.DESCRIPTION_QUALITY;
  maxPossible += descFactor.weight;
  const descLen = (record.Short_Description || '').length;
  if (descLen > 30) {
    totalScore += descFactor.weight;
    factorBreakdown[descFactor.label] = { earned: descFactor.weight, max: descFactor.weight, status: 'PASS' };
  } else {
    const partial = Math.round(descFactor.weight * 0.4);
    totalScore += partial;
    factorBreakdown[descFactor.label] = { earned: partial, max: descFactor.weight, status: 'PARTIAL' };
  }

  // ── Factor 6: Specifications Extracted ──
  const specFactor = VALIDATION_WEIGHTS.SPECS_EXTRACTED;
  maxPossible += specFactor.weight;
  const specCount = Object.keys(record._extractedSpecsObj || {}).length;
  if (specCount >= 4) {
    totalScore += specFactor.weight;
    factorBreakdown[specFactor.label] = { earned: specFactor.weight, max: specFactor.weight, status: 'PASS' };
    flags.push({
      severity: 'INFO',
      code: 'SPECS_RICH',
      message: `✅ ${specCount} specifications extracted from raw input`,
      penalty: 0,
      suggestion: '',
    });
  } else if (specCount >= 2) {
    const partial = Math.round(specFactor.weight * 0.6);
    totalScore += partial;
    factorBreakdown[specFactor.label] = { earned: partial, max: specFactor.weight, status: 'PARTIAL' };
    flags.push({
      severity: 'WARNING',
      code: 'SPECS_MINIMAL',
      message: `⚠️ Only ${specCount} specifications extracted (minimum 4 recommended)`,
      penalty: specFactor.weight - partial,
      suggestion: 'Add more technical details to the raw input text.',
    });
  } else {
    flags.push({
      severity: 'CRITICAL',
      code: 'SPECS_INSUFFICIENT',
      message: `🚨 Only ${specCount} specifications could be extracted`,
      penalty: specFactor.weight,
      suggestion: 'Raw input text is too sparse for meaningful extraction.',
    });
    factorBreakdown[specFactor.label] = { earned: 0, max: specFactor.weight, status: 'FAIL' };
  }

  // ── Factor 7: Unit Normalization ──
  const unitFactor = VALIDATION_WEIGHTS.UNIT_NORMALIZATION;
  maxPossible += unitFactor.weight;
  const convCount = (record._conversions || []).length;
  if (convCount > 0) {
    totalScore += unitFactor.weight;
    factorBreakdown[unitFactor.label] = { earned: unitFactor.weight, max: unitFactor.weight, status: 'PASS' };
    flags.push({
      severity: 'INFO',
      code: 'UNITS_NORMALIZED',
      message: `✅ Normalized ${convCount} Imperial measurements to Metric SI standards`,
      penalty: 0,
      suggestion: '',
    });
  } else {
    // No conversions needed is not a penalty — might already be metric
    totalScore += unitFactor.weight;
    factorBreakdown[unitFactor.label] = { earned: unitFactor.weight, max: unitFactor.weight, status: 'PASS' };
  }

  // ── Factor 8: Brand Present ──
  const brandFactor = VALIDATION_WEIGHTS.BRAND_PRESENT;
  maxPossible += brandFactor.weight;
  const brand = record.Brand_Name || '';
  if (!brand || brand === 'Industrial Supply' || brand === 'Custom Feed') {
    const partial = Math.round(brandFactor.weight * 0.3);
    totalScore += partial;
    flags.push({
      severity: 'WARNING',
      code: 'GENERIC_BRAND',
      message: '⚠️ No specific manufacturer brand identified',
      penalty: brandFactor.weight - partial,
      suggestion: 'Specify the manufacturer brand name.',
    });
    factorBreakdown[brandFactor.label] = { earned: partial, max: brandFactor.weight, status: 'PARTIAL' };
  } else {
    totalScore += brandFactor.weight;
    factorBreakdown[brandFactor.label] = { earned: brandFactor.weight, max: brandFactor.weight, status: 'PASS' };
  }

  // ── Factor 9: Source Traced ──
  const srcFactor = VALIDATION_WEIGHTS.SOURCE_TRACED;
  maxPossible += srcFactor.weight;
  if (record.Source_Reference && record.Source_Reference !== 'Automated Parser Engine') {
    totalScore += srcFactor.weight;
    factorBreakdown[srcFactor.label] = { earned: srcFactor.weight, max: srcFactor.weight, status: 'PASS' };
  } else {
    const partial = Math.round(srcFactor.weight * 0.5);
    totalScore += partial;
    factorBreakdown[srcFactor.label] = { earned: partial, max: srcFactor.weight, status: 'PARTIAL' };
  }

  // ── Composite Score ──
  const compositeScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

  // ── Status Determination ──
  let status = 'VALID';
  const criticalFlags = flags.filter(f => f.severity === 'CRITICAL').length;
  const warningFlags = flags.filter(f => f.severity === 'WARNING').length;

  if (criticalFlags >= 2 || compositeScore < 60) {
    status = 'CRITICAL_ERROR';
  } else if (criticalFlags >= 1 || warningFlags >= 2 || compositeScore < 80) {
    status = 'WARNING';
  }

  // ── Mandatory Attribute Check ──
  if (record._taxonDetails?.mandatory) {
    const missing = record._taxonDetails.mandatory.filter(attr => {
      const specObj = record._extractedSpecsObj || {};
      return !Object.keys(specObj).some(k => k.toLowerCase().includes(attr.toLowerCase()));
    });

    if (missing.length > 0) {
      flags.push({
        severity: 'WARNING',
        code: 'MISSING_MANDATORY_ATTRS',
        message: `⚠️ Missing ${missing.length} mandatory attributes for ${record._taxonDetails.title}: ${missing.join(', ')}`,
        penalty: missing.length * 2,
        suggestion: `Add: ${missing.join(', ')} to the product specification.`,
      });
    }
  }

  return {
    status,
    score: compositeScore,
    flags,
    factorBreakdown,
    summary: {
      totalFactors: Object.keys(VALIDATION_WEIGHTS).length,
      passed: Object.values(factorBreakdown).filter(f => f.status === 'PASS').length,
      partial: Object.values(factorBreakdown).filter(f => f.status === 'PARTIAL').length,
      failed: Object.values(factorBreakdown).filter(f => f.status === 'FAIL').length,
    },
  };
}
