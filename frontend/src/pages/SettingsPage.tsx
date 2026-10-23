import React, { useState } from 'react';
import {
  Server,
  Layers,
  ShieldCheck,
  Cpu,
  RefreshCw,
  ExternalLink,
  Code,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  Terminal,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';

interface EndpointCheckResult {
  endpoint: string;
  status: 'ok' | 'error' | 'pending';
  code: number;
  latencyMs: number;
  message: string;
}

export const SettingsPage: React.FC = () => {
  const { apiOnline, backendLatencyMs, backendVersion, checkBackendHealth } = useAppState();

  const [activeTab, setActiveTab] = useState<'project' | 'endpoints' | 'registry' | 'env'>('project');
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [endpointResults, setEndpointResults] = useState<EndpointCheckResult[]>([]);

  // Safe environment variables editor
  const [envVars, setEnvVars] = useState([
    { key: 'VITE_API_URL', value: 'http://localhost:8000/api' },
    { key: 'API_HOST', value: '127.0.0.1' },
    { key: 'API_PORT', value: '8000' },
    { key: 'CORS_ORIGINS', value: 'http://localhost:5173,http://127.0.0.1:5173' },
    { key: 'ENVIRONMENT', value: 'development' },
  ]);

  const handleTestBackend = async () => {
    setIsTestingApi(true);
    const endpointsToTest = [
      '/health',
      '/version',
      '/metrics',
      '/pipeline',
      '/activity',
    ];

    const results: EndpointCheckResult[] = [];
    const baseUrl = api.getBaseUrl();

    for (const ep of endpointsToTest) {
      const start = performance.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${baseUrl}${ep}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const latency = Math.round(performance.now() - start);

        results.push({
          endpoint: `/api${ep}`,
          status: res.ok ? 'ok' : 'error',
          code: res.status,
          latencyMs: latency,
          message: res.ok ? 'Operational' : `HTTP ${res.statusText}`,
        });
      } catch (err: any) {
        results.push({
          endpoint: `/api${ep}`,
          status: 'error',
          code: 0,
          latencyMs: 0,
          message: 'Connection refused / offline',
        });
      }
    }

    setEndpointResults(results);
    await checkBackendHealth();
    setIsTestingApi(false);
  };

  const handleAddEnv = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const handleRemoveEnv = (index: number) => {
    setEnvVars(envVars.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Settings & Project Specification
            </h1>
            <Badge variant={apiOnline ? 'success' : 'info'} size="sm" dot={apiOnline}>
              {apiOnline ? `FastAPI v${backendVersion}` : 'Phase 2 Architecture'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            System configuration, CI/CD pipeline registry credentials, and technical architecture spec
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('project')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'project'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Architecture & Spec
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'endpoints'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Backend Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'registry'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Container Registry
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'env'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Environment Config
          </button>
        </div>
      </div>

      {activeTab === 'project' && (
        <div className="space-y-6">
          {/* Portfolio Overview Card */}
          <div className="p-6 rounded-2xl bg-[#0d1424]/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Docker CI/CD Starter Platform</h3>
                <p className="text-xs text-slate-400">
                  Cloud/DevOps Engineering Internship Portfolio Project
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Production-grade infrastructure observability and CI/CD workflow orchestration.
              Phase 1 completed the React + Vite dashboard; Phase 2 implements the Python FastAPI backend, genuine psutil hardware metrics, structured logging, and CORS integration.
            </p>

            {/* Architecture Flow Diagram */}
            <div className="p-4 rounded-xl bg-[#090f1d] border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Full-Stack Architecture Plan
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
                  <div className="text-cyan-400 font-bold mb-1">Frontend (Phase 1)</div>
                  <div className="text-[11px] text-slate-400">
                    React 19 · TypeScript · Vite · Tailwind CSS · Lucide
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Completed</div>
                </div>

                <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30">
                  <div className="text-purple-400 font-bold mb-1">Backend API (Phase 2)</div>
                  <div className="text-[11px] text-slate-400">
                    FastAPI · Python 3.11 · psutil · Pydantic · CORS
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Implemented & Integrated</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                  <div className="text-slate-400 font-bold mb-1">Infra & CI/CD (Phase 3)</div>
                  <div className="text-[11px] text-slate-400">
                    Docker Compose · GitHub Actions · Trivy Scanner · Nginx
                  </div>
                  <div className="text-[10px] text-amber-400 mt-1 font-semibold">Upcoming Next Phase</div>
                </div>
              </div>
            </div>

            {/* How to run backend instructions */}
            <div className="p-4 rounded-xl bg-black/40 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <Terminal className="w-4 h-4" />
                <span>Commands to Run Backend Locally:</span>
              </div>
              <div className="text-slate-300 space-y-1 text-[11px] pl-2 border-l border-slate-700">
                <p># 1. Activate virtual environment</p>
                <p className="text-cyan-300 font-bold">backend\.venv\Scripts\activate  # Windows</p>
                <p className="text-slate-400"># or: source backend/.venv/bin/activate  # Linux/macOS</p>
                <p className="pt-1"># 2. Run the FastAPI development server with reload</p>
                <p className="text-emerald-300 font-bold">uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload</p>
                <p className="text-slate-400"># Or from workspace root:</p>
                <p className="text-slate-300">python -m uvicorn app.main:app --app-dir backend --reload</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'endpoints' && (
        <div className="p-6 rounded-2xl bg-[#0d1424]/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">FastAPI Endpoints Diagnostic</h3>
              <p className="text-xs text-slate-400">
                Ping each implemented endpoint to verify response status and latency
              </p>
            </div>

            <Button
              variant="glow"
              size="sm"
              isLoading={isTestingApi}
              onClick={handleTestBackend}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Run Endpoints Diagnostic
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Endpoint</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {[
                  { ep: '/api/health', desc: 'Process uptime and service health' },
                  { ep: '/api/version', desc: 'Application metadata & safe environment info' },
                  { ep: '/api/metrics', desc: 'Genuine CPU, RAM, Disk, and Network via psutil' },
                  { ep: '/api/pipeline', desc: 'Runner connectivity & workflow history' },
                  { ep: '/api/activity', desc: 'Audit trail of platform events' },
                ].map((row, idx) => {
                  const check = endpointResults.find((r) => r.endpoint === row.ep);
                  return (
                    <tr key={idx} className="hover:bg-slate-850/50">
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-bold">GET</span>
                      </td>
                      <td className="py-3 px-3 text-cyan-300 font-semibold">{row.ep}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{row.desc}</td>
                      <td className="py-3 px-3 text-center">
                        {check ? (
                          check.status === 'ok' ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px]">
                              HTTP {check.code} OK
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px]">
                              Offline
                            </span>
                          )
                        ) : apiOnline ? (
                          <span className="text-slate-400 text-[11px]">Ready to test</span>
                        ) : (
                          <span className="text-amber-400 text-[11px]">Standby (Mock Mode)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400">
                        {check && check.status === 'ok' ? `${check.latencyMs}ms` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="p-6 rounded-2xl bg-[#0d1424]/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Docker Hub / GHCR Registry Configuration</h3>
              <p className="text-xs text-slate-400">
                Phase 3 configuration for pulling base images and publishing production containers.
              </p>
            </div>
            <Badge variant="neutral" size="sm">Phase 3 Ready</Badge>
          </div>

          <div className="space-y-4 max-w-lg font-mono text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Registry URL</label>
              <input
                type="text"
                defaultValue="ghcr.io"
                className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Username / Organization</label>
              <input
                type="text"
                defaultValue="nisa2003-ops"
                className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Personal Access Token (PAT) / Secret</label>
              <input
                type="password"
                defaultValue="ghp_****************************"
                disabled
                className="w-full bg-[#080d19] border border-slate-800 text-slate-500 rounded-lg px-3 py-2 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Tokens are securely passed via environment variables, never committed.</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'env' && (
        <div className="p-6 rounded-2xl bg-[#0d1424]/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Platform Environment Variables</h3>
              <p className="text-xs text-slate-400">Non-sensitive configuration parameters (safe preview)</p>
            </div>
            <Button
              variant="secondary"
              size="xs"
              onClick={handleAddEnv}
              leftIcon={<Plus className="w-3 h-3" />}
            >
              Add Variable
            </Button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {envVars.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="KEY"
                  value={item.key}
                  onChange={(e) => {
                    const copy = [...envVars];
                    copy[idx].key = e.target.value;
                    setEnvVars(copy);
                  }}
                  className="w-1/3 bg-[#080d19] border border-slate-700 rounded-lg px-3 py-1.5 text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="VALUE"
                  value={item.value}
                  onChange={(e) => {
                    const copy = [...envVars];
                    copy[idx].value = e.target.value;
                    setEnvVars(copy);
                  }}
                  className="flex-1 bg-[#080d19] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleRemoveEnv(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
