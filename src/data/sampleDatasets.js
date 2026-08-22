export const SAMPLE_DATASETS = [
  {
    id: 'valves_hydraulics',
    name: 'Industrial Valves & Fluid Control',
    count: 6,
    description: 'Raw spec sheets, mixed imperial units, missing UNSPSC codes, unformatted titles.',
    items: [
      {
        raw_id: 'SKU-V-101',
        raw_input: 'Brass solenoid valve 1/2 in NPT female 24VDC 150psi max temp 180F model SV-24V-05',
        source: 'Technical Data Sheet - PDF Pg 4',
        mpn: 'SV-24V-05',
        brand: 'FlowTech'
      },
      {
        raw_id: 'SKU-V-102',
        raw_input: '316 stainless steel ball valve 2 inch flanged ANSI 150# manual lever lockable model BV-316-2F',
        source: 'Supplier Catalog Web Page',
        mpn: 'BV-316-2F',
        brand: 'Apex Controls'
      },
      {
        raw_id: 'SKU-V-103',
        raw_input: 'High pressure needle valve 1/4" tube fitting 6000 PSI rating PTFE packing NV6000-02',
        source: 'PDF Catalog Datasheet',
        mpn: 'NV6000-02',
        brand: 'FlowTech'
      },
      {
        raw_id: 'SKU-V-104',
        raw_input: 'Pneumatic 5/2 directional control valve 24V DC solenoid spring return G 1/4 port IP65 rating',
        source: 'PDF Technical Specs',
        mpn: 'PV-52-24V',
        brand: 'PneuMax'
      },
      {
        raw_id: 'SKU-V-105',
        raw_input: 'Butterfly valve 4 inch lug type ductile iron body EPDM seat gear operator 200 PSI max',
        source: 'Unstructured Supplier Quote',
        mpn: 'BFV-L4-EP',
        brand: 'Apex Controls'
      },
      {
        raw_id: 'SKU-V-106',
        raw_input: 'Bronze check valve 1 inch NPT threaded swing type 200 WOG 125 WSP model CV-BR-100',
        source: 'Distributor API Feed',
        mpn: 'CV-BR-100',
        brand: 'FlowTech'
      }
    ]
  },
  {
    id: 'pumps_rotating',
    name: 'Heavy Industrial Pumps & Motors',
    count: 5,
    description: 'Scattered motor ratings, GPM/LPM conversions, head pressure metrics, TEFC enclosures.',
    items: [
      {
        raw_id: 'SKU-P-201',
        raw_input: 'Centrifugal pump 5 HP 230/460V 3-phase 1750 RPM 120 GPM max head 85 ft cast iron TEFC motor model CP-500-3P',
        source: 'Catalog Spec Sheet',
        mpn: 'CP-500-3P',
        brand: 'Titan Dynamics'
      },
      {
        raw_id: 'SKU-P-202',
        raw_input: 'Submersible sump pump 3/4 HP 115V 1-phase vertical float switch stainless casing 45 GPM model SSP-75V',
        source: 'Distributor API Feed',
        mpn: 'SSP-75V',
        brand: 'AquaShield'
      },
      {
        raw_id: 'SKU-P-203',
        raw_input: 'Positive displacement gear pump 15 GPM 100 PSI 1.5 HP explosion proof motor 1800 RPM Class 1 Div 1',
        source: 'PDF Spec Page 12',
        mpn: 'GP-15-XP',
        brand: 'Titan Dynamics'
      },
      {
        raw_id: 'SKU-P-204',
        raw_input: 'Chemical metering pump 30 GPD 100 PSI max 120V PVC head PTFE diaphragm 4-20mA control model CMP-30D',
        source: 'PDF Spec Sheet',
        mpn: 'CMP-30D',
        brand: 'ChemPro'
      },
      {
        raw_id: 'SKU-P-205',
        raw_input: 'Multi-stage vertical inline pump 10 HP 460V 3500 RPM 80 GPM 350 PSI 316SS impellers model VP-100-350',
        source: 'Engineering Datasheet',
        mpn: 'VP-100-350',
        brand: 'Titan Dynamics'
      }
    ]
  },
  {
    id: 'electrical_automation',
    name: 'Electrical Switchgear & Controls',
    count: 5,
    description: 'Voltage ratings, pole counts, interrupting capacity, DIN rail mounting, NEMA ratings.',
    items: [
      {
        raw_id: 'SKU-E-301',
        raw_input: '3 pole miniature circuit breaker 32 amp C curve 480Y/277V 10kA DIN rail mount model MCB3-32C',
        source: 'PDF Technical Datasheet',
        mpn: 'MCB3-32C',
        brand: 'ElectroGuard'
      },
      {
        raw_id: 'SKU-E-302',
        raw_input: 'Magnetic motor starter 3 phase 25A 230/460V coil NEMA 1 enclosure reset button model MS-3P-25A',
        source: 'Supplier Website URL',
        mpn: 'MS-3P-25A',
        brand: 'ElectroGuard'
      },
      {
        raw_id: 'SKU-E-303',
        raw_input: 'Industrial power supply 24VDC 10A 240W 120-240VAC input DIN rail mounted IP20 model PS24-10A',
        source: 'Catalog Spreadsheet',
        mpn: 'PS24-10A',
        brand: 'VoltTech'
      },
      {
        raw_id: 'SKU-E-304',
        raw_input: 'Variable frequency drive 10 HP 480V 3-phase input NEMA 1 VFD vector control Modbus RTU model VFD-480-10',
        source: 'PDF Tech Spec',
        mpn: 'VFD-480-10',
        brand: 'VoltTech'
      },
      {
        raw_id: 'SKU-E-305',
        raw_input: 'Solid state relay 50A 480VAC 3-32VDC input panel mount zero-cross switching model SSR-50A-DC',
        source: 'Distributor Catalog Page',
        mpn: 'SSR-50A-DC',
        brand: 'VoltTech'
      }
    ]
  },
  {
    id: 'bearings_motion',
    name: 'Bearings & Motion Controls',
    count: 4,
    description: 'Bore diameters, dynamic load ratings, seal types, lubrication specs.',
    items: [
      {
        raw_id: 'SKU-B-401',
        raw_input: 'Deep groove ball bearing 50mm bore 90mm OD 20mm width rubber seals C3 clearance 35kN dynamic load model 6210-2RS',
        source: 'Bearing Engineering Sheet',
        mpn: '6210-2RS',
        brand: 'PrecisionMotion'
      },
      {
        raw_id: 'SKU-B-402',
        raw_input: 'Pillow block bearing 1-1/2 inch shaft diameter cast iron housing set screw lock grease nipple model UCP208-24',
        source: 'Catalog Data Sheet',
        mpn: 'UCP208-24',
        brand: 'PrecisionMotion'
      },
      {
        raw_id: 'SKU-B-403',
        raw_input: 'Linear guide block 25mm rail size flange type high load capacity ball retainer model HGW25CC',
        source: 'PDF Tech Spec Pg 8',
        mpn: 'HGW25CC',
        brand: 'MotionMax'
      },
      {
        raw_id: 'SKU-B-404',
        raw_input: 'Tapered roller bearing set 2 in cone bore 3.25 in cup OD 0.85 in width chrome steel model SET-405',
        source: 'Supplier Feed',
        mpn: 'SET-405',
        brand: 'PrecisionMotion'
      }
    ]
  }
];
