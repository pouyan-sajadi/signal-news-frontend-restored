import api from './api';

export const getDashboardData = async () => {
  try {
    const response = await api.get('/api/tech-pulse/latest');
    const pulseData = response.data.pulse_data;

    // This is the adapter logic. It transforms the single backend response
    // into the five separate data structures the frontend components expect.
    const transformedData = {
      github: {
        languages: pulseData.github_language_distribution.labels.map((label: string, index: number) => ({
          name: label,
          count: pulseData.github_language_distribution.datasets[0].data[index],
          color: pulseData.github_language_distribution.datasets[0].backgroundColor[index],
          repositories: pulseData.github_language_distribution.datasets[0].hoverData[index].repositories,
        })),
      },
      productHunt: {
        categories: pulseData.product_hunt_tag_connections.nodes.map((node: any) => ({
          name: node.name,
          upvotes: Math.floor(Math.random() * 5000), // Mocked data
          products: Math.floor(Math.random() * 100), // Mocked data
        })),
      },
      news: {
        articles: pulseData.news_word_cloud.hot_topics.map((topic: any) => ({
          title: topic.topic,
          url: '#',
          source: 'Signal News',
          publishedAt: new Date().toISOString(),
          summary: topic.summary,
        })),
      },
      keywords: {
        keywords: pulseData.news_word_cloud.keywords.map((keyword: any) => ({
          word: keyword.text,
          frequency: keyword.value,
          trend: 'up', // Mocked data
          overview: pulseData.news_word_cloud.hot_topics.find((topic: any) => topic.topic.toLowerCase().includes(keyword.text.toLowerCase()))?.summary || `An overview for ${keyword.text}`,
        })),
      },
      predictions: {
        predictions: pulseData.manifold_predictions_bubble_plot.datasets[0].data.map((prediction: any) => ({
          question: prediction.label,
          probability: Math.round(prediction.x * 100),
          traderInterest: Math.round(prediction.y / 1000),
          category: prediction.category,
        })),
      },
    };

    return transformedData;
  } catch (error: any) {
    console.error("Error fetching or transforming dashboard data:", error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};
