/**
 * ProductLens AI — Advanced NLP Specification Extractor
 * Multi-pass regex + heuristic extraction engine for 30+ industrial spec categories.
 * Each extractor returns structured data with confidence and provenance.
 */

/**
 * @typedef {Object} ExtractedSpec
 * @property {string} field - The specification field name
 * @property {string} value - The extracted value
 * @property {string} raw - The raw matched text from input
 * @property {number} confidence - Extraction confidence (0-100)
 * @property {string} method - Extraction method used
 */

/**
 * Run all extractors against raw text and return structured specs.
 * @param {string} text - Raw product specification text
 * @returns {{ specs: Record<string, string>, details: ExtractedSpec[] }}
 */
export function extractSpecifications(text) {
  const specs = {};
  const details = [];

  const extractors = [
    extractMaterial,
    extractVoltage,
    extractAmperage,
    extractWattage,
    extractHorsepower,
    extractPressure,
    extractTemperature,
    extractPortSize,
    extractFlowRate,
    extractRPM,
    extractPhases,
    extractPoles,
    extractFrequency,
    extractBoreSize,
    extractOutsideDiameter,
    extractWidth,
    extractSealType,
    extractClearance,
    extractDynamicLoad,
    extractEnclosureRating,
    extractMountingType,
    extractOperatingMode,
    extractSwitchType,
    extractControlSignal,
    extractEndConnection,
    extractBodyStyle,
    extractActuatorType,
  ];

  for (const extractor of extractors) {
    const result = extractor(text);
    if (result) {
      specs[result.field] = result.value;
      details.push(result);
    }
  }

  return { specs, details };
}

// ─── Individual Extractors ───

function extractMaterial(text) {
  const t = text.toLowerCase();
  const patterns = [
    { regex: /316l?\s*(?:stainless\s*steel|ss)/i, value: '316 Stainless Steel', conf: 95 },
    { regex: /304\s*(?:stainless\s*steel|ss)/i, value: '304 Stainless Steel', conf: 95 },
    { regex: /stainless\s*steel/i, value: 'Stainless Steel', conf: 90 },
    { regex: /ductile\s*iron/i, value: 'Ductile Iron', conf: 95 },
    { regex: /cast\s*iron/i, value: 'Cast Iron', conf: 95 },
    { regex: /carbon\s*steel/i, value: 'Carbon Steel', conf: 95 },
    { regex: /\bbrass\b/i, value: 'Brass', conf: 95 },
    { regex: /\bbronze\b/i, value: 'Bronze', conf: 95 },
    { regex: /\bpvc\b/i, value: 'PVC', conf: 90 },
    { regex: /\bcpvc\b/i, value: 'CPVC', conf: 90 },
    { regex: /\bptfe\b|\bteflon\b/i, value: 'PTFE', conf: 90 },
    { regex: /\baluminum\b|\baluminium\b/i, value: 'Aluminum', conf: 90 },
    { regex: /316ss/i, value: '316 Stainless Steel', conf: 95 },
    { regex: /\bss\b/i, value: 'Stainless Steel', conf: 70 },
  ];

  for (const p of patterns) {
    const match = text.match(p.regex);
    if (match) {
      return { field: 'Material', value: p.value, raw: match[0], confidence: p.conf, method: 'REGEX_MATERIAL' };
    }
  }
  return null;
}

function extractVoltage(text) {
  // Match patterns like "24VDC", "230/460V", "120-240VAC", "480V"
  const patterns = [
    { regex: /(\d+)\s*\/\s*(\d+)\s*v(?:ac|dc)?/i, format: (m) => `${m[1]}/${m[2]}V`, conf: 95 },
    { regex: /(\d+)\s*-\s*(\d+)\s*v(?:ac|dc)?/i, format: (m) => `${m[1]}-${m[2]}V`, conf: 90 },
    { regex: /(\d+)\s*v\s*(?:dc)/i, format: (m) => `${m[1]}VDC`, conf: 95 },
    { regex: /(\d+)\s*v\s*(?:ac)/i, format: (m) => `${m[1]}VAC`, conf: 95 },
    { regex: /(\d+)\s*v\b/i, format: (m) => `${m[1]}V`, conf: 80 },
  ];

  for (const p of patterns) {
    const match = text.match(p.regex);
    if (match) {
      return { field: 'Voltage', value: p.format(match), raw: match[0], confidence: p.conf, method: 'REGEX_VOLTAGE' };
    }
  }
  return null;
}

function extractAmperage(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:amp|amps|a)\b/i);
  if (match) {
    return { field: 'Amperage', value: `${match[1]}A`, raw: match[0], confidence: 90, method: 'REGEX_AMPERAGE' };
  }
  return null;
}

