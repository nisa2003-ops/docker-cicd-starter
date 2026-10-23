// System & Infrastructure Types

export type PageId = 'overview' | 'pipelines' | 'containers' | 'logs' | 'settings';

export type SystemStatus = 'healthy' | 'degraded' | 'critical' | 'maintenance';

export interface SystemMetrics {
  cpuUsagePercent: number;
  cpuCores: number;
  cpuModel: string;
  memoryUsedGb: number;
  memoryTotalGb: number;
  diskUsedGb: number;
  diskTotalGb: number;
  networkRxMbps: number;
  networkTxMbps: number;
  uptimeSeconds: number;
  uptimeFormatted: string;
  uptimePercentage: number;
}

export interface MetricDataPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  networkRx: number;
  networkTx: number;
}

export interface ServiceRuntime {
  id: string;
  name: string;
  type: 'mysql' | 'redis' | 'node' | 'python' | 'nginx';
  version: string;
  status: 'active' | 'degraded' | 'stopped';
  metricLabel1: string;
  metricValue1: string;
  metricLabel2: string;
  metricValue2: string;
  metricLabel3: string;
  metricValue3: string;
  metricLabel4: string;
  metricValue4: string;
  sparkline: number[];
}

// Pipeline Types

export type PipelineStatus = 'success' | 'running' | 'failed' | 'queued' | 'cancelled';

export interface PipelineStageStep {
  id: string;
  name: string;
  status: PipelineStatus;
  durationSeconds: number;
  logSnippet?: string[];
}

export interface PipelineStage {
  id: string;
  name: string;
  group: 'Fast Feedback' | 'Extended Test' | 'Production';
  status: PipelineStatus;
  durationSeconds: number;
  version?: string;
  lastRun?: string;
  steps: PipelineStageStep[];
  links?: {
    githubUrl?: string;
    metricsUrl?: string;
    artifactsUrl?: string;
  };
}

export interface PipelineRun {
  id: string;
  pipelineName: string;
  runNumber: number;
  status: PipelineStatus;
  branch: string;
  commitHash: string;
  commitMessage: string;
  author: {
    name: string;
    avatarUrl?: string;
    username: string;
  };
  triggerType: 'Push' | 'Manual' | 'Scheduled' | 'PR';
  startedAt: string;
  duration: string;
  stages: PipelineStage[];
}

// Docker Types

export type ContainerState = 'running' | 'stopped' | 'exited' | 'created' | 'restarting';

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  tag: string;
  state: ContainerState;
  health: 'healthy' | 'unhealthy' | 'starting' | 'none';
  uptime: string;
  cpuPercent: number;
  memoryUsageMb: number;
  memoryLimitMb: number;
  ports: string[];
  created: string;
  command: string;
  ipAddress: string;
  volumes: string[];
  env: Record<string, string>;
}

export interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  sizeMb: number;
  sizeFormatted: string;
  created: string;
  status: 'In Use' | 'Unused';
  containersCount: number;
  vulnerabilityCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface DockerEngineInfo {
  version: string;
  os: string;
  architecture: string;
  containersRunning: number;
  containersStopped: number;
  containersTotal: number;
  imagesCount: number;
  storageDriver: string;
  rootDir: string;
  daemonStatus: 'active' | 'degraded' | 'offline';
}

// Log & Activity Types

export type LogLevel = 'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  metadata?: Record<string, string | number>;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'deploy' | 'pipeline' | 'container' | 'security' | 'user';
  title: string;
  description: string;
  author: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadataBadge?: string;
}

// Environment Deployed Service

export interface EnvironmentDeployment {
  id: string;
  envName: 'Dev' | 'Staging' | 'Prod';
  isProd: boolean;
  tag: string;
  instancesCount: number;
  lastDeployedBy: string;
  lastDeployedTime: string;
  healthPercentage: number;
}
