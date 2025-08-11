"use client"; // Nivo charts use interactivity, so this must be a client component.

import { ResponsiveSankey } from "@nivo/sankey";

// Define TypeScript interfaces for our data props for type safety and clarity.
interface NivoNode {
  id: string;
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
  console.log("ProductHuntSankeyChart: Data received", data);
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
      />
    </div>
  );
};