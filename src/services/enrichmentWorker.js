import { resolveAllSynonyms } from './synonymResolver.js';
import { extractSpecifications } from './specExtractor.js';
import { generateStandardTitle, generateShortDescription, generateLongDescription } from './titleStandardizer.js';
import { validateProductRecord } from './qualityValidator.js';
import { UNSPSC_DATABASE, normalizePhysicsUnits } from './aiEnrichmentEngine.js';

// The worker needs a duplicate of the non-gemini part of enrichProductItem
// We can just implement the heuristic pipeline here to run off-thread

self.onmessage = (e) => {
  const { batch, customRules } = e.data;
  
  if (!batch || !Array.isArray(batch)) {
    self.postMessage({ type: 'ERROR', error: 'Invalid batch data' });
    return;
  }

  // Define the classification function locally for the worker
  const CLASSIFICATION_RULES = [
    { key: 'solenoid_valve', keywords: ['solenoid valve', 'solenoid'], weight: 10 },
    { key: 'ball_valve', keywords: ['ball valve'], weight: 10 },
    { key: 'needle_valve', keywords: ['needle valve'], weight: 10 },
    { key: 'butterfly_valve', keywords: ['butterfly valve', 'butterfly'], weight: 10 },
    { key: 'check_valve', keywords: ['check valve', 'swing type'], weight: 10 },
    { key: 'directional_valve', keywords: ['directional control', '5/2', '3/2', 'directional valve'], weight: 10 },
    { key: 'centrifugal_pump', keywords: ['centrifugal pump'], weight: 10 },
    { key: 'gear_pump', keywords: ['gear pump', 'positive displacement'], weight: 10 },
    { key: 'submersible_pump', keywords: ['submersible', 'sump pump'], weight: 10 },
    { key: 'metering_pump', keywords: ['metering pump', 'chemical metering', 'dosing pump'], weight: 10 },
    { key: 'vertical_pump', keywords: ['vertical inline', 'multi-stage', 'multistage', 'inline pump'], weight: 8 },
    { key: 'circuit_breaker', keywords: ['circuit breaker', 'mcb', 'miniature circuit'], weight: 10 },
    { key: 'motor_starter', keywords: ['motor starter', 'contactor', 'magnetic starter'], weight: 10 },
    { key: 'power_supply', keywords: ['power supply', 'dc power', 'switching power'], weight: 10 },
    { key: 'vfd_drive', keywords: ['variable frequency', 'vfd', 'frequency drive', 'ac drive'], weight: 10 },
    { key: 'solid_state_relay', keywords: ['solid state relay', 'ssr'], weight: 10 },
    { key: 'ball_bearing', keywords: ['ball bearing', 'deep groove', '6210', '6208', '6206', '6205'], weight: 10 },
    { key: 'mounted_bearing', keywords: ['pillow block', 'mounted bearing', 'ucp'], weight: 10 },
    { key: 'linear_guide', keywords: ['linear guide', 'linear motion', 'rail', 'hgw', 'hgh'], weight: 8 },
    { key: 'tapered_bearing', keywords: ['tapered roller', 'tapered bearing', 'cone bore'], weight: 10 },
  ];

  function classifyUNSPSC(text) {
    const textLower = text.toLowerCase();
    let bestMatch = { key: 'default', score: 0 };
    for (const rule of CLASSIFICATION_RULES) {
      let score = 0;
      for (const kw of rule.keywords) {
        if (textLower.includes(kw)) {
          score += rule.weight * kw.length;
        }
      }
      if (score > bestMatch.score) {
        bestMatch = { key: rule.key, score };
      }
    }
    const taxon = UNSPSC_DATABASE[bestMatch.key] || UNSPSC_DATABASE.default;
    const confidence = bestMatch.score > 0 ? Math.min(99, 70 + bestMatch.score) : 40;
    return { taxon, confidence, matchKey: bestMatch.key };
  }

  function generateAuditLog({ item, synonymsResolved, specDetails, taxonResult, conversions, validation }) {
    return [
      `[ProductLens AI — Heuristic Engine Worker]`,
      `SKU: ${item.raw_id} | MPN: ${item.mpn || 'N/A'} | Brand: ${item.brand || 'N/A'}`,
      `Status: ${validation.status} | Score: ${validation.score}/100`
    ].join('\n');
  }

  self.postMessage({ type: 'LOG', message: `SPAWNING NLP WORKER THREAD... Processing batch of ${batch.length} items` });

  const enrichedBatch = batch.map((item, idx) => {
    const text = (item.raw_input || '').trim();
    
    // Periodically emit logs so the terminal looks alive
    if (idx % Math.max(1, Math.floor(batch.length / 20)) === 0) {
      self.postMessage({ type: 'LOG', message: `Tokenizing & Classifying Chunk [${idx}/${batch.length}]...` });
    }

    const synonymsResolved = resolveAllSynonyms(text);
    const { specs: extractedSpecs, details: specDetails } = extractSpecifications(text);

    // Apply custom user rules
    const textLower = text.toLowerCase();
    (customRules || []).forEach(rule => {
      if (rule.keyword && textLower.includes(rule.keyword.toLowerCase())) {
        extractedSpecs[rule.targetField] = rule.targetValue;
        specDetails.push({ field: rule.targetField, value: rule.targetValue, raw: rule.keyword, confidence: 100, method: 'USER_CUSTOM_RULE' });
      }
    });

    const taxonResult = classifyUNSPSC(text);
    const taxon = taxonResult.taxon;
    const conversions = normalizePhysicsUnits(text);

    const productTitle = generateStandardTitle({ brand: item.brand, mpn: item.mpn, productType: taxon.title, specs: extractedSpecs, rawInput: text });
    const shortDescription = generateShortDescription({ brand: item.brand, mpn: item.mpn, productType: taxon.title, specs: extractedSpecs, taxon });
    const longDescription = generateLongDescription({ brand: item.brand, mpn: item.mpn, productType: taxon.title, specs: extractedSpecs, taxon, conversions, synonymsResolved });

    const preValidationRecord = {
      Product_ID: item.raw_id,
      MPN: item.mpn || 'N/A',
      Brand_Name: item.brand || 'Industrial Supply',
      Product_Title: productTitle,
      Short_Description: shortDescription,
      Long_Description: longDescription,
      Category_Path: taxon.category,
      UNSPSC_Code: taxon.code,
      Primary_Specifications: Object.entries(extractedSpecs).map(([k, v]) => `${k}: ${v}`).join(' | '),
      Enriched_Attributes: JSON.stringify(extractedSpecs),
      Source_Reference: item.source || 'Worker Node',
      _raw: item,
      _conversions: conversions,
      _taxonDetails: taxon,
      _extractedSpecsObj: extractedSpecs,
      _specDetails: specDetails,
      _synonymsResolved: synonymsResolved,
      _isGemini: false
    };

    const validation = validateProductRecord(preValidationRecord);
    const auditLog = generateAuditLog({ item, synonymsResolved, specDetails, taxonResult, conversions, validation });

    // Emit detailed log for individual items if batch is small, or occasionally for large batches
    if (batch.length < 50 || idx % Math.max(1, Math.floor(batch.length / 5)) === 0) {
       self.postMessage({ type: 'LOG', message: `PROCESSED: ${item.raw_id} -> ${taxon.code} | Q-SCORE: ${validation.score} | ${validation.status}` });
    }

    return {
      ...preValidationRecord,
      Validation_Status: validation.status,
      Validation_Flags: validation.flags.map(f => f.message).join(' ; '),
      Confidence_Score: `${validation.score}%`,
      AI_Reasoning_Audit: auditLog,
      _qualityScore: validation.score,
      _validationDetails: validation,
    };
  });

  self.postMessage({ type: 'LOG', message: `SUCCESS: Batch processing complete. Yielding back to main thread.` });
  self.postMessage({ type: 'SUCCESS', batch: enrichedBatch });
};
