import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PageId,
  PipelineRun,
  DockerContainer,
  DockerImage,
  SystemMetrics,
  DockerEngineInfo,
  LogEntry,
  ActivityEvent,
  EnvironmentDeployment,
} from '../types';
import {
  INITIAL_SYSTEM_METRICS,
  INITIAL_DOCKER_ENGINE,
  INITIAL_PIPELINE_RUNS,
  INITIAL_CONTAINERS,
  INITIAL_IMAGES,
  INITIAL_LOGS,
  INITIAL_ACTIVITIES,
  INITIAL_ENVIRONMENTS,
} from '../services/mockData';
import { api } from '../services/api';

interface AppContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  metrics: SystemMetrics;
  isLiveMetrics: boolean;
  metricsLoading: boolean;
  metricsError: string | null;
  loadLiveMetrics: () => Promise<void>;

  engineInfo: DockerEngineInfo;
  pipelineRuns: PipelineRun[];
  pipelineConfigured: boolean;
  pipelineMessage: string;
  containers: DockerContainer[];
  images: DockerImage[];
  logs: LogEntry[];
  activities: ActivityEvent[];
  environments: EnvironmentDeployment[];
  
  // Modals & Drawers
  selectedPipelineRun: PipelineRun | null;
  setSelectedPipelineRun: (run: PipelineRun | null) => void;
  selectedContainer: DockerContainer | null;
  setSelectedContainer: (container: DockerContainer | null) => void;
  isTriggerModalOpen: boolean;
  setIsTriggerModalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Backend availability status
  apiOnline: boolean;
  backendLatencyMs: number;
  backendVersion: string;
  checkBackendHealth: () => Promise<void>;
  
  // Interactive operations
  triggerNewRun: (pipelineName: string, branch: string, environment?: string) => Promise<void>;
  toggleContainer: (id: string, action: 'start' | 'stop' | 'restart') => void;
  startAllContainers: () => void;
  stopAllContainers: () => void;
  addLogMessage: (service: string, level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string) => void;
  clearLogs: () => void;
  
  // UI preferences
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  themeMode: 'navy' | 'midnight' | 'slate';
  setThemeMode: (theme: 'navy' | 'midnight' | 'slate') => void;
  refreshAllData: () => void;
  isRefreshing: boolean;
}

