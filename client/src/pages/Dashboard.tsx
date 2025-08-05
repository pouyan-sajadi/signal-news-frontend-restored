import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { GitHubTrending } from '@/components/dashboard/GitHubTrending'
import { ProductHuntInsights } from '@/components/dashboard/ProductHuntInsights'
import { DailyNewsBrief } from '@/components/dashboard/DailyNewsBrief'
import { TechZeitgeist } from '@/components/dashboard/TechZeitgeist'
import { MarketPredictions } from '@/components/dashboard/MarketPredictions'
import { getDashboardData } from '@/api/dashboard'
import { useToast } from '@/hooks/useToast'

export function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    github: null,
    productHunt: null,
    news: null,
    keywords: null,
    predictions: null
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Fetching dashboard data...')
      setLoading(true)

      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);

        console.log('Dashboard data loaded successfully')
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
        <div className="w-full">
          <div className="mb-8">
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-[600px]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
            <div className="lg:row-span-1">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
            <div className="lg:row-span-1">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
            <div className="lg:row-span-2">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
            <div className="lg:row-span-1">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
            <div className="lg:row-span-1">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[50vh] bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Daily Tech Pulse Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Your comprehensive overview of today's technology landscape - from developer activity to market predictions
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          {/* GitHub Trending - Top Left */}
          <div className="lg:row-span-1">
            <GitHubTrending data={data.github} />
          </div>

          {/* Product Hunt Insights - Top Center */}
          <div className="lg:row-span-1">
            <ProductHuntInsights data={data.productHunt} />
          </div>

          {/* Daily News Brief - Right Side (spans full height) */}
          <div className="lg:row-span-2">
            <DailyNewsBrief data={data.news} />
          </div>

          {/* Tech Zeitgeist - Bottom Left */}
          <div className="lg:row-span-1">
            <TechZeitgeist data={data.keywords} />
          </div>

          {/* Market Predictions - Bottom Center */}
          <div className="lg:row-span-1">
            <MarketPredictions data={data.predictions} />
          </div>
        </div>
      </div>
    </div>
  )
}