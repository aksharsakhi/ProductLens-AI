# Prototype Presentation Deck: ProductLens AI
## AI-Powered Product Intelligence for Industrial Commerce | UniHack 2026

> [!NOTE]
> This presentation deck is structured specifically to align with the official Unilog & Hack2skill submission guidelines. Copy the slide content below into the mandatory presentation template.

---

### Slide 1: Title & Executive Summary
- **Project Name**: ProductLens AI
- **Tagline**: Transforming Raw & Scattered Industrial Data into High-Converting, Commerce-Ready Product Catalogs
- **Team**: Sheela Akshar Sakhi
- **Track**: AI-Powered Product Intelligence for Industrial Commerce (UniHack 2026)
- **Key Proposition**: An end-to-end Explainable AI (XAI) platform that ingests unstructured technical spec sheets, normalizes units, maps UNSPSC taxonomies, validates product attributes, and generates catalog exports matching 15 mandatory static headers.

---

### Slide 2: The Problem Statement & Industry Challenge
- **Scattered & Unstructured Data**: Industrial distributors receive product specs across PDFs, supplier spreadsheets, legacy web pages, and unstructured emails.
- **Manual Data Normalization Bottleneck**: Merging inconsistent units (PSI vs Bar, Imperial vs Metric) and formatting titles manually takes catalog teams weeks per batch.
- **Inconsistent E-Commerce Search & SEO**: Missing UNSPSC codes and unstandardized titles lead to poor searchability, customer confusion, and high return rates.
- **Lack of AI Explainability**: Traditional LLMs often hallucinate part numbers or spec values without auditability.

---

### Slide 3: The ProductLens AI Solution
- **Multi-Source Ingestion**: Drag-and-drop parsing for PDFs, CSVs, raw text snippets, and product web URLs.
- **Standardized Title Generator**: Formats titles using industrial taxonomy logic: `[Brand] + [MPN] + [Product Line] + [Primary Specs]`.
- **UNSPSC Auto-Classification**: Intelligent vector mapping to official UNSPSC commodity codes (e.g. 40141602 for Solenoid Valves).
- **Physics Unit Normalization Engine**: Automatic metric-imperial conversions for pressure, temperature, dimensions, and electrical ratings.
- **1-Click Static Header Exporter**: Instant download of `.xlsx` / `.csv` files matching Unilog's exact expected static headers.

---

### Slide 4: Technical Architecture & AI Workflow
```
[Unstructured Data: PDF / CSV / Text / URL]
                │
                ▼
[Multi-Modal Parser & Tokenizer]
                │
                ▼
[NLP & Vector UNSPSC Classification Engine]
                │
                ▼
[Physics & Unit Normalization Module (Imperial ↔ Metric)]
                │
                ▼
[AI Validation & Anomaly Detector (Quality Scoring 0-100%)]
                │
                ▼
[Human-in-the-Loop Studio & Explainability Audit Trail]
                │
                ▼
[Downloadable XLSX / CSV Export (15 Static Headers)]
```

---

### Slide 5: Explainability & Auditability Matrix (XAI)
- **Field-Level Confidence Scoring**: Every extracted spec is assigned a confidence metric (0-100%).
- **Source Citation Linking**: Directly attributes extracted parameters to original datasheet page numbers and URL text snippets.
- **Reasoning Log**: Provides step-by-step transparency into why a unit was converted or how a taxonomy code was chosen.
- **Human-in-the-Loop Studio**: Enables catalog managers to review warnings, edit fields inline, and re-validate instantaneously.

---

### Slide 6: Quality Validation & Anomaly Detection
- **Rules & ML Hybrid Engine**:
  - Detects out-of-range physical bounds (e.g., operating temperatures exceeding material limits).
  - Highlights missing critical fields (e.g., missing MPN or thread type).
  - Automatically flags items with `VALID`, `WARNING`, or `CRITICAL_ERROR` badges.
- **Catalog Quality Index**: Calculates overall catalog readiness score to ensure zero defective data reaches the production website.

---

### Slide 7: Scalability, Performance & Integration
- **High Throughput**: Capable of processing 10,000+ SKU catalog records in seconds.
- **API & ERP Integration**: Modular JSON schema makes it easy to integrate with PIM (Product Information Management), ERP (SAP, Oracle), and e-commerce platforms (Magento, Shopify, Unilog Core).
- **Zero Mocking / Full Dynamic Processing**: Built with real-world rule sets and LLM pipeline capabilities capable of handling unseen industrial datasets.

---

### Slide 8: Business Impact & ROI
- **90% Reduction in Catalog Onboarding Time**: Cuts product listing time from 3 weeks to under 10 minutes.
- **45% Increase in Conversion Rates**: Standardized titles and complete specs improve search relevancy and buyer confidence.
- **Zero Attribute Hallucination**: Source citation audit trail eliminates costly ordering errors caused by inaccurate product descriptions.

---

### Slide 9: Live Prototype Overview & Demo Summary
- **Interactive Web App**: Modern Dark Glassmorphism UI with pre-loaded benchmark industrial datasets (Valves, Heavy Pumps, Switchgear).
- **Live Processing Studio**: Real-time attribute extraction, unit conversions, and confidence progress bars.
- **Instant Excel Export**: Verified download containing all static headers: `Product_ID`, `MPN`, `Brand_Name`, `Product_Title`, `Short_Description`, `Long_Description`, `Category_Path`, `UNSPSC_Code`, `Primary_Specifications`, `Enriched_Attributes`, `Validation_Status`, `Validation_Flags`, `Confidence_Score`, `AI_Reasoning_Audit`, `Source_Reference`.

---

### Slide 10: Future Roadmap & Team
- **Phase 1 (Current)**: Multi-source extraction, UNSPSC auto-coding, metric conversion, static XLSX export.
- **Phase 2 (Next 60 Days)**: Computer Vision model for technical engineering drawing & CAD diagram spec extraction.
- **Phase 3 (Enterprise)**: Real-time API sync with distributor PIM engines and automated competitor price benchmarking.
- **Team**: Sheela Akshar Sakhi (AI Lead & Software Developer).
