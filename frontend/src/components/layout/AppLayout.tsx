import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { CommandPalette } from './CommandPalette';
import { TriggerPipelineModal } from '../pipeline/TriggerPipelineModal';

import { OverviewPage } from '../../pages/OverviewPage';
import { PipelinePage } from '../../pages/PipelinePage';
import { ContainersPage } from '../../pages/ContainersPage';
import { LogsPage } from '../../pages/LogsPage';
import { SettingsPage } from '../../pages/SettingsPage';

export const AppLayout: React.FC = () => {
  const { activePage, sidebarCollapsed } = useAppState();

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'pipelines':
        return <PipelinePage />;
      case 'containers':
        return <ContainersPage />;
      case 'logs':
        return <LogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fixed Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 pt-20 px-4 sm:px-6 md:px-8 max-w-7xl w-full ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {renderActivePage()}
      </main>

      {/* Global Modals & Command Palette */}
      <CommandPalette />
      <TriggerPipelineModal />
    </div>
  );
};
