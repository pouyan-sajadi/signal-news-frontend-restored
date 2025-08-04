import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface BubblePlotProps {
  data: any;
}

const BubblePlot: React.FC<BubblePlotProps> = ({ data }) => {
  const chartData = {
    datasets: data.datasets.map((dataset: any) => ({
      ...dataset,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    })),
  };

  return <Bubble data={chartData} />;
};

export default BubblePlot;
