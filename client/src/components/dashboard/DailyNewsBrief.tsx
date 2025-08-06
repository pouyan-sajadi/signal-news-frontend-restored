import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Newspaper, Clock } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

interface DailyNewsBriefProps {
  data: {
    hot_topics: Array<{
      title: string
      url: string
      source: string
      publishedAt: string
      summary: string
    }>,
    created_at: string // Add created_at to the data interface
  } | null
}

export function DailyNewsBrief({ data }: DailyNewsBriefProps) {
  if (!data) return null

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp); // This is now correctly parsed as UTC
    const now = new Date(); // Get current local time
    const nowUtc = new Date(now.toUTCString()); // Convert current local time to UTC Date object

    const diffMs = nowUtc.getTime() - date.getTime(); // Calculate difference using UTC times
    const diffMinutes = Math.round(Math.abs(diffMs) / (1000 * 60));
    const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));

    // To check if 'date' is "today" in UTC:
    const isSameUtcCalendarDay = date.getUTCFullYear() === nowUtc.getUTCFullYear() &&
                                 date.getUTCMonth() === nowUtc.getUTCMonth() &&
                                 date.getUTCDate() === nowUtc.getUTCDate();

    // Case 1: Less than 60 minutes ago
    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } 
    // Case 2: Over 60 minutes but within the same calendar day (UTC)
    else if (isSameUtcCalendarDay) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } 
    // Case 3: Not within the same calendar day (UTC)
    else {
      return format(date, "MMM dd, yyyy"); // This will still format in local time for display
    }
  };

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          Intelligent News Brief
        </CardTitle>
        <p className="text-sm text-gray-600">Latest technology headlines - Generated {formatTimestamp(data.created_at)}</p>
      </CardHeader>
      <CardContent className="pt-1 h-[calc(100%-120px)]">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-4">
            {data.hot_topics.map((topic, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200"
                onClick={() => window.open(topic.url, '_blank')}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {topic.title}
                  </h3>
                </div>
                
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {topic.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(topic.publishedAt)}
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