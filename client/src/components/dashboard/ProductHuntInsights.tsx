import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Rocket } from 'lucide-react'
import { ProductHuntSankeyChart } from '@/components/charts/ProductHuntSankeyChart'

interface ProductHuntInsightsProps {
  data: {
    product_hunt_tag_connections: {
      nodes: Array<{ id: string }>;
      links: Array<{ source: string; target: string; value: number }>;
    } | null;
  } | null;
}

export function ProductHuntInsights({ data }: ProductHuntInsightsProps) {
  if (!data || !data.product_hunt_tag_connections) {
    console.log("ProductHuntInsights: No data or product_hunt_tag_connections found", data);
    return null;
  }
  const sankeyData = data.product_hunt_tag_connections;
  console.log("ProductHuntInsights: Data received for Sankey chart", sankeyData);
  console.log("ProductHuntInsights: Sankey nodes", sankeyData.nodes);
  console.log("ProductHuntInsights: Sankey links", sankeyData.links);

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          Product Hunt Category Flow
        </CardTitle>
        <p className="text-sm text-gray-600">Connections between top product categories</p>
      </CardHeader>
      <CardContent className="pt-1 h-[calc(100%-80px)]">
        <ProductHuntSankeyChart data={sankeyData.product_hunt_tag_connections} />
      </CardContent>
    </Card>
  );
}