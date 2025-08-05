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
    <div className="h-[450px] w-full text-xs font-sans">
      <ResponsiveSankey
        data={data}
        margin={{ top: 25, right: 120, bottom: 25, left: 120 }}
        layout="horizontal"
        align="justify" // Spreads nodes evenly across the vertical space.
        colors={{ scheme: "spectral" }} // A visually appealing color scheme for many categories.

        // Node configuration
        nodeOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        
        // Label configuration
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.2]] }}

        // Link configuration
        linkHoverOthersOpacity={0.2}
        enableLinkGradient={true}
        
        // Animation and interactivity
        motionConfig="wobbly" // Adds a pleasant spring-based animation.
      />
    </div>
  );
};