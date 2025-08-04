import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Rocket, ArrowUp } from 'lucide-react'

interface ProductHuntInsightsProps {
  data: {
    categories: Array<{
      name: string
      upvotes: number
      products: number
    }>
  } | null
}

export function ProductHuntInsights({ data }: ProductHuntInsightsProps) {
  if (!data) return null

  const chartData = data.categories.slice(0, 6).map(category => ({
    ...category,
    shortName: category.name.length > 12 ? category.name.substring(0, 12) + '...' : category.name
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.upvotes.toLocaleString()} upvotes
          </p>
          <p className="text-sm text-gray-600">
            {data.products} products
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          Market Launch Trends
        </CardTitle>
        <p className="text-sm text-gray-600">Product Hunt category performance</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="shortName" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="upvotes" 
                fill="url(#productHuntGradient)"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
              <defs>
                <linearGradient id="productHuntGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <ArrowUp className="h-4 w-4 text-green-500" />
          <span>AI Tools leading with {data.categories[0]?.upvotes.toLocaleString()} upvotes</span>
        </div>
      </CardContent>
    </Card>
  )
}