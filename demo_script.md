# Video Demo Script & Recording Walkthrough: ProductLens AI
## UniHack 2026 Submission Deliverable

> [!TIP]
> Use this script to record your 2-to-3 minute demo video for Hack2skill evaluation. Follow the timeline and talking points below for maximum score.

---

### Video Overview
- **Target Duration**: 2 Minutes 30 Seconds
- **Screen Focus**: Full screen recording of ProductLens AI web application in action.
- **Tone**: Professional, clear, authoritative, and energetic.

---

### Minute-by-Minute Script & Actions

#### [0:00 - 0:30] Introduction & Problem Overview
- **Screen Action**: Show the UniHack problem statement briefly, then switch to the landing view of ProductLens AI with the dark glassmorphism dashboard.
- **Voiceover**:
  > "Hello evaluators! Today, industrial e-commerce companies handle millions of technical products scattered across PDF datasheets, supplier feeds, and raw catalogs. Manually structuring and validating this data takes weeks and leads to costly errors. Welcome to **ProductLens AI** — our AI-powered product intelligence engine built for UniHack 2026."

---

#### [0:30 - 1:15] Data Ingestion & Real-Time AI Enrichment
- **Screen Action**: 
  1. Click on **Presets & Benchmarks** -> Select **Industrial Valves & Fluid Control**.
  2. Watch the catalog table instantly populate with raw items being converted into standardized titles, mapped UNSPSC codes, and normalized units.
  3. Next, switch to **Paste Unstructured Text** subtab. Paste a messy spec string like:
     `3-way stainless steel valve 3/4 inch NPT 3000 PSI 24VDC explosion proof model EX-34-3K`
  4. Click **Enrich Single Item**. Show how it appears live at the top of the table.
- **Voiceover**:
  > "ProductLens AI ingests data from any source — whether CSVs, technical PDFs, or raw text. With one click, our AI engine automatically generates compliant e-commerce titles, converts Imperial measurements like 3000 PSI and 3/4 inch into standardized Metric values, and maps products to official UNSPSC commodity codes."

---

#### [1:15 - 1:55] Explainability (XAI) & Validation Audit
- **Screen Action**:
  1. Click the **Audit AI** button on any product row.
  2. Show the pop-up modal with:
     - Confidence score % (e.g. 96%).
     - Side-by-side comparison of original raw input vs enriched e-commerce fields.
     - Unit normalization breakdown (Imperial $\rightarrow$ Metric).
     - LLM Reasoning Trace & Source Document Citation.
  3. Edit a field inline (e.g., tweak title or UNSPSC code) and click **Save & Re-Validate**.
- **Voiceover**:
  > "Unlike black-box AI models, ProductLens AI provides total explainability. Clicking 'Audit AI' opens our Human-in-the-Loop Studio. Here, catalog managers can trace exact source citations, inspect step-by-step LLM reasoning logs, verify unit conversions, and edit fields inline with instant re-validation."

---

#### [1:55 - 2:30] Static Header Verification & Excel Export
- **Screen Action**:
  1. Click **Export Expected XLSX** in the header.
  2. Show the Export Modal listing all **15 static expected output headers** (`Product_ID`, `MPN`, `Brand_Name`, `Product_Title`, `Short_Description`, `Long_Description`, `Category_Path`, `UNSPSC_Code`, `Primary_Specifications`, `Enriched_Attributes`, `Validation_Status`, `Validation_Flags`, `Confidence_Score`, `AI_Reasoning_Audit`, `Source_Reference`).
  3. Click **Download Enriched XLSX**. Confetti triggers on screen!
  4. Briefly open the downloaded Excel file to show the perfectly populated columns.
- **Voiceover**:
  > "Finally, we export the structured catalog. ProductLens AI guarantees strict adherence to Unilog's static expected output headers. With one click, catalog managers download a commerce-ready XLSX or CSV sheet ready for direct PIM integration. Thank you for watching!"

---

### Recording Checklist for Presenter
- [x] Microphone audio is crisp and clear.
- [x] Browser resolution set to 1920x1080.
- [x] Pre-load demo dataset before starting recording.
- [x] Keep video under 3 minutes.
