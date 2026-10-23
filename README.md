# Docker CI/CD Starter Platform 🚀
> **Cloud & DevOps Engineering Internship Portfolio Project**

A modern DevOps SaaS engineering dashboard for unified container infrastructure observability, CI/CD pipeline orchestration, and security compliance gating.

---

## 📌 Phase 1: Frontend Dashboard UI Implementation

In this first phase, the focus is strictly on **UI/UX excellence, responsive layout design, and component architecture**, setting the foundation for future FastAPI integration and container runtime bindings.

### 🌟 Key Features

1. **Overview Dashboard**
   - **System Telemetry Cards**: CPU utilization (34%), Memory allocation (12.4 / 16 GB), Disk I/O (247 MB/s), and Network throughput (1.8 Gbps).
   - **Traffic Overview Chart**: Bezier-curved area chart displaying hourly HTTP, HTTPS, and API request curves.
   - **Request Distribution**: Circular donut chart breaking down 1.2M requests across status codes (`2xx`, `3xx`, `4xx`, `5xx`).
   - **Runtime & Services Grid**: Health status, metrics, and micro-sparklines for MySQL, PHP-FPM, Node.js, and Python FastAPI.
   - **Environment Fleet Cards**: Deployed tags, instance counts, and release actors across Dev, Staging, and Production.

2. **CI/CD Pipeline Visualization**
   - **"Path to Production" Stage Graph**: Visual multi-stage execution model (Build ➔ Ephemeral Runner ➔ Parallel Functional & Non-Functional Scans ➔ Integration Test ➔ Release Gates).
   - **Pipeline Runs Table**: Status badges (`SUCCESS`, `RUNNING`, `FAILED`), commit SHAs, git branch names, trigger info, authors, and duration timers.
   - **Stage Inspector & Re-run Trigger**: Detailed modal with step execution timelines, log output snippets, and re-run triggers.

3. **Docker Containers & Images**
   - **Docker Engine Banner**: Engine version `28.3.2`, architecture `linux / aarch64`, active container ratio, and quick bulk controls (`Start All Stopped`, `Stop All Running`).
   - **Containers Table**: Interactive state toggling (Start/Stop/Restart), port bindings, health checks, uptime status, and environment inspection modal.
   - **Images Table**: Cached image repository list, tags, disk footprint, and Trivy vulnerability scan statuses.

4. **Activity & Live Logs**
   - **Terminal Log Viewer**: Real-time autoscrolling terminal with line numbers, timestamp precision, log levels (`INFO`, `WARN`, `ERROR`, `DEBUG`), service filters, and search regex.
   - **Log Actions**: Download `.log` file, copy to clipboard, clear buffer, and pause/resume stream.
   - **Audit Trail Timeline**: Event markers for deployments, security audits, container restarts, and manual pipeline triggers.

5. **Settings & Project Specification**
   - **Portfolio Architecture Diagram**: Clear blueprint outlining Frontend (Phase 1) ➔ FastAPI REST API (Phase 2) ➔ Docker Compose & GitHub Actions (Phase 3).
   - **Backend Connectivity Tester**: Live ping button to test communication with the future FastAPI backend on `http://localhost:8000/api/v1/health` with graceful fallback to mock mode.
   - **Registry & Environment Editor**: Form configuration for GHCR/Docker Hub credentials and runtime environment variable keys.

---

## 📂 Proposed Frontend Folder Structure

```
docker-cicd-starter/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Reusable UI elements (Button, Badge, Card, StatCard, Modal, EmptyState)
│   │   │   ├── layout/             # Shell, Sidebar, TopNav, CommandPalette
│   │   │   ├── charts/             # ResourceAreaChart, RequestDonutChart, Sparkline
│   │   │   ├── pipeline/           # PipelineVisualizer, PipelineRunsTable, PipelineRunDrawer, TriggerPipelineModal
│   │   │   ├── docker/             # DockerEngineBanner, ContainerTable, ImageTable, ContainerDetailModal
│   │   │   └── logs/               # LogViewer, ActivityTimeline
│   │   ├── pages/
│   │   │   ├── OverviewPage.tsx    # Primary operations and telemetry view
│   │   │   ├── PipelinePage.tsx    # "Path to Production" pipeline visualizer
│   │   │   ├── ContainersPage.tsx  # Docker containers & images manager
│   │   │   ├── LogsPage.tsx        # Real-time console logs and audit feed
│   │   │   └── SettingsPage.tsx    # Architecture blueprint & API specs
│   │   ├── context/
│   │   │   └── AppStateContext.tsx # Central state management for interactive simulation
│   │   ├── services/
│   │   │   ├── api.ts              # Contract client ready for FastAPI integration
│   │   │   └── mockData.ts         # High-fidelity realistic DevOps sample data
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript definitions for containers, pipelines, metrics
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css               # Tailwind CSS v4 custom theme
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── package.json                    # Monorepo root runner
└── README.md
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (Deep navy palette `#080c14`, cyan/emerald/purple accents)
- **Icons**: Lucide React
- **Architecture**: Modular service layer with async client interface for future FastAPI backend

---

## 🚀 Running the Project

### Development Server
```bash
# From workspace root:
npm run dev

# Or directly in frontend/:
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Production Build
```bash
npm run build
```
The production bundle compiles into `frontend/dist`.

---

## 🧭 Navigation & Shortcuts

- **Ctrl + K**: Opens the global Command Palette to quickly search containers, dispatch pipelines, and jump between dashboard views.
- **Run Pipeline**: Click the button in the top bar or header to trigger a new custom workflow run.
- **Container Lifecycle**: Click Play / Stop / Restart on any container row to dynamically update container states and engine counters.
- **Inspect**: Click on any pipeline run or container row to open the detailed drawer modal.
