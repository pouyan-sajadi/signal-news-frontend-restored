import { useState, useEffect } from "react"
import { TrendingUp, Cpu, Leaf, DollarSign, Globe, Zap } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { getTrendingTopics } from "../../api/news"
import { useToast } from "../../hooks/useToast"

interface QuickTopicsProps {
  onTopicSelect: (topic: string) => void
}

interface TopicItem {
  title: string
  description: string
  topic: string
  icon: string
}

export function QuickTopics({ onTopicSelect }: QuickTopicsProps) {
  const [topics, setTopics] = useState<TopicItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const iconMap: { [key: string]: JSX.Element } = {
    cpu: <Cpu className="h-4 w-4" />,
    leaf: <Leaf className="h-4 w-4" />,
    dollar: <DollarSign className="h-4 w-4" />,
    globe: <Globe className="h-4 w-4" />,
    zap: <Zap className="h-4 w-4" />,
    trending: <TrendingUp className="h-4 w-4" />
  }

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await getTrendingTopics() as Topic[];
        setTopics(topicsData)
      } catch (error) {
        console.error("Error fetching trending topics:", error)
        toast({
          title: "Error Loading Topics",
          description: error instanceof Error ? error.message : "Failed to load trending topics",
          variant: "destructive"
        })
        
        // Fallback to mock data if API fails
        const fallbackTopics = [
          {
            title: "AI & Machine Learning",
            description: "Latest developments in artificial intelligence",
            topic: "artificial intelligence developments 2024",
            icon: "cpu"
          },
          {
            title: "Climate Change",
            description: "Environmental policies and climate action",
            topic: "climate change policies and environmental action 2024",
            icon: "leaf"
          },
          {
            title: "Cryptocurrency",
            description: "Digital currency market trends",
            topic: "cryptocurrency market trends and regulations",
            icon: "dollar"
          },
          {
            title: "Global Politics",
            description: "International relations and diplomacy",
            topic: "international politics and diplomatic relations",
            icon: "globe"
          },
          {
            title: "Renewable Energy",
            description: "Clean energy innovations and adoption",
            topic: "renewable energy innovations and adoption",
            icon: "zap"
          },
          {
            title: "Tech Startups",
            description: "Emerging technology companies",
            topic: "technology startups and venture capital",
            icon: "trending"
          }
        ]
        setTopics(fallbackTopics)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Trending Topics</h3>
          <p className="text-sm text-muted-foreground">Loading trending topics...</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-md animate-pulse">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted w-8 h-8"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Trending Topics</h3>
        <p className="text-sm text-muted-foreground">
          Click on any topic to get started, or enter your own above
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((item, index) => (
          <Card
            key={index}
            className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onTopicSelect(item.topic)}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                  {iconMap[item.icon] || <TrendingUp className="h-4 w-4" />}
                </div>
                <h4 className="font-medium group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}