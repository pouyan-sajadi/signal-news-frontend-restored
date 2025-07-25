import api from './api';

// Description: Get daily news
// Endpoint: GET /api/news/daily
// Request: {}
// Response: { news: Array<{ id: string, title: string, summary: string, source: string, publishedAt: string, category: string, url: string }> }
export const getDailyNews = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          title: "AI Breakthrough in Medical Diagnosis",
          summary: "New machine learning model achieves 95% accuracy in early cancer detection, potentially revolutionizing healthcare screening.",
          source: "TechHealth Today",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category: "Technology",
          url: "https://example.com/ai-medical-breakthrough"
        },
        {
          id: "2",
          title: "Climate Summit Reaches Historic Agreement",
          summary: "World leaders commit to ambitious carbon reduction targets, marking a significant step in global climate action.",
          source: "Global News Network",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          category: "Environment",
          url: "https://example.com/climate-summit-agreement"
        },
        {
          id: "3",
          title: "Cryptocurrency Market Sees Major Shift",
          summary: "Bitcoin and Ethereum experience significant volatility as new regulations are announced across major economies.",
          source: "Financial Times",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          category: "Finance",
          url: "https://example.com/crypto-market-shift"
        },
        {
          id: "4",
          title: "Space Exploration Milestone Achieved",
          summary: "NASA's latest mission successfully lands on Mars, bringing new possibilities for interplanetary research.",
          source: "Space Today",
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          category: "Science",
          url: "https://example.com/mars-mission-success"
        },
        {
          id: "5",
          title: "Renewable Energy Adoption Accelerates",
          summary: "Solar and wind power installations reach record highs as countries push for clean energy transition.",
          source: "Energy Weekly",
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          category: "Energy",
          url: "https://example.com/renewable-energy-growth"
        }
      ]);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/news/daily');
  //   return response.data.news;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get trending topics
// Endpoint: GET /api/topics/trending
// Request: {}
// Response: { topics: Array<{ title: string, description: string, topic: string, icon: string }> }
export const getTrendingTopics = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: "AI & Machine Learning",
          description: "Latest developments in artificial intelligence and machine learning technologies",
          topic: "artificial intelligence developments 2024",
          icon: "cpu"
        },
        {
          title: "Climate Change",
          description: "Environmental policies, climate action, and sustainability initiatives",
          topic: "climate change policies and environmental action 2024",
          icon: "leaf"
        },
        {
          title: "Cryptocurrency",
          description: "Digital currency market trends, regulations, and blockchain technology",
          topic: "cryptocurrency market trends and regulations",
          icon: "dollar"
        },
        {
          title: "Global Politics",
          description: "International relations, diplomacy, and geopolitical developments",
          topic: "international politics and diplomatic relations",
          icon: "globe"
        },
        {
          title: "Renewable Energy",
          description: "Clean energy innovations, solar power, and sustainable technology",
          topic: "renewable energy innovations and adoption",
          icon: "zap"
        },
        {
          title: "Tech Startups",
          description: "Emerging technology companies, venture capital, and innovation",
          topic: "technology startups and venture capital",
          icon: "trending"
        },
        {
          title: "Healthcare Innovation",
          description: "Medical breakthroughs, healthcare technology, and pharmaceutical developments",
          topic: "healthcare innovation and medical technology",
          icon: "cpu"
        },
        {
          title: "Space Exploration",
          description: "NASA missions, space technology, and astronomical discoveries",
          topic: "space exploration and astronomical discoveries",
          icon: "globe"
        }
      ]);
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/topics/trending');
  //   return response.data.topics;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};