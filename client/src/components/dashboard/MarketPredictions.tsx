import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts'
import { TrendingUp, Target } from 'lucide-react'

interface MarketPredictionsProps {
  data: {
    predictions: Array<{
      question: string
      probability: number
      traderInterest: number
      category: string
    }>
  } | null
}

export function MarketPredictions({ data }: MarketPredictionsProps) {
  if (!data) return null

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI': '#8b5cf6',
      'Hardware': '#06b6d4',
      'Automotive': '#10b981',
      'Quantum': '#f59e0b',
      'VR/AR': '#ef4444',
      'Crypto': '#f97316',
      'M&A': '#6366f1',
      'Telecom': '#84cc16',
      'Web3': '#ec4899'
    }
    return colors[category as keyof typeof colors] || '#6b7280'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 text-sm mb-1">{data.question}</p>
          <p className="text-xs text-gray-600 mb-1">
            Probability: {data.probability}%
          </p>
          <p className="text-xs text-gray-600 mb-1">
            Trader Interest: {data.traderInterest}%
          </p>
          <p className="text-xs text-purple-600 font-medium">
            {data.category}
          </p>
        </div>
      )
    }
    return null
  }

  const chartData = data.predictions.map(prediction => ({
    ...prediction,
    x: prediction.probability,
    y: prediction.traderInterest
  }))

  // Get unique categories for legend
  const categories = [...new Set(data.predictions.map(p => p.category))]

  const CustomLegend = () => (
    <div className="flex flex-wrap gap-2 justify-center mt-2">
      {categories.map((category) => (
        <div key={category} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getCategoryColor(category) }}
          />
          <span className="text-xs text-gray-600">{category}</span>
        </div>
      ))}
    </div>
  )

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          Future Predictions
        </CardTitle>
        <p className="text-sm text-gray-600">Market sentiment vs probability</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="x"
                name="Probability"
                unit="%"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Trader Interest"
                unit="%"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={chartData}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getCategoryColor(entry.category)}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend />
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span>High interest in AI and hardware predictions</span>
        </div>
      </CardContent>
    </Card>
  )
}