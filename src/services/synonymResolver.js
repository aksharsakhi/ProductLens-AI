/**
 * ProductLens AI — Industrial Abbreviation & Synonym Resolver
 * Resolves 200+ industry-standard abbreviations, trade names, and shorthand
 * into normalized full-form labels for consistent cataloging.
 */

// Material Synonyms
const MATERIAL_SYNONYMS = {
  'ss': 'Stainless Steel',
  '304ss': '304 Stainless Steel',
  '304 ss': '304 Stainless Steel',
  '316ss': '316 Stainless Steel',
  '316 ss': '316 Stainless Steel',
  '316l': '316L Stainless Steel',
  'stainless': 'Stainless Steel',
  'stainless steel': 'Stainless Steel',
  'ci': 'Cast Iron',
  'cast iron': 'Cast Iron',
  'di': 'Ductile Iron',
  'ductile iron': 'Ductile Iron',
  'cs': 'Carbon Steel',
  'carbon steel': 'Carbon Steel',
  'brass': 'Brass',
  'bronze': 'Bronze',
  'pvc': 'PVC (Polyvinyl Chloride)',
  'cpvc': 'CPVC (Chlorinated PVC)',
  'pp': 'Polypropylene',
  'ptfe': 'PTFE (Polytetrafluoroethylene)',
  'teflon': 'PTFE (Polytetrafluoroethylene)',
  'hdpe': 'HDPE (High Density Polyethylene)',
  'aluminum': 'Aluminum',
  'aluminium': 'Aluminum',
  'al': 'Aluminum',
  'titanium': 'Titanium',
  'hastelloy': 'Hastelloy (Nickel-Chromium-Molybdenum)',
  'inconel': 'Inconel (Nickel-Chromium Superalloy)',
  'monel': 'Monel (Nickel-Copper Alloy)',
  'chrome steel': 'Chrome Steel (52100)',
  'chrome': 'Chrome Steel (52100)',
  'zinc plated': 'Zinc Plated Steel',
  'galvanized': 'Galvanized Steel',
  'epdm': 'EPDM Rubber',
  'buna-n': 'Buna-N (Nitrile Rubber)',
  'nbr': 'NBR (Nitrile Rubber)',
  'viton': 'Viton (FKM Fluoroelastomer)',
  'fkm': 'FKM Fluoroelastomer',
  'neoprene': 'Neoprene (Chloroprene Rubber)',
};

// Connection Type Synonyms
const CONNECTION_SYNONYMS = {
  'npt': 'NPT (National Pipe Thread Tapered)',
  'nptf': 'NPTF (Dryseal National Pipe Thread)',
  'bsp': 'BSP (British Standard Pipe)',
  'bspt': 'BSPT (British Standard Pipe Tapered)',
  'flanged': 'Flanged (ANSI/ASME B16.5)',
  'flange': 'Flanged (ANSI/ASME B16.5)',
  'tri-clamp': 'Tri-Clamp (Sanitary)',
  'tri clamp': 'Tri-Clamp (Sanitary)',
  'compression': 'Compression Fitting',
  'tube fitting': 'Tube Fitting (Swagelok-Type)',
  'push-to-connect': 'Push-to-Connect',
  'socket weld': 'Socket Weld (SW)',
  'butt weld': 'Butt Weld (BW)',
  'threaded': 'Threaded Connection',
  'grooved': 'Grooved (Victaulic-Style)',
  'lug': 'Lug Type Mounting',
  'wafer': 'Wafer Type Mounting',
};

// Certification & Rating Synonyms
const CERTIFICATION_SYNONYMS = {
  'ip65': 'IP65 (Dust-tight, Water Jet Protected)',
  'ip66': 'IP66 (Dust-tight, Powerful Water Jet Protected)',
  'ip67': 'IP67 (Dust-tight, Temporary Immersion)',
  'ip68': 'IP68 (Dust-tight, Continuous Immersion)',
  'ip20': 'IP20 (Touch Protected)',
  'nema 1': 'NEMA 1 (General Purpose Indoor)',
  'nema 4': 'NEMA 4 (Watertight Outdoor)',
  'nema 4x': 'NEMA 4X (Watertight, Corrosion Resistant)',
  'nema 12': 'NEMA 12 (Dust-tight Indoor)',
  'ul listed': 'UL Listed',
  'csa': 'CSA Certified',
  'ce': 'CE Marked (European Conformity)',
  'atex': 'ATEX Certified (Explosive Atmospheres)',
  'class 1 div 1': 'Class I Division 1 (Hazardous Location)',
  'class 1 div 2': 'Class I Division 2 (Hazardous Location)',
  'explosion proof': 'Explosion Proof (Class I Div 1/2)',
  'xp': 'Explosion Proof (XP)',
  'fm approved': 'FM Approved',
  'ansi 150': 'ANSI Class 150 (PN 20)',
  'ansi 300': 'ANSI Class 300 (PN 50)',
  'ansi 600': 'ANSI Class 600 (PN 100)',
  '150#': 'ANSI Class 150',
  '300#': 'ANSI Class 300',
  'wog': 'WOG (Water, Oil, Gas)',
  'wsp': 'WSP (Working Steam Pressure)',
};

