import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Rocket, ExternalLink } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface ProductHuntInsightsProps {
  data: {
    product_details: Array<{
      title: string
      url: string
      topic: string
    }>
  } | null
}

export function ProductHuntInsights({ data }: ProductHuntInsightsProps) {
  if (!data) return null

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          Product Hunt Insights
        </CardTitle>
        <p className="text-sm text-gray-600">Latest product launches and trends</p>
      </CardHeader>
      <CardContent className="pt-1 h-[calc(100%-100px)]">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {data.product_details.map((product, index) => (
              <div
                key={index}
                className="group p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200"
                onClick={() => window.open(product.url, '_blank')}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-orange-600 transition-colors">
                    {product.title}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                </div>
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                  {product.topic}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}