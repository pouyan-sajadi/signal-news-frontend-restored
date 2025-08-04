import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GithubDonutChartProps {
  data: any;
}

const GithubDonutChart: React.FC<GithubDonutChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.datasets[0].label,
        data: data.datasets[0].data,
        backgroundColor: data.datasets[0].backgroundColor,
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default GithubDonutChart;
