import {
  SystemMetrics,
  ServiceRuntime,
  PipelineRun,
  DockerContainer,
  DockerImage,
  DockerEngineInfo,
  LogEntry,
  ActivityEvent,
  EnvironmentDeployment,
} from '../types';
import {
  INITIAL_SYSTEM_METRICS,
  INITIAL_SERVICES,
  INITIAL_PIPELINE_RUNS,
  INITIAL_CONTAINERS,
  INITIAL_IMAGES,
  INITIAL_DOCKER_ENGINE,
  INITIAL_LOGS,
  INITIAL_ACTIVITIES,
  INITIAL_ENVIRONMENTS,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * DevOps Platform API Service
 * Built with a clean interface that easily toggles between
 * Phase 1 Mock/Prototype Data and Phase 2 FastAPI Backend endpoints.
 */
class DevOpsApiService {
  private isBackendOnline: boolean = false;

  public async checkApiHealth(): Promise<{ online: boolean; latencyMs: number; version?: string }> {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        this.isBackendOnline = true;
        const latencyMs = Math.round(performance.now() - start);
        return { online: true, latencyMs, version: '1.0.0-fastapi' };
      }
    } catch {
      // Backend not running in Phase 1 - graceful fallback to mock mode
      this.isBackendOnline = false;
    }
    return { online: false, latencyMs: 0 };
  }

  public getBackendStatus(): boolean {
    return this.isBackendOnline;
  }

  // System Metrics
  public async getMetrics(): Promise<SystemMetrics> {
    return { ...INITIAL_SYSTEM_METRICS };
  }

  public async getServices(): Promise<ServiceRuntime[]> {
    return [...INITIAL_SERVICES];
  }

  public async getEnvironments(): Promise<EnvironmentDeployment[]> {
    return [...INITIAL_ENVIRONMENTS];
  }

  // Pipeline Runs
  public async getPipelineRuns(): Promise<PipelineRun[]> {
    return [...INITIAL_PIPELINE_RUNS];
  }

  public async triggerPipeline(pipelineName: string, branch: string): Promise<PipelineRun> {
    const newRun: PipelineRun = {
      id: `pipe-run-${Date.now()}`,
      pipelineName,
      runNumber: Math.floor(Math.random() * 50) + 143,
      status: 'running',
      branch,
      commitHash: Math.random().toString(16).substring(2, 9),
      commitMessage: `Triggered manual build on ${branch}`,
      author: {
        name: 'Portfolio Admin',
        username: 'admin',
      },
      triggerType: 'Manual',
      startedAt: 'Just now',
      duration: '0m 05s',
      stages: [
        {
          id: `stg-b-${Date.now()}`,
          name: 'Build',
          group: 'Fast Feedback',
          status: 'running',
          durationSeconds: 5,
          version: '0.1.17',
          steps: [
            { id: 's-init', name: 'Initialize runner', status: 'success', durationSeconds: 2 },
            { id: 's-build', name: 'Docker build --target production', status: 'running', durationSeconds: 3 },
          ],
        },
      ],
    };
    return newRun;
  }

  // Docker Operations
  public async getDockerEngineInfo(): Promise<DockerEngineInfo> {
    return { ...INITIAL_DOCKER_ENGINE };
  }

  public async getContainers(): Promise<DockerContainer[]> {
    return [...INITIAL_CONTAINERS];
  }

  public async getImages(): Promise<DockerImage[]> {
    return [...INITIAL_IMAGES];
  }

  public async toggleContainerState(containerId: string, action: 'start' | 'stop' | 'restart'): Promise<void> {
    console.info(`[API Action] Container ${containerId}: ${action}`);
  }

  // Logs & Activity
  public async getLogs(filter?: { level?: string; service?: string }): Promise<LogEntry[]> {
    let logs = [...INITIAL_LOGS];
    if (filter?.service && filter.service !== 'ALL') {
      logs = logs.filter((l) => l.service === filter.service);
    }
    if (filter?.level && filter.level !== 'ALL') {
      logs = logs.filter((l) => l.level === filter.level);
    }
    return logs;
  }

  public async getActivities(): Promise<ActivityEvent[]> {
    return [...INITIAL_ACTIVITIES];
  }
}

export const api = new DevOpsApiService();
