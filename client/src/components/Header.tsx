import { Newspaper, History, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { useNavigate } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()
  
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div 
          className="flex items-center gap-2 text-xl font-bold cursor-pointer hover:text-primary/80 transition-colors" 
          onClick={() => navigate("/")}
        >
          <Newspaper className="h-6 w-6 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Signal News
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            History
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}