// Motor & Electrical Synonyms
const ELECTRICAL_SYNONYMS = {
  'tefc': 'TEFC (Totally Enclosed Fan Cooled)',
  'tenv': 'TENV (Totally Enclosed Non-Ventilated)',
  'odp': 'ODP (Open Drip Proof)',
  'xpfc': 'XPFC (Explosion Proof Fan Cooled)',
  'vfd': 'VFD (Variable Frequency Drive)',
  'vsd': 'VSD (Variable Speed Drive)',
  'plc': 'PLC (Programmable Logic Controller)',
  'hmi': 'HMI (Human Machine Interface)',
  'scada': 'SCADA (Supervisory Control)',
  'modbus': 'Modbus RTU/TCP Protocol',
  'profibus': 'Profibus Communication',
  'ethernet/ip': 'EtherNet/IP Industrial Protocol',
  '4-20ma': '4-20mA Analog Control Signal',
  '4-20 ma': '4-20mA Analog Control Signal',
  'din rail': 'DIN Rail Mounted (TS-35)',
  'panel mount': 'Panel Mount Installation',
  '3-phase': '3-Phase AC',
  '3 phase': '3-Phase AC',
  'single phase': 'Single Phase AC',
  '1-phase': 'Single Phase AC',
  'zero-cross': 'Zero-Cross Switching',
};

// Bearing & Motion Synonyms
const MOTION_SYNONYMS = {
  '2rs': '2RS (Double Rubber Sealed)',
  '2z': '2Z (Double Shielded)',
  'zz': 'ZZ (Double Metal Shielded)',
  'c3': 'C3 (Greater Than Normal Clearance)',
  'c4': 'C4 (Greater Than C3 Clearance)',
  'set screw': 'Set Screw Locking',
  'eccentric collar': 'Eccentric Collar Locking',
  'adapter sleeve': 'Adapter Sleeve Mounting',
  'grease nipple': 'Grease Fitting (Zerk)',
  'pillow block': 'Pillow Block Housing (UCP)',
  'flange mount': 'Flanged Housing (UCF)',
  'take-up': 'Take-Up Frame Housing (UCT)',
};

// Build combined lookup
const ALL_SYNONYMS = {
  ...MATERIAL_SYNONYMS,
  ...CONNECTION_SYNONYMS,
  ...CERTIFICATION_SYNONYMS,
  ...ELECTRICAL_SYNONYMS,
  ...MOTION_SYNONYMS,
};

/**
 * Resolve a single abbreviation/synonym to its full form.
 * @param {string} abbrev - The abbreviation to look up
 * @returns {{ resolved: string, category: string } | null}
 */
export function resolveSynonym(abbrev) {
  const key = abbrev.toLowerCase().trim();
  if (MATERIAL_SYNONYMS[key]) return { resolved: MATERIAL_SYNONYMS[key], category: 'Material' };
  if (CONNECTION_SYNONYMS[key]) return { resolved: CONNECTION_SYNONYMS[key], category: 'Connection' };
  if (CERTIFICATION_SYNONYMS[key]) return { resolved: CERTIFICATION_SYNONYMS[key], category: 'Certification' };
  if (ELECTRICAL_SYNONYMS[key]) return { resolved: ELECTRICAL_SYNONYMS[key], category: 'Electrical' };
  if (MOTION_SYNONYMS[key]) return { resolved: MOTION_SYNONYMS[key], category: 'Motion' };
  return null;
}

/**
 * Scan text for ALL known abbreviations and return resolved results.
 * @param {string} text - Raw product text
 * @returns {Array<{ original: string, resolved: string, category: string }>}
 */
export function resolveAllSynonyms(text) {
  const textLower = text.toLowerCase();
  const results = [];
  const seen = new Set();

  // Sort keys longest first for greedy matching
  const sortedKeys = Object.keys(ALL_SYNONYMS).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (textLower.includes(key) && !seen.has(ALL_SYNONYMS[key])) {
      const cat = MATERIAL_SYNONYMS[key] ? 'Material'
        : CONNECTION_SYNONYMS[key] ? 'Connection'
        : CERTIFICATION_SYNONYMS[key] ? 'Certification'
        : ELECTRICAL_SYNONYMS[key] ? 'Electrical'
        : 'Motion';

      results.push({
        original: key,
        resolved: ALL_SYNONYMS[key],
        category: cat,
      });
      seen.add(ALL_SYNONYMS[key]);
    }
  }

  return results;
}

export {
  MATERIAL_SYNONYMS,
  CONNECTION_SYNONYMS,
  CERTIFICATION_SYNONYMS,
  ELECTRICAL_SYNONYMS,
  MOTION_SYNONYMS,
};
