import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ReportHistory } from './home/ReportHistory';
import { Button } from './ui/button';
import { PanelLeftOpen, PanelLeftClose, History } from 'lucide-react';
import { Header } from './Header';

interface LayoutWithSidebarProps {
  children?: React.ReactNode;
  reportCount: number;
  setReportCount: React.Dispatch<React.SetStateAction<number>>;
}

export function LayoutWithSidebar({ children, reportCount, setReportCount }: LayoutWithSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64 p-4' : 'w-16 items-center p-2'}
          hidden md:flex`}
      >
        <div className="flex items-center justify-between mb-4">
          {isSidebarOpen && (
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Report History
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto"
          >
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ReportHistory isSidebar={true} isSidebarOpen={isSidebarOpen} reportCount={reportCount} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        {children || <Outlet context={{ setReportCount }} />}
      </main>
    </div>
  );
}