const AppStateContext = createContext<AppContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_SYSTEM_METRICS);
  const [isLiveMetrics, setIsLiveMetrics] = useState<boolean>(false);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const [engineInfo, setEngineInfo] = useState<DockerEngineInfo>(INITIAL_DOCKER_ENGINE);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>(INITIAL_PIPELINE_RUNS);
  const [pipelineConfigured, setPipelineConfigured] = useState<boolean>(false);
  const [pipelineMessage, setPipelineMessage] = useState<string>('Prototype mode');

  const [containers, setContainers] = useState<DockerContainer[]>(INITIAL_CONTAINERS);
  const [images] = useState<DockerImage[]>(INITIAL_IMAGES);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [environments] = useState<EnvironmentDeployment[]>(INITIAL_ENVIRONMENTS);

  const [selectedPipelineRun, setSelectedPipelineRun] = useState<PipelineRun | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<DockerContainer | null>(null);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const [apiOnline, setApiOnline] = useState(false);
  const [backendLatencyMs, setBackendLatencyMs] = useState(0);
  const [backendVersion, setBackendVersion] = useState('0.2.0');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<'navy' | 'midnight' | 'slate'>('navy');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load genuine metrics from backend API
  const loadLiveMetrics = useCallback(async () => {
    try {
      setMetricsLoading(true);
      const res = await api.getMetrics();
      setMetrics(res.metrics);
      setIsLiveMetrics(res.isLive);
      setMetricsError(null);
    } catch (err: any) {
      setMetricsError(err.message || 'Failed to fetch live system metrics');
      setIsLiveMetrics(false);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // Health and connectivity check
  const checkBackendHealth = useCallback(async () => {
    const res = await api.checkApiHealth();
    setApiOnline(res.online);
    setBackendLatencyMs(res.latencyMs);

    if (res.online) {
      // Fetch version, metrics, and pipeline status
      const ver = await api.fetchVersion();
      if (ver) {
        setBackendVersion(ver.version);
      }

      await loadLiveMetrics();

      const pipeRes = await api.getPipelineStatus();
      setPipelineConfigured(pipeRes.configured);
      setPipelineMessage(pipeRes.message);
      if (pipeRes.runs && pipeRes.runs.length > 0) {
        setPipelineRuns(pipeRes.runs);
      }

      const actRes = await api.getActivities();
      if (actRes.activities && actRes.activities.length > 0) {
        setActivities(actRes.activities);
      }
    } else {
      setIsLiveMetrics(false);
    }
  }, [loadLiveMetrics]);

  // Initial mount health check & polling
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  // Shortcut for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerNewRun = async (pipelineName: string, branch: string, environment: string = 'development') => {
    const newRun = await api.triggerPipeline(pipelineName, branch, environment);
    setPipelineRuns((prev) => [newRun, ...prev]);
    setSelectedPipelineRun(newRun);
    
    // Add activity
    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'pipeline',
      title: `Pipeline ${pipelineName} triggered`,
      description: `Dispatched build on ${branch} (Target: ${environment}) [commit ${newRun.commitHash}]`,
      author: 'DevOps Engineer',
      status: 'info',
      metadataBadge: `#${newRun.runNumber}`,
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Add initial log
    addLogMessage('pipeline-runner', 'INFO', `Pipeline ${pipelineName} (#${newRun.runNumber}) initiated on ${branch}`);
  };

  const toggleContainer = (id: string, action: 'start' | 'stop' | 'restart') => {
    setContainers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (action === 'stop') {
            return { ...c, state: 'stopped', health: 'none', uptime: 'Stopped just now' };
          }
          if (action === 'start') {
            return { ...c, state: 'running', health: 'healthy', uptime: 'Up few seconds' };
          }
          if (action === 'restart') {
            return { ...c, state: 'running', health: 'healthy', uptime: 'Restarted just now' };
          }
        }
        return c;
      })
    );

    // Update engine info running count
    setTimeout(() => {
      setContainers((current) => {
        const running = current.filter((c) => c.state === 'running').length;
        setEngineInfo((e) => ({
          ...e,
          containersRunning: running,
          containersStopped: current.length - running,
        }));
        return current;
      });
    }, 100);

    addLogMessage('docker-daemon', 'INFO', `Container ${id} action performed: ${action.toUpperCase()} (Phase 3 Daemon Binding Ready)`);
  };

  const startAllContainers = () => {
    setContainers((prev) =>
      prev.map((c) => ({
        ...c,
        state: 'running',
        health: 'healthy',
        uptime: 'Up just now',
      }))
    );
    setEngineInfo((e) => ({
      ...e,
      containersRunning: e.containersTotal,
      containersStopped: 0,
    }));
    addLogMessage('docker-daemon', 'INFO', 'Bulk action: Started all stopped containers');
  };

  const stopAllContainers = () => {
    setContainers((prev) =>
      prev.map((c) => ({
        ...c,
        state: 'stopped',
        health: 'none',
        uptime: 'Stopped just now',
      }))
    );
    setEngineInfo((e) => ({
      ...e,
      containersRunning: 0,
      containersStopped: e.containersTotal,
    }));
    addLogMessage('docker-daemon', 'WARN', 'Bulk action: Stopped all running containers');
  };

  const addLogMessage = (service: string, level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string) => {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      service,
      level,
      message,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const refreshAllData = async () => {
    setIsRefreshing(true);
    await checkBackendHealth();
    await loadLiveMetrics();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <AppStateContext.Provider
      value={{
        activePage,
        setActivePage,
        metrics,
        isLiveMetrics,
        metricsLoading,
        metricsError,
        loadLiveMetrics,
        engineInfo,
        pipelineRuns,
        pipelineConfigured,
        pipelineMessage,
        containers,
        images,
        logs,
        activities,
        environments,
        selectedPipelineRun,
        setSelectedPipelineRun,
        selectedContainer,
        setSelectedContainer,
        isTriggerModalOpen,
        setIsTriggerModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        apiOnline,
        backendLatencyMs,
        backendVersion,
        checkBackendHealth,
        triggerNewRun,
        toggleContainer,
        startAllContainers,
        stopAllContainers,
        addLogMessage,
        clearLogs,
        sidebarCollapsed,
        setSidebarCollapsed,
        themeMode,
        setThemeMode,
        refreshAllData,
        isRefreshing,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
