import React, { useEffect, useState } from 'react';
import { getTechPulse } from '../api/news';
import GithubDonutChart from '../components/dashboard/GithubDonutChart';
import NewsWordCloud from '../components/dashboard/NewsWordCloud';
import HotTopicsTicker from '../components/dashboard/HotTopicsTicker';
import BubblePlot from '../components/dashboard/BubblePlot';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTechPulse();
        setData(response);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Daily News Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {data ? (
        <div>
          <HotTopicsTicker data={data.pulse_data.news_word_cloud} />
          <div className="flex">
            <div className="w-1/2">
              <GithubDonutChart data={data.pulse_data.github_language_distribution} />
            </div>
            <div className="w-1/2">
              <NewsWordCloud data={data.pulse_data.news_word_cloud} />
            </div>
          </div>
          <div>
            <BubblePlot data={data.pulse_data.manifold_predictions_bubble_plot} />
          </div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DashboardPage;