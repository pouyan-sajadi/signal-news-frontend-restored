import { Newspaper, History, Search, LayoutDashboard, Menu, Info } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { UserProfile } from "./UserProfile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface HeaderProps {
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (isOpen: boolean) => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

export function Header({ isDesktopSidebarOpen, setIsDesktopSidebarOpen, setIsMobileSidebarOpen }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleNavigationAndScroll = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div 
          className="flex items-center gap-2 text-xl font-bold cursor-pointer hover:text-primary/80 transition-colors" 
          onClick={() => navigate("/")}
        >
          <Newspaper className="h-6 w-6 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hey Signal
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleNavigationAndScroll("top-search-section")}>
            <Search className="h-4 w-4 mr-1" />
            Generate
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleNavigationAndScroll("dashboard-section")}>
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}>
            <History className="h-4 w-4 mr-1" />
            History
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/about">
              <Info className="h-4 w-4 mr-1" />
              About
            </Link>
          </Button>
          <ThemeToggle />
          <UserProfile />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <UserProfile />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 pt-8">
                <Button variant="ghost" className="justify-start" onClick={() => handleNavigationAndScroll("top-search-section")}>
                  <Search className="h-4 w-4 mr-2" />
                  Generate
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleNavigationAndScroll("dashboard-section")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setIsMobileSidebarOpen(true)}> {/* Changed to setIsMobileSidebarOpen(true) */}
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}