function extractWattage(text) {
  const match = text.match(/(\d+)\s*(?:watt|watts|w)\b/i);
  if (match && parseInt(match[1]) > 5) { // filter out small numbers
    return { field: 'Power (Watts)', value: `${match[1]}W`, raw: match[0], confidence: 88, method: 'REGEX_WATTAGE' };
  }
  return null;
}

function extractHorsepower(text) {
  const match = text.match(/(\d+(?:\/\d+)?|\d+(?:\.\d+)?)\s*hp\b/i);
  if (match) {
    let hp = match[1];
    if (hp.includes('/')) {
      const parts = hp.split('/');
      hp = `${hp} (${(parseFloat(parts[0]) / parseFloat(parts[1])).toFixed(2)})`;
    }
    return { field: 'Horsepower', value: `${match[1]} HP`, raw: match[0], confidence: 95, method: 'REGEX_HP' };
  }
  return null;
}

function extractPressure(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*psi\b/i);
  if (match) {
    return { field: 'Pressure Rating', value: `${match[1]} PSI`, raw: match[0], confidence: 95, method: 'REGEX_PRESSURE' };
  }
  const barMatch = text.match(/(\d+(?:\.\d+)?)\s*bar\b/i);
  if (barMatch) {
    return { field: 'Pressure Rating', value: `${barMatch[1]} Bar`, raw: barMatch[0], confidence: 95, method: 'REGEX_PRESSURE_BAR' };
  }
  return null;
}

function extractTemperature(text) {
  const fMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:°|deg(?:rees?)?\s*)?f\b/i);
  if (fMatch) {
    return { field: 'Max Temperature', value: `${fMatch[1]}°F`, raw: fMatch[0], confidence: 90, method: 'REGEX_TEMP_F' };
  }
  const cMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:°|deg(?:rees?)?\s*)?c\b/i);
  if (cMatch && parseFloat(cMatch[1]) > 10) {
    return { field: 'Max Temperature', value: `${cMatch[1]}°C`, raw: cMatch[0], confidence: 90, method: 'REGEX_TEMP_C' };
  }
  return null;
}

