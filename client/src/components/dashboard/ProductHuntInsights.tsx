import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Rocket } from 'lucide-react'
import { ProductHuntSankeyChart } from '@/components/charts/ProductHuntSankeyChart'

interface ProductHuntInsightsProps {
  data: {
    product_hunt_tag_connections: {
      product_hunt_tag_connections: {
        nodes: Array<{ id: string }>;
        links: Array<{ source: string; target: string; value: number }>;
      } | null;
    } | null;
  } | null;
}

export function ProductHuntInsights({ data }: ProductHuntInsightsProps) {
  console.log("ProductHuntInsights data:", JSON.stringify(data, null, 2));
  if (!data || !data.product_hunt_tag_connections) {
    return (
      <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl flex items-center justify-center">
        <p className="text-muted-foreground">No Product Hunt data available.</p>
      </Card>
    );
  }

  const sankeyData = data.product_hunt_tag_connections;

  if (!sankeyData.links || sankeyData.links.length === 0) {
    return (
      <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl flex items-center justify-center">
        <p className="text-muted-foreground">No Product Hunt connections to display.</p>
      </Card>
    );
  }

  const nodesInLinks = new Set();
  sankeyData.links.forEach(link => {
    nodesInLinks.add(link.source);
    nodesInLinks.add(link.target);
  });

  const filteredNodes = sankeyData.nodes.filter(node => nodesInLinks.has(node.id));

  const filteredSankeyData = {
    nodes: filteredNodes,
    links: sankeyData.links
  };

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          Product Hunt Category Flow
        </CardTitle>
        <p className="text-sm text-gray-600">Which products are catching customers’ attention?</p>
      </CardHeader>
      <CardContent className="pt-1 h-[calc(100%-80px)]">
        <ProductHuntSankeyChart data={filteredSankeyData} />
      </CardContent>
    </Card>
  );
}
