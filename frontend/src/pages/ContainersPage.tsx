import React from 'react';
import { Boxes, Layers, Cpu, HardDrive, Activity, RefreshCw } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { DockerEngineBanner } from '../components/docker/DockerEngineBanner';
import { ContainerTable } from '../components/docker/ContainerTable';
import { ImageTable } from '../components/docker/ImageTable';
import { ContainerDetailModal } from '../components/docker/ContainerDetailModal';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const ContainersPage: React.FC = () => {
  const { engineInfo, containers, images, metrics } = useAppState();

  const runningCount = containers.filter((c) => c.state === 'running').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Docker Containers & Images
            </h1>
            <Badge variant="purple" size="sm">
              Docker Engine
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Overview of containerized microservices, virtual overlay networks, and volume storage
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Daemon: {engineInfo.daemonStatus.toUpperCase()}</span>
        </div>
      </div>

      {/* Docker Engine Info Banner matching Image 3 */}
      <DockerEngineBanner />

      {/* Resource Utilization Row matching Image 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="CPU Usage"
          value={metrics.cpuUsagePercent}
          unit="%"
          subtitle="Processor utilization (cgroups)"
          accentColor="purple"
          progressPercent={metrics.cpuUsagePercent}
          progressBarColor="bg-purple-500"
          icon={<Cpu className="w-4 h-4" />}
          borderStyle="solid"
        />

        <StatCard
          title="Memory Usage"
          value="15.1"
          unit="%"
          subtitle="1.16 GB / 7.65 GB allocated"
          accentColor="purple"
          progressPercent={15.1}
          progressBarColor="bg-purple-500"
          icon={<Activity className="w-4 h-4" />}
          borderStyle="solid"
        />

        <StatCard
          title="Disk Usage"
          value="4.6"
          unit="%"
          subtitle="20.69 GB / 500 GB container root"
          accentColor="purple"
          progressPercent={4.6}
          progressBarColor="bg-purple-500"
          icon={<HardDrive className="w-4 h-4" />}
          borderStyle="solid"
        />
      </div>

      {/* Resources Tables Section: Containers & Images matching Image 3 */}
      <div className="space-y-6">
        {/* Containers Table */}
        <ContainerTable />

        {/* Images Table */}
        <ImageTable />
      </div>

      {/* Container Detail Modal */}
      <ContainerDetailModal />
    </div>
  );
};
