import { Sparkles, Zap, Filter } from "lucide-react"

export function HeroSection() {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Signal News
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Transform any topic into a comprehensive, AI-powered news report in real-time
        </p>
      </div>
      
      <div className="flex justify-center gap-8 mt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-yellow-500" />
          Instant Intelligence
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4 text-blue-500" />
          Noise-Free Content
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-purple-500" />
          Personalized Reports
        </div>
      </div>
    </div>
  )
}