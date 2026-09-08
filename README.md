# URL Verdict AI (PhishNexa) 🛡️🔍

An AI-powered Phishing & Malicious URL Detection & Verdict Platform designed for SOC analysts and security teams.

## 🌟 Key Features

- **Real-time URL Scanning**: Instant detection of phishing, malware, and suspicious link parameters.
- **Deep Technical Analysis**: Risk score breakdown, domain intelligence, SSL certificate inspection, and entropy scoring.
- **Batch Processing & Lab Workbench**: Upload URL lists and test suspicious indicators in sandbox environments.
- **Interactive SOC Dashboard**: Complete incident history, threat classification graphs, and exportable security reports.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS / Modern CSS design system
- **Backend**: FastAPI (Python) + MongoDB (Motor async client)
- **AI/ML Engine**: Feature extraction pipelines for URL heuristics, domain age, structural lexical features, and threat scores.

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python seed.py # Seed initial demo data
python server.py # Starts FastAPI server on http://localhost:8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev # Starts Vite dev server on http://localhost:5173
```

## 📜 License

MIT License
