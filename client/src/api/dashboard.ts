import api from './api';

export const getDashboardData = async () => {
  try {
    const response = await api.get('/api/tech-pulse/latest');
    const pulseData = response.data.pulse_data;

    const rawCreatedAt = response.data.created_at;

    // The backend sends a timestamp like "2025-08-04 07:29:31.201333+00".
    // We must convert it to a valid ISO 8601 format that JS `new Date()` can parse.
    // 1. Replace the space with a 'T'.
    // 2. Remove the microseconds, as they can cause parsing issues.
    const formattedTimestamp = rawCreatedAt
      ? rawCreatedAt.replace(' ', 'T').replace(/\.\d{6}/, '')
      : null;

    const isValidDate = formattedTimestamp && !isNaN(new Date(formattedTimestamp).getTime());

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
        product_hunt_tag_connections: pulseData.product_hunt_tag_connections,
      },
      news: {
        hot_topics: pulseData.news_word_cloud.hot_topics.map((topic: any) => ({
          title: topic.topic,
          url: '#',
          source: 'Hey Signal',
          // Use the single, validated, and formatted timestamp for all items
          publishedAt: isValidDate ? formattedTimestamp : new Date().toISOString(),
          summary: topic.summary,
        })),
        created_at: isValidDate ? formattedTimestamp : new Date().toISOString(),
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
