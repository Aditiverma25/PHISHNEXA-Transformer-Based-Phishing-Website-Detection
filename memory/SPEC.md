# PHISHNEXA Specifications & Living Spec

## App Overview
PHISHNEXA is a cybersecurity AI web platform ("Transformer Intelligence for Safer Web Navigation") designed to analyze URLs and classify them as PHISHING, LEGITIMATE, or SUSPICIOUS using simulated Transformer representations (DistilBERT default, BERT-base, RoBERTa-large) fused with rich structural, lexical, homoglyph, and entropy features.

## Architecture
- **Backend**: FastAPI (`/api/*`), Pydantic v2 models, Motor (async MongoDB), `lib/url_analyzer.py` for live feature extraction and simulated attention weighting.
- **Frontend**: Vite + React 19 + TypeScript strict + Tailwind v4 + shadcn/ui + Motion animations + Recharts.
- **Authentication**: Email/Password + Google simulation. 1-scan demo allowance for unauthenticated users, after which full SOC login is prompted.
- **Database Collections**: `users`, `scans`, `feedback`.

## Key Features & Endpoints
1. **URL Scanner**:
   - `POST /api/predict` or `POST /api/scan`: Accepts `{ url, model, user_id, save_history }`, returns complete classification verdict, animated risk gauge (0-100), confidence, multi-stage stages, threat indicators, token attention matrix, explainable counterfactuals, and novelty/robustness scores.
2. **Scan History & Saved Reports**:
   - `GET /api/scans`: Filter by prediction (ALL, PHISHING, LEGITIMATE, SUSPICIOUS), search by query, sort by risk or date.
   - `GET /api/scans/{id}`: Single scan inspection.
   - `DELETE /api/scans/{id}`: Removal.
   - `POST /api/scans/{id}/feedback`: User feedback logging (`correct` / `incorrect`) stored in isolated `feedback` collection.
3. **Batch URL Scanner**:
   - `POST /api/batch/scan`: Bulk URL classification with progress indicator, stats, and CSV/JSON export.
4. **Side-by-Side Comparison**:
   - Visual diff between 2 URLs for structural, token, and risk deltas.
5. **Research & Benchmarks**:
   - `GET /api/benchmarks`: Model metrics for DistilBERT, BERT, RoBERTa, Confusion Matrices, ROC Curves, Precision-Recall Curves, and Feature Fusion importance. Labeled "Demo Evaluation Data".
6. **Cybersecurity Research Labs**:
   - `POST /api/labs/adversarial`: Safe perturbation test simulator.
   - `POST /api/labs/homograph`: Unicode/Punycode homoglyph breakdown.
   - `GET /api/labs/drift`: Concept and adversarial drift monitor.
   - `GET /api/labs/campaigns`: Clustered phishing campaigns.
7. **Auth & Profile**:
   - `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/google`, `GET /api/auth/me`, `POST /api/auth/logout`, `POST /api/auth/reset-request`.
