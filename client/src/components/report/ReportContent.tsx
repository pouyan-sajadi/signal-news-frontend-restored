import { useState } from "react"
import { Card } from "../ui/card"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"
import { Volume2, VolumeX } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ReportContentProps {
  content: string
}

export function ReportContent({ content }: ReportContentProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    const progress = (scrollTop / scrollHeight) * 100
    setReadingProgress(Math.min(progress, 100))
  }

  const toggleAudio = () => {
    setIsPlaying(!isPlaying)
    // Text-to-speech functionality would be implemented here
    console.log(isPlaying ? "Stopping audio" : "Starting audio")
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
      {/* Reading Progress */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Reading Progress</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAudio}
              className="gap-2"
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isPlaying ? "Stop" : "Listen"}
            </Button>
            <span className="text-sm text-muted-foreground">
              {Math.round(readingProgress)}%
            </span>
          </div>
        </div>
        <Progress value={readingProgress} className="h-1" />
      </div>

      {/* Content */}
      <div
        className="p-8 max-h-[70vh] overflow-y-auto prose prose-slate dark:prose-invert max-w-none"
        onScroll={handleScroll}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </Card>
  )
}