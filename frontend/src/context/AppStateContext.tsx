import React, { createContext, useContext, useState, useEffect } from 'react';
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
  engineInfo: DockerEngineInfo;
  pipelineRuns: PipelineRun[];
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
  checkBackendHealth: () => Promise<void>;
  
  // Interactive operations
  triggerNewRun: (pipelineName: string, branch: string) => Promise<void>;
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
  const [engineInfo, setEngineInfo] = useState<DockerEngineInfo>(INITIAL_DOCKER_ENGINE);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>(INITIAL_PIPELINE_RUNS);
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<'navy' | 'midnight' | 'slate'>('navy');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkBackendHealth = async () => {
    const res = await api.checkApiHealth();
    setApiOnline(res.online);
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, []);

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

  const triggerNewRun = async (pipelineName: string, branch: string) => {
    const newRun = await api.triggerPipeline(pipelineName, branch);
    setPipelineRuns((prev) => [newRun, ...prev]);
    setSelectedPipelineRun(newRun);
    
    // Add activity
    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'pipeline',
      title: `Pipeline ${pipelineName} triggered manually`,
      description: `Dispatched build on ${branch} (commit ${newRun.commitHash})`,
      author: 'Portfolio Admin',
      status: 'info',
      metadataBadge: `#${newRun.runNumber}`,
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Add initial log
    addLogMessage('pipeline-runner', 'INFO', `Pipeline ${pipelineName} (#${newRun.runNumber}) initiated by user on ${branch}`);
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

    addLogMessage('docker-daemon', 'INFO', `Container ${id} action performed: ${action.toUpperCase()}`);
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

  const refreshAllData = () => {
    setIsRefreshing(true);
    // Subtle metric fluctuation to feel alive
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsagePercent: Math.min(95, Math.max(15, prev.cpuUsagePercent + Math.floor(Math.random() * 9) - 4)),
        networkRxMbps: Math.floor(800 + Math.random() * 120),
        networkTxMbps: Math.floor(1800 + Math.random() * 200),
      }));
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <AppStateContext.Provider
      value={{
        activePage,
        setActivePage,
        metrics,
        engineInfo,
        pipelineRuns,
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
