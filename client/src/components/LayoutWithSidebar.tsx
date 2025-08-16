import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ReportHistory } from './home/ReportHistory';
import { Button } from './ui/button';
import { PanelLeftOpen, PanelLeftClose, History } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface LayoutWithSidebarProps {
  children?: React.ReactNode;
  reportCount: number;
  setReportCount: React.Dispatch<React.SetStateAction<number>>;
}

export function LayoutWithSidebar({ children, reportCount, setReportCount }: LayoutWithSidebarProps) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSignOut = () => {
    // This will trigger the useEffect in ReportHistory to refetch.
    // Since the user is signed out, it will get an empty list, clearing the UI.
    setReportCount(0);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`relative flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out
          ${isDesktopSidebarOpen ? 'w-64 p-4' : 'w-16 items-center p-2'}
          hidden md:flex`} // Hidden on small, flex on medium and up
      >
        <div className="flex items-center justify-between mb-4">
          {isDesktopSidebarOpen && (
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Report History
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="ml-auto"
          >
            {isDesktopSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ReportHistory isSidebar={true} isSidebarOpen={isDesktopSidebarOpen} reportCount={reportCount} />
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Report History
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ReportHistory isSidebar={true} isMobileSidebarOpen={true} reportCount={reportCount} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Header 
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          onSignOut={handleSignOut}
        />
        <div className="flex-grow overflow-y-auto">
          {children || <Outlet context={{ setReportCount }} />}
        </div>
        <Footer />
      </main>
    </div>
  );
}
