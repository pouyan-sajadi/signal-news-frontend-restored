import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, Legend, ReferenceLine } from 'recharts'
import { TrendingUp, Target } from 'lucide-react'

interface MarketPredictionsProps {
  data: {
    predictions: Array<{
      question: string
      probability: number // This is 0-100
      traderInterest: number // This is 0-100
      category: string
    }>
  } | null
}

export function MarketPredictions({ data }: MarketPredictionsProps) {
  if (!data) return null

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI': '#8b5cf6', // Purple
      'Hardware': '#06b6d4', // Cyan
      'Automotive': '#10b981', // Emerald
      'Quantum': '#f59e0b', // Amber
      'VR/AR': '#ef4444', // Red
      'Crypto': '#f97316', // Orange
      'M&A': '#6366f1', // Indigo
      'Telecom': '#84cc16', // Lime
      'Web3': '#ec4899', // Pink
      'Biotech': '#3b82f6', // Blue
      'Energy': '#a855f7', // Violet
      'Space': '#14b8a6', // Teal
      'Robotics': '#eab308', // Yellow
      'Cybersecurity': '#db2777', // Rose
      'Health': '#1d4ed8', // Darker Blue
      'Finance': '#ca8a04', // Darker Amber
      'Education': '#059669', // Green
      'Gaming': '#9333ea', // Purple
      'Food': '#d97706', // Orange
      'Travel': '#14b8a6', // Teal
      'Fashion': '#be185d', // Rose
      'Real Estate': '#6d28d9', // Violet
      'Media': '#ef4444', // Red
      'Sports': '#3b82f6', // Blue
      'Music': '#c026d3', // Fuchsia
      'Art': '#e11d48', // Red-500
      'Environment': '#16a34a', // Green-600
      'Government': '#4f46e5', // Indigo-600
      'Retail': '#ea580c', // Orange-600
      'Agriculture': '#65a30d', // Lime-600
      'Manufacturing': '#a21caf', // Purple-600
      'Logistics': '#0891b2', // Cyan-600
      'Consulting': '#7c2d12', // Amber-800
      'Legal': '#4338ca', // Indigo-700
      'Marketing': '#d946ef', // Fuchsia-500
      'Human Resources': '#f43f5e', // Rose-500
      'Non-profit': '#22c55e', // Green-500
      'Other': '#64748b', // Slate-600
      'AI utils': '#8b5cf6', // Purple
      'Technology (General)': '#06b6d4', // Cyan
      'Blockchain/Crypto': '#f97316', // Orange
      'Politics/Society': '#ef4444', // Red
      'Economics/Finance': '#ca8a04', // Darker Amber
    }
    return colors[category as keyof typeof colors] || '#10b981' // A distinct green as a more visible default
  }

  // Data Transformation
  const transformedData = data.predictions.map(prediction => {
    const probabilityDecimal = prediction.probability / 100; // Convert 0-100 to 0-1
    return {
      ...prediction,
      x: (probabilityDecimal * 2) - 1, // Diverging consensus scale (-1 to 1)
      y: prediction.traderInterest, // Y-axis is now volume (traderInterest)
      originalProbability: prediction.probability, // Store original for tooltip
      volume: prediction.traderInterest // Store original for tooltip
    }
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 text-sm mb-1">{data.question}</p>
          <p className="text-xs text-gray-600 mb-1">
            Predicted Likelihood: {data.originalProbability}%
          </p>
          <p className="text-xs text-gray-600 mb-1">
            Capital at Stake: ${Math.round(data.volume).toLocaleString()}
          </p>
          <p className="text-xs text-purple-600 font-medium">
            {data.category}
          </p>
        </div>
      )
    }
    return null
  }

  // Custom X-Axis Tick Formatter
  const formatXAxisTick = (tickItem: number) => {
    if (tickItem === -1) return 'Strong "No"'
    if (tickItem === 0) return 'High Controversy'
    if (tickItem === 1) return 'Strong "Yes"'
    return ''
  }

  // Custom Y-Axis Tick Formatter for currency
  const formatYAxisTick = (tickItem: number) => {
    if (tickItem >= 1000000) return `$${(tickItem / 1000000).toFixed(1)}M`
    if (tickItem >= 1000) return `$${(tickItem / 1000).toFixed(0)}K`
    return `$${tickItem}`
  }

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
          <span className="text-sm text-gray-600">{category}</span>
        </div>
      ))}
    </div>
  )

  const minVolume = Math.min(...transformedData.map(d => d.y));
  const maxVolume = Math.max(...transformedData.map(d => d.y));

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          Market Predictions
        </CardTitle>
        <p className="text-sm text-gray-600">What’s the smart money on?</p>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 15, right: 5, bottom: 5, left: 40 }}>
              <XAxis
                type="number"
                dataKey="x"
                domain={[-1, 1]}
                tickFormatter={formatXAxisTick}
                allowDuplicatedCategory={false}
                name="Market Consensus"
                tick={{ fontSize: 13 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                scale="log"
                domain={[minVolume * 0.8, maxVolume * 1.2]}
                tickFormatter={formatYAxisTick}
                name="Total Money Invested (Log Scale)"
                tick={{ fontSize: 13 }}
                label={{ value: "Total Money Invested", angle: -90, position: 'insideLeft', dx: 0, dy: 60, fill: '#64748b', fontSize: 13 }}
              />
              <ReferenceLine x={0} stroke="#e2e8f0" strokeDasharray="3 3" label={{ value: 'High Controversy', position: 'top', fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={transformedData}>
                {transformedData.map((entry, index) => (
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
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span>High interest in AI and hardware predictions</span>
        </div>
      </CardContent>
    </Card>
  )
}