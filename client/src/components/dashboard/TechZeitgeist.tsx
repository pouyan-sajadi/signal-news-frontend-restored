import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TechZeitgeistProps {
  data: {
    keywords: Array<{
      word: string
      frequency: number
      trend: string
      desc: string
    }>
  } | null
}

export function TechZeitgeist({ data }: TechZeitgeistProps) {
  if (!data) return null

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100'
      case 'down':
        return 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100'
    }
  }

  const getWordSize = (frequency: number, maxFreq: number) => {
    const ratio = frequency / maxFreq
    if (ratio > 0.8) return 'text-lg font-bold'
    if (ratio > 0.6) return 'text-base font-semibold'
    if (ratio > 0.4) return 'text-sm font-medium'
    return 'text-xs font-normal'
  }

  const maxFrequency = Math.max(...data.keywords.map(k => k.frequency))
  const displayKeywords = data.keywords.slice(0, 20)

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          Tech Zeitgeist
        </CardTitle>
        <p className="text-sm text-gray-600">Trending concepts and buzzwords</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64 overflow-hidden">
          <TooltipProvider>
            <div className="flex flex-wrap gap-2 h-full overflow-y-auto pr-2">
              {displayKeywords.map((keyword, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className={`${getTrendColor(keyword.trend)} ${getWordSize(keyword.frequency, maxFrequency)}
                        transition-all duration-200 cursor-pointer border flex items-center gap-1 px-3 py-1`} 
                      title={`${keyword.frequency.toLocaleString()} mentions`}
                    >
                      {getTrendIcon(keyword.trend)}
                      {keyword.word}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-white border border-gray-200 shadow-lg">
                    <div className="p-2">
                      <p className="font-semibold text-gray-900 mb-1">{keyword.word}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {keyword.desc}
                      </p>
                      <p className="text-xs text-gray-500">
                        {keyword.frequency.toLocaleString()} mentions
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Brain className="h-4 w-4 text-purple-500" />
          <span>AI and ML dominating tech discourse</span>
        </div>
      </CardContent>
    </Card>
  )
}