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
        product_details: pulseData.product_hunt_tag_connections.product_details.map((product: any) => ({
          title: product.title,
          url: product.url,
          topic: product.topic,
        })),
      },
      news: {
        hot_topics: pulseData.news_word_cloud.hot_topics.map((topic: any) => ({
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
          desc: keyword.desc,
        })),
      },
      predictions: {
        predictions: pulseData.manifold_predictions_bubble_plot.datasets[0].data.map((prediction: any) => ({
          question: prediction.label,
          probability: Math.round(prediction.x * 100),
          traderInterest: prediction.y,
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
