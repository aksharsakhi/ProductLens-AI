# UniHack 2026 Submission Details

Copy and paste the following sections directly into your hackathon submission form:

## Provide a brief overview of your solution and how it solves the problem:

**ProductLens AI: Enterprise Catalog Intelligence Engine**

Our solution solves the massive data inconsistency and unstructured data problems plaguing B2B e-commerce platforms. Unilog’s clients deal with raw, unstandardized product data from thousands of suppliers, leading to poor taxonomy classification, inconsistent attribute extraction, and unoptimized product titles.

**ProductLens AI** acts as an end-to-end autonomous pipeline that instantly transforms raw supplier text into commerce-ready catalog records. It features a dual-engine architecture:
1. **Heuristic Engine (Offline Mode)**: A 27-factor NLP extractor paired with a 200+ industry-term synonym resolver (e.g., converting "SS 316" to "316 Stainless Steel") and a weighted UNSPSC v25.0 classifier.
2. **Gemini AI Engine**: Direct integration with Google's Gemini LLM for deep semantic extraction, automated SEO-optimized title generation, and rich HTML product description writing.

**Key Features:**
- **Dynamic Data Processing**: Not hardcoded or mocked. Handles completely unseen datasets natively.
- **Enterprise-Grade Validation**: 9-factor weighted quality scoring system that flags anomalies based on mandatory attributes for specific product categories (e.g., Motors must have Horsepower; Valves must have Port Size).
- **Physics Unit Normalization**: Automatically standardizes measurements (e.g., PSI to Bar, inches to mm).
- **Explainable AI (XAI)**: Generates a complete reasoning audit trail for every enriched product, showing exactly how and why data was modified.
- **Deployment Ready**: Features Role-Based Access Control (RBAC), offline persistence (IndexedDB), Docker containerization, and PDF/XLSX export mechanisms matching Unilog's static expected headers exactly.

By fully automating taxonomy, extraction, and standardization, ProductLens AI eliminates hundreds of hours of manual catalog QA, accelerating time-to-market for Unilog's clients.

---

## Share the link to your live prototype demonstrating the core functionality:

**https://aksharsakhi.github.io/ProductLens-AI/**

*(Note: Click "Setup Real AI" at the top right and enter a free Google Gemini API key to unlock the LLM features, or proceed with the built-in offline Heuristic NLP Engine).*

---

## Share the GitHub Repository link:

**https://github.com/aksharsakhi/ProductLens-AI**

---

## Presentation & Demo Instructions:
- **Presentation Deck**: You can use the `ProductLens_AI_Presentation.pptx` / PDF generated in the previous step for your "Prototype deck/presentation".
- **Demo Video**: You will need to record a quick 2-3 minute loom/screen recording showing you logging in as Admin, hitting "Load All Datasets", and exporting the XLSX/PDF.
