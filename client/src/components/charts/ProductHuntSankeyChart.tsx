"use client"; // Nivo charts use interactivity, so this must be a client component.

import { ResponsiveSankey } from "@nivo/sankey";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Define TypeScript interfaces for our data props for type safety and clarity.
interface Product {
  title: string;
  url: string;
  description: string;
}

interface NivoNode {
  id: string;
  products: Product[];
  [key: string]: any; // Allows for other optional properties
}

interface NivoLink {
  source: string;
  target: string;
  value: number;
}

interface ProductHuntSankeyData {
  nodes: NivoNode[];
  links: NivoLink[];
}

interface ProductHuntSankeyChartProps {
  data: ProductHuntSankeyData;
}

/**
 * Renders a responsive Sankey diagram for Product Hunt category connections.
 * This component expects data in the Nivo-native format (string IDs for nodes and links).
 */
export const ProductHuntSankeyChart = ({ data }: ProductHuntSankeyChartProps) => {
  const [selectedNode, setSelectedNode] = useState<NivoNode | null>(null);

  const handleNodeClick = (node: any, event: React.MouseEvent) => {
    // Check if the clicked element is a node
    if (node && node.id) {
      setSelectedNode(node);
    }
    event.stopPropagation();
  };

  const linkTooltip = (node: any) => {
    if (node.link && node.link.source && node.link.target) {
      return (
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '3px', 
          minWidth: '300px' 
        }}>
          <strong>{node.link.source.id}</strong> &amp; <strong>{node.link.target.id}</strong>:{" "}
          <strong>{node.link.value}</strong> {node.link.value === 1 ? "Product" : "Products"} Trending Now
        </div>
      );
    }
    return null;
  };

  // A parent container with a defined height is required for responsive charts.
  return (
    <div className="h-[350px] w-full text-sm font-sans">
      <ResponsiveSankey
        data={data}
        margin={{ top: 25, right: 70, bottom: 25, left: 70 }}
        layout="horizontal"
        align="justify"
        colors={{ scheme: "spectral" }}
        nodeOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={10}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.2]] }}
        linkHoverOthersOpacity={0.2}
        enableLinkGradient={true}
        motionConfig="wobbly"
        onClick={handleNodeClick}
        linkTooltip={linkTooltip}
        
      />
      {selectedNode && (
        <Dialog open={selectedNode !== null} onOpenChange={() => setSelectedNode(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedNode.id}</DialogTitle>
              <DialogDescription>
                Products in the {selectedNode.id} category.
              </DialogDescription>
            </DialogHeader>
            <div>
              {selectedNode.products.map((product, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-bold">{product.title}</h4>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                    Learn more
                  </a>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};