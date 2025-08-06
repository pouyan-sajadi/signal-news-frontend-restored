import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { GitBranch, TrendingUp, Star, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

interface GitHubTrendingProps {
  data: {
    languages: Array<{
      name: string
      count: number
      color: string
      repositories: any[]
    }>
  } | null
}

export function GitHubTrending({ data }: GitHubTrendingProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [repositories, setRepositories] = useState<any[]>([])
  const { toast } = useToast()

  if (!data) return null

  const totalRepos = data.languages.reduce((sum, lang) => sum + lang.count, 0)

  const chartData = data.languages.map(lang => ({
    ...lang,
    percentage: ((lang.count / totalRepos) * 100).toFixed(1)
  }))

  const handleSliceClick = (entry: any) => {
    setSelectedLanguage(entry.name)
    setRepositories(entry.repositories)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.count.toLocaleString()} repositories
          </p>
          <p className="text-sm text-gray-600">
            {data.percentage}% of total
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Click for details of different repos
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percentage }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (parseFloat(percentage) < 5) return null

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    )
  }

  return (
    <>
      <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <GitBranch className="h-5 w-5 text-white" />
            </div>
            Developer Activity
          </CardTitle>
          <p className="text-sm text-gray-600">Trending programming languages</p>
        </CardHeader>
        <CardContent className="pt-1">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  onClick={handleSliceClick}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span style={{ color: entry.color, fontSize: '12px' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Based on {totalRepos.toLocaleString()} repositories</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLanguage} onOpenChange={() => setSelectedLanguage(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedLanguage} Repositories
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {repositories.map((repo, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-gray-50"
              >
                {console.log("Repo data:", repo)}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{repo.title}</h3>
                <div className="flex items-start justify-between mb-2">
                  <div></div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-medium">{repo.stars.toLocaleString()}</span>
                    </div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{repo.description}</p>
                <div className="mt-3">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {selectedLanguage}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}