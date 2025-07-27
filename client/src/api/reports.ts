import api from './api';
import { ReportPreferences } from '../pages/HomePage';

const BACKEND_URL = 'http://localhost:8000'; // Assuming FastAPI runs on this port

// Define the structure of the final report data from the backend
export interface FinalReportData {
  topic: string;
  agent_details: {
    search: any[]; // Adjust types as per actual data
    profiling: any[];
    selection: any[];
    synthesis: string;
    editing: string; // This is the Markdown content
  };
}

// Description: Generate a new report
// Endpoint: POST /process_news
// Request: { topic: string, user_preferences: ReportPreferences }
// Response: { message: string, job_id: string }
export const generateReport = async (data: {
  topic: string;
  preferences: ReportPreferences;
  onProgress?: (step: string, progressData?: any) => void; // progressData can be the full WebSocket message
}) => {
  try {
    // 1. Initiate process via HTTP POST
    const response = await api.post(`${BACKEND_URL}/process_news`, {
      topic: data.topic,
      user_preferences: data.preferences, // Match backend's expected field name
    });
    const { job_id } = response.data;

    // 2. Establish WebSocket connection
    return new Promise<{job_id: string, finalReport: FinalReportData}>((resolve, reject) => {
      const ws = new WebSocket(`${BACKEND_URL.replace('http', 'ws')}/ws/status/${job_id}`);

      ws.onopen = () => {
        console.log('WebSocket connected for job:', job_id);
        if (data.onProgress) {
          data.onProgress("WebSocket connected. Waiting for updates...");
        }
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('WebSocket message:', message);

        if (data.onProgress) {
          data.onProgress(message.message || `Step: ${message.step}, Status: ${message.status}`, message);
        }

        if (message.status === 'completed' && message.step === 'search') {
          if (data.onProgress) {
            data.onProgress(`Found ${message.data.length} articles.`, { ...message, refined_topic: message.refined_topic });
          }
        }

        if (message.status === 'completed' && message.step === 'editing') {
          // Final report received
          resolve({job_id, finalReport: message.data as FinalReportData});
          ws.close();
        } else if (message.status === 'error') {
          reject(new Error(message.message || 'An unknown error occurred during processing.'));
          ws.close();
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event);
        if (!event.wasClean) {
          reject(new Error(`WebSocket connection closed unexpectedly: Code ${event.code}, Reason: ${event.reason}`));
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(new Error('WebSocket error. Please check console for details.'));
      };
    });

  } catch (error: any) {
    console.error("Error initiating report generation:", error);
    throw new Error(error?.response?.data?.detail || error.message || "Failed to initiate report generation.");
  }
};

// The getReport, getReportHistory, deleteReport, getTrendingTopics, getDailyNews functions
// will remain mocked for now, or need to be updated to fetch from the backend if corresponding
// endpoints exist or are added.
// For getReport, since the final report is streamed via WebSocket, this function might become
// obsolete or need to fetch from a persistent storage if implemented in the backend.
// For now, I will comment out the mock and leave the actual API call commented out as well,
// as it's not clear if the backend has a /reports/:id endpoint.
export const getReport = async (jobId: string): Promise<FinalReportData> => {
  try {
    const response = await api.get(`${BACKEND_URL}/reports/${jobId}`);
    return response.data as FinalReportData;
  } catch (error: any) {
    console.error(`Error fetching report ${jobId}:`, error);
    throw new Error(error?.response?.data?.detail || error.message || `Failed to fetch report ${jobId}.`);
  }
};

// Description: Get user's report history
// Endpoint: GET /api/reports/history
// Request: {}
// Response: { reports: Array<{ id: string, topic: string, createdAt: string, preferences: ReportPreferences }> }
export const getReportHistory = async (): Promise<Array<{ job_id: string, topic: string, timestamp: string, user_preferences: ReportPreferences }>> => {
  try {
    const response = await api.get(`${BACKEND_URL}/reports/history`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching report history:", error);
    throw new Error(error?.response?.data?.detail || error.message || "Failed to fetch report history.");
  }
};

// Description: Delete a report
// Endpoint: DELETE /api/reports/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteReport = async (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Report deleted successfully"
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.delete(`/api/reports/${id}`);
  //   return response.data;
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