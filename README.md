# Docker CI/CD Starter Platform 🚀
> **Cloud & DevOps Engineering Internship Portfolio Project**

A modern DevOps SaaS engineering dashboard for unified infrastructure telemetry, genuine host resource observability, and CI/CD workflow orchestration.

---

## 🏗️ Architecture Overview

The platform is designed across three structured engineering phases:

- **Phase 1: Frontend Dashboard UI** (React 19, TypeScript, Vite, Tailwind CSS, Lucide icons) — Complete.
- **Phase 2: Backend API & Frontend Integration** (Python, FastAPI, psutil, Pydantic, CORS, Structured Logging) — Complete.
- **Phase 3: Docker & CI/CD Pipelines** (Docker Compose, Daemon bindings, GitHub Actions, Trivy vulnerability gating) — Upcoming.

```
                      ┌──────────────────────────────────────────────┐
                      │    React 19 + TypeScript + Vite Dashboard    │
                      │         (http://localhost:5173)              │
                      └──────────────────────┬───────────────────────┘
                                             │ HTTP / REST (CORS)
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │             FastAPI Backend API              │
                      │         (http://localhost:8000)              │
                      └──────┬───────────────┬───────────────┬───────┘
                             │               │               │
                             ▼               ▼               ▼
                      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
                      │   psutil    │ │  CI/CD Run  │ │  Platform   │
                      │  Telemetry  │ │ Dispatcher  │ │ Audit Trail │
                      └─────────────┘ └─────────────┘ └─────────────┘
```

---

## 📡 Implemented API Endpoints (Phase 2)

All endpoints use Pydantic models with request tracing (`X-Request-ID`), structured logging, and error handling.

| Method | Endpoint | Description | Response Model |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime, component status, and operational health | `HealthResponse` |
| `GET` | `/api/version` | Public version, environment, and runtime metadata (never leaks secrets) | `VersionResponse` |
| `GET` | `/api/metrics` | Genuine host CPU, Memory, Disk, and Network telemetry via `psutil` | `MetricsResponse` |
| `GET` | `/api/pipeline` | Runner connectivity state or explicit unconfigured status | `PipelineStatusResponse` |
| `POST` | `/api/pipeline/dispatch` | Dispatch manual workflow execution test | `PipelineDispatchResponse` |
| `GET` | `/api/activity` | Chronological audit trail of deployments and platform events | `ActivityListResponse` |

> **Note**: For backward compatibility, all endpoints are also accessible under `/api/v1/*`. Interactive Swagger documentation is available at `http://localhost:8000/docs`.

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.11+
- **Node.js**: 20+ (with npm 10+)

---

### Step 1: Backend Setup & Execution

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell):
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Linux / macOS:
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional for development):
   ```bash
   # Windows:
   Copy-Item .env.example .env

   # Linux / macOS:
   cp .env.example .env
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend API will be live at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.
   Open **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** to inspect and test the interactive OpenAPI documentation.

---

### Step 2: Running the Backend Test Suite

The test suite covers response structures, error handling, CORS headers, and tracing middleware:

```bash
# With virtual environment activated:
pytest tests -v

# Or from workspace root:
npm run test:backend
```

---

### Step 3: Frontend Setup & Execution

1. Open a new terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:5173](http://localhost:5173)** in your browser.

4. To test production build:
   ```bash
   npm run build
   ```

---

## 🔐 Security & Configuration Guidelines

- **No Secrets in Code**: API keys, tokens, and passwords are never hardcoded or exposed in API endpoints.
- **Environment Variables**: Use `.env.example` as a template for configuring:
  - `CORS_ORIGINS`: Comma-separated list of allowed frontend origins (e.g. `http://localhost:5173,http://127.0.0.1:5173`).
  - `ENVIRONMENT`: `development` | `staging` | `production`.
  - `VITE_API_URL`: Root path of the backend API (defaults to `http://localhost:8000/api`).
- **No Invented Telemetry**: If a specific hardware metric or runner service is unsupported or unconfigured, the API explicitly returns `status: "unavailable"` or `status: "unconfigured"` rather than generating fabricated monitoring figures.

---

## 📂 Repository Structure

```
docker-cicd-starter/
├── backend/
│   ├── app/
│   │   ├── models/             # Pydantic schemas (health, metrics, pipeline, activity)
│   │   ├── routers/            # FastAPI endpoint handlers (/api/health, /metrics, etc.)
│   │   ├── services/           # psutil telemetry collector & pipeline dispatcher
│   │   ├── config.py           # Environment settings & CORS parsing
│   │   ├── logging_config.py   # Structured logging formatter
│   │   ├── middleware.py       # X-Request-ID and timing middleware
│   │   └── main.py             # FastAPI application definition
│   ├── tests/                  # Pytest test suite for all endpoints
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/         # DevOps dashboard components & charts
│   │   ├── pages/              # Overview, Pipelines, Containers, Logs, Settings
│   │   ├── services/api.ts     # Frontend API client communicating with FastAPI
│   │   ├── context/            # React state & live telemetry polling
│   │   └── types/              # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── .gitignore                  # Git exclusions for secrets, venv, and node_modules
├── .env.example                # Safe environment variable template
├── package.json                # Monorepo runner scripts
└── README.md
```