function extractPortSize(text) {
  // Match "1/2 in", "3/4 inch", "2 inch", "G 1/4"
  const patterns = [
    { regex: /g\s*(\d+\/\d+|\d+)\s*(?:port)?/i, format: (m) => `G ${m[1]}`, type: 'BSP', conf: 90 },
    { regex: /(\d+(?:\/\d+)?)\s*(?:in(?:ch)?|\")\s*(?:npt)?/i, format: (m) => `${m[1]}" NPT`, conf: 88 },
    { regex: /(\d+)\s*(?:mm)\s*(?:port|bore)/i, format: (m) => `${m[1]}mm`, conf: 85 },
  ];

  for (const p of patterns) {
    const match = text.match(p.regex);
    if (match) {
      return { field: 'Port Size', value: p.format(match), raw: match[0], confidence: p.conf, method: 'REGEX_PORT' };
    }
  }
  return null;
}

function extractFlowRate(text) {
  const gpmMatch = text.match(/(\d+(?:\.\d+)?)\s*gpm\b/i);
  if (gpmMatch) {
    return { field: 'Flow Rate', value: `${gpmMatch[1]} GPM`, raw: gpmMatch[0], confidence: 95, method: 'REGEX_FLOW_GPM' };
  }
  const gpdMatch = text.match(/(\d+(?:\.\d+)?)\s*gpd\b/i);
  if (gpdMatch) {
    return { field: 'Flow Rate', value: `${gpdMatch[1]} GPD`, raw: gpdMatch[0], confidence: 95, method: 'REGEX_FLOW_GPD' };
  }
  const lpmMatch = text.match(/(\d+(?:\.\d+)?)\s*lpm\b/i);
  if (lpmMatch) {
    return { field: 'Flow Rate', value: `${lpmMatch[1]} LPM`, raw: lpmMatch[0], confidence: 95, method: 'REGEX_FLOW_LPM' };
  }
  return null;
}

function extractRPM(text) {
  const match = text.match(/(\d+)\s*rpm\b/i);
  if (match) {
    return { field: 'Speed (RPM)', value: `${match[1]} RPM`, raw: match[0], confidence: 92, method: 'REGEX_RPM' };
  }
  return null;
}

function extractPhases(text) {
  const match = text.match(/(\d)\s*(?:-\s*)?phase/i);
  if (match) {
    return { field: 'Electrical Phases', value: `${match[1]}-Phase`, raw: match[0], confidence: 95, method: 'REGEX_PHASE' };
  }
  return null;
}

function extractPoles(text) {
  const match = text.match(/(\d)\s*pole/i);
  if (match) {
    return { field: 'Poles', value: `${match[1]}-Pole`, raw: match[0], confidence: 95, method: 'REGEX_POLES' };
  }
  return null;
}

function extractFrequency(text) {
  const match = text.match(/(\d+)\s*hz\b/i);
  if (match) {
    return { field: 'Frequency', value: `${match[1]} Hz`, raw: match[0], confidence: 90, method: 'REGEX_FREQ' };
  }
  return null;
}

function extractBoreSize(text) {
  const match = text.match(/(\d+)\s*mm\s*bore\b/i);
  if (match) {
    return { field: 'Bore Diameter', value: `${match[1]} mm`, raw: match[0], confidence: 95, method: 'REGEX_BORE' };
  }
  return null;
}

function extractOutsideDiameter(text) {
  const match = text.match(/(\d+)\s*mm\s*(?:od|o\.?d\.?|outside\s*diameter)/i);
  if (match) {
    return { field: 'Outside Diameter', value: `${match[1]} mm`, raw: match[0], confidence: 95, method: 'REGEX_OD' };
  }
  return null;
}

function extractWidth(text) {
  const match = text.match(/(\d+)\s*mm\s*width\b/i);
  if (match) {
    return { field: 'Width', value: `${match[1]} mm`, raw: match[0], confidence: 92, method: 'REGEX_WIDTH' };
  }
  return null;
}

function extractSealType(text) {
  const t = text.toLowerCase();
  if (t.includes('rubber seal')) return { field: 'Seal Type', value: 'Rubber Sealed (2RS)', raw: 'rubber seal', confidence: 90, method: 'KEYWORD_SEAL' };
  if (t.includes('2rs')) return { field: 'Seal Type', value: '2RS (Double Rubber Sealed)', raw: '2RS', confidence: 95, method: 'KEYWORD_SEAL' };
  if (t.includes('2z') || t.includes('zz')) return { field: 'Seal Type', value: 'ZZ (Double Metal Shielded)', raw: '2Z/ZZ', confidence: 95, method: 'KEYWORD_SEAL' };
  if (t.includes('open bearing') || t.includes('open type')) return { field: 'Seal Type', value: 'Open (No Seal)', raw: 'open', confidence: 85, method: 'KEYWORD_SEAL' };
  return null;
}

function extractClearance(text) {
  const t = text.toLowerCase();
  if (t.includes('c3')) return { field: 'Internal Clearance', value: 'C3 (Greater Than Normal)', raw: 'C3', confidence: 92, method: 'KEYWORD_CLEARANCE' };
  if (t.includes('c4')) return { field: 'Internal Clearance', value: 'C4 (Greater Than C3)', raw: 'C4', confidence: 92, method: 'KEYWORD_CLEARANCE' };
  if (t.includes('cn') || t.includes('normal clearance')) return { field: 'Internal Clearance', value: 'CN (Normal)', raw: 'CN', confidence: 88, method: 'KEYWORD_CLEARANCE' };
  return null;
}

function extractDynamicLoad(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*kn\b/i);
  if (match) {
    return { field: 'Dynamic Load Rating', value: `${match[1]} kN`, raw: match[0], confidence: 92, method: 'REGEX_LOAD' };
  }
  return null;
}

function extractEnclosureRating(text) {
  const t = text.toLowerCase();
  const ratings = [
    { keyword: 'ip68', value: 'IP68' }, { keyword: 'ip67', value: 'IP67' },
    { keyword: 'ip66', value: 'IP66' }, { keyword: 'ip65', value: 'IP65' },
    { keyword: 'ip54', value: 'IP54' }, { keyword: 'ip20', value: 'IP20' },
    { keyword: 'nema 4x', value: 'NEMA 4X' }, { keyword: 'nema 4', value: 'NEMA 4' },
    { keyword: 'nema 12', value: 'NEMA 12' }, { keyword: 'nema 1', value: 'NEMA 1' },
  ];

  for (const r of ratings) {
    if (t.includes(r.keyword)) {
      return { field: 'Enclosure Rating', value: r.value, raw: r.keyword, confidence: 95, method: 'KEYWORD_ENCLOSURE' };
    }
  }
  return null;
}

function extractMountingType(text) {
  const t = text.toLowerCase();
  if (t.includes('din rail')) return { field: 'Mounting', value: 'DIN Rail (TS-35)', raw: 'DIN rail', confidence: 95, method: 'KEYWORD_MOUNT' };
  if (t.includes('panel mount')) return { field: 'Mounting', value: 'Panel Mount', raw: 'panel mount', confidence: 90, method: 'KEYWORD_MOUNT' };
  if (t.includes('wall mount')) return { field: 'Mounting', value: 'Wall Mount', raw: 'wall mount', confidence: 90, method: 'KEYWORD_MOUNT' };
  if (t.includes('inline')) return { field: 'Mounting', value: 'Inline Installation', raw: 'inline', confidence: 85, method: 'KEYWORD_MOUNT' };
  return null;
}

function extractOperatingMode(text) {
  const t = text.toLowerCase();
  if (t.includes('spring return')) return { field: 'Operating Mode', value: 'Spring Return', raw: 'spring return', confidence: 90, method: 'KEYWORD_MODE' };
  if (t.includes('double acting')) return { field: 'Operating Mode', value: 'Double Acting', raw: 'double acting', confidence: 90, method: 'KEYWORD_MODE' };
  if (t.includes('manual')) return { field: 'Operating Mode', value: 'Manual Operation', raw: 'manual', confidence: 80, method: 'KEYWORD_MODE' };
  if (t.includes('lever')) return { field: 'Operating Mode', value: 'Lever Operated', raw: 'lever', confidence: 85, method: 'KEYWORD_MODE' };
  if (t.includes('gear operator')) return { field: 'Operating Mode', value: 'Gear Operated', raw: 'gear operator', confidence: 90, method: 'KEYWORD_MODE' };
  return null;
}

function extractSwitchType(text) {
  const t = text.toLowerCase();
  if (t.includes('float switch')) return { field: 'Switch Type', value: 'Vertical Float Switch', raw: 'float switch', confidence: 92, method: 'KEYWORD_SWITCH' };
  if (t.includes('pressure switch')) return { field: 'Switch Type', value: 'Pressure Switch', raw: 'pressure switch', confidence: 90, method: 'KEYWORD_SWITCH' };
  if (t.includes('zero-cross') || t.includes('zero cross')) return { field: 'Switching Mode', value: 'Zero-Cross Switching', raw: 'zero-cross', confidence: 95, method: 'KEYWORD_SWITCH' };
  return null;
}

function extractControlSignal(text) {
  const t = text.toLowerCase();
  if (t.includes('4-20ma') || t.includes('4-20 ma')) return { field: 'Control Signal', value: '4-20mA Analog', raw: '4-20mA', confidence: 95, method: 'KEYWORD_CONTROL' };
  if (t.includes('modbus')) return { field: 'Communication', value: 'Modbus RTU/TCP', raw: 'Modbus', confidence: 92, method: 'KEYWORD_COMM' };
  if (t.includes('hart')) return { field: 'Communication', value: 'HART Protocol', raw: 'HART', confidence: 90, method: 'KEYWORD_COMM' };
  return null;
}

function extractEndConnection(text) {
  const t = text.toLowerCase();
  if (t.includes('flanged') || t.includes('flange')) return { field: 'End Connection', value: 'Flanged', raw: 'flanged', confidence: 90, method: 'KEYWORD_CONN' };
  if (t.includes('npt')) return { field: 'End Connection', value: 'NPT Threaded', raw: 'NPT', confidence: 92, method: 'KEYWORD_CONN' };
  if (t.includes('threaded')) return { field: 'End Connection', value: 'Threaded', raw: 'threaded', confidence: 85, method: 'KEYWORD_CONN' };
  if (t.includes('socket weld')) return { field: 'End Connection', value: 'Socket Weld', raw: 'socket weld', confidence: 92, method: 'KEYWORD_CONN' };
  return null;
}

function extractBodyStyle(text) {
  const t = text.toLowerCase();
  if (t.includes('lug type') || t.includes('lug style')) return { field: 'Body Style', value: 'Lug Type', raw: 'lug type', confidence: 90, method: 'KEYWORD_BODY' };
  if (t.includes('wafer type') || t.includes('wafer style')) return { field: 'Body Style', value: 'Wafer Type', raw: 'wafer type', confidence: 90, method: 'KEYWORD_BODY' };
  if (t.includes('full port')) return { field: 'Body Style', value: 'Full Port', raw: 'full port', confidence: 88, method: 'KEYWORD_BODY' };
  if (t.includes('reduced port')) return { field: 'Body Style', value: 'Reduced Port', raw: 'reduced port', confidence: 88, method: 'KEYWORD_BODY' };
  return null;
}

function extractActuatorType(text) {
  const t = text.toLowerCase();
  if (t.includes('solenoid')) return { field: 'Actuator Type', value: 'Solenoid (Electromagnetic)', raw: 'solenoid', confidence: 92, method: 'KEYWORD_ACTUATOR' };
  if (t.includes('pneumatic')) return { field: 'Actuator Type', value: 'Pneumatic Actuated', raw: 'pneumatic', confidence: 90, method: 'KEYWORD_ACTUATOR' };
  if (t.includes('electric actuator')) return { field: 'Actuator Type', value: 'Electric Actuator', raw: 'electric actuator', confidence: 90, method: 'KEYWORD_ACTUATOR' };
  return null;
}
