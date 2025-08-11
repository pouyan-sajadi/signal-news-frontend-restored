import { Newspaper, History, Search, LayoutDashboard } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { useNavigate, useLocation } from "react-router-dom"
import { UserProfile } from "./UserProfile"

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleNavigationAndScroll = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div 
          className="flex items-center gap-2 text-xl font-bold cursor-pointer hover:text-primary/80 transition-colors" 
          onClick={() => navigate("/")}
        >
          <Newspaper className="h-6 w-6 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Signal News
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleNavigationAndScroll("top-search-section")}>
            <Search className="h-4 w-4 mr-1" />
            Generate
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleNavigationAndScroll("dashboard-section")}>
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <History className="h-4 w-4 mr-1" />
            History
          </Button>
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  )
}