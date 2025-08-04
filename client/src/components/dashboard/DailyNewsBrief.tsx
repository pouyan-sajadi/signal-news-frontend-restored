import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Newspaper, ExternalLink, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DailyNewsBriefProps {
  data: {
    articles: Array<{
      title: string
      url: string
      source: string
      publishedAt: string
      summary: string
    }>
  } | null
}

export function DailyNewsBrief({ data }: DailyNewsBriefProps) {
  if (!data) return null

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          Daily News Brief
        </CardTitle>
        <p className="text-sm text-gray-600">Latest technology headlines</p>
      </CardHeader>
      <CardContent className="pt-0 h-[calc(100%-120px)]">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {data.articles.map((article, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200"
                onClick={() => window.open(article.url, '_blank')}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </div>
                
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {article.source}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(article.publishedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}