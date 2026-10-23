import React, { useState } from 'react';
import {
  Settings,
  Server,
  Layers,
  ShieldCheck,
  Cpu,
  Key,
  Bell,
  RefreshCw,
  ExternalLink,
  Code,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const { apiOnline, checkBackendHealth } = useAppState();

  const [activeTab, setActiveTab] = useState<'project' | 'registry' | 'env' | 'notifications'>('project');
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Sample environment variables editor
  const [envVars, setEnvVars] = useState([
    { key: 'VITE_API_URL', value: 'http://localhost:8000/api/v1' },
    { key: 'DOCKER_HOST', value: 'unix:///var/run/docker.sock' },
    { key: 'GITHUB_REPOSITORY', value: 'portfolio/docker-cicd-starter' },
    { key: 'DEPLOY_ENV', value: 'production' },
  ]);

  const handleTestBackend = async () => {
    setIsTestingApi(true);
    setTestResult(null);
    await checkBackendHealth();
    setTimeout(() => {
      setIsTestingApi(false);
      setTestResult(
        apiOnline
          ? 'FastAPI backend is responsive and verified on port 8000.'
          : 'Backend not detected on localhost:8000. Running in Phase 1 Prototype Mode with mock telemetry.'
      );
    }, 600);
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
            <Badge variant="info" size="sm">
              DevOps Portfolio
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
              Designed as a production-grade infrastructure management dashboard for cloud-native applications. Provides unified visibility across container runtimes, multi-stage CI/CD workflows, automated vulnerability gates, and operational telemetry.
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
                </div>

                <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30">
                  <div className="text-purple-400 font-bold mb-1">Backend API (Phase 2)</div>
                  <div className="text-[11px] text-slate-400">
                    FastAPI · Python 3.12 · Docker SDK · Pydantic · AsyncIO
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-emerald-400 font-bold mb-1">Infra & CI/CD (Phase 3)</div>
                  <div className="text-[11px] text-slate-400">
                    Docker Compose · GitHub Actions · Trivy Scanner · Nginx
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostics & API Connectivity Test */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">API Connection Diagnostic</span>
                <span className="text-[11px] text-slate-400">
                  Test readiness for Phase 2 FastAPI integration endpoint (http://localhost:8000/api/v1)
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                isLoading={isTestingApi}
                onClick={handleTestBackend}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Test API Status
              </Button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                  apiOnline
                    ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-950/30 border border-amber-500/30 text-amber-300'
                }`}
              >
                {apiOnline ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{testResult}</span>
              </div>
            )}
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0d1424]/90 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Planned FastAPI Endpoints (Phase 2 Contract)
              </h4>
              <ul className="text-xs font-mono text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <span className="text-slate-300">/api/v1/health</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <span className="text-slate-300">/api/v1/metrics/summary</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <span className="text-slate-300">/api/v1/docker/containers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">POST</span>
                  <span className="text-slate-300">/api/v1/docker/containers/{'{id}'}/start</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">POST</span>
                  <span className="text-slate-300">/api/v1/pipeline/dispatch</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#0d1424]/90 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                DevOps Security & Compliance
              </h4>
              <ul className="text-xs font-mono text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Trivy Static Vulnerability Gate
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Non-root Docker container user execution
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Multi-stage cache optimization layers
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> GitHub Actions golden path workflow
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="p-6 rounded-2xl bg-[#0d1424]/90 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-semibold text-white">Docker Hub / GHCR Registry Configuration</h3>
          <p className="text-xs text-slate-400">
            Configure authentication credentials for pulling base images and publishing tagged production artifacts.
          </p>

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
                defaultValue="portfolio-devops"
                className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Personal Access Token (PAT) / Secret</label>
              <input
                type="password"
                defaultValue="ghp_98a7sdf68a7sd8f6a8sd7f6a8sdf"
                className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Save Registry Credentials
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'env' && (
        <div className="p-6 rounded-2xl bg-[#0d1424]/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Platform Environment Variables</h3>
              <p className="text-xs text-slate-400">Dynamic configuration injected into containers</p>
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Apply Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
