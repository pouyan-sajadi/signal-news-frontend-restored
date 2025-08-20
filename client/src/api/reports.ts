import api from './api';
import { ReportPreferences } from '../pages/HomePage';
import { saveHistory } from './history';
import { supabase } from '../lib/supabaseClient';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
// const BACKEND_URL = 'http://localhost:8000'; // Hardcoded for local testing

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
        if (data.onProgress) {
          data.onProgress("WebSocket connected. Waiting for updates...");
        }
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

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
          const finalReportData = message.data as FinalReportData;
          // Call the updated saveHistory function
          saveHistory(data.topic, data.preferences, finalReportData.agent_details.editing, job_id);
          resolve({job_id, finalReport: finalReportData });
          ws.close();
        } else if (message.status === 'error') {
          reject(new Error(message.message || 'An unknown error occurred during processing.'));
          ws.close();
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

import { Report } from '../pages/ReportPage';

export const getReport = async (jobId: string): Promise<Report> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // This case should ideally not be hit for logged-in users' reports,
      // but as a fallback, we can throw an error. Guests can't reload reports anyway.
      throw new Error("User not authenticated.");
    }

    const response = await api.get(`${BACKEND_URL}/reports/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });
    return response.data as Report;
  } catch (error: any) {
    console.error(`Error fetching report ${jobId}:`, error);
    throw new Error(error?.response?.data?.detail || error.message || `Failed to fetch report ${jobId}.`);
  }
};

// Description: Get user's report history
// Endpoint: GET /api/reports/history
// Request: {}
// Response: { reports: Array<{ id: string, topic: string, createdAt: string, preferences: ReportPreferences }> }
export const getReportHistory = async (): Promise<Report[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Guest user: fetch from sessionStorage
      const guestHistory = sessionStorage.getItem('guestReportHistory');
      return guestHistory ? JSON.parse(guestHistory) : [];
    }

    // Logged-in user: fetch from backend
    const response = await api.get(`${BACKEND_URL}/api/history`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });
    // The backend now returns the correct array of report objects, so we just need to type it correctly.
    
    return response.data as Report[];
  } catch (error: any) {
    console.error("Error fetching report history:", error);
    throw new Error(error?.response?.data?.detail || error.message || "Failed to fetch report history.");
  }
};

// Description: Delete a report
// Endpoint: DELETE /api/reports/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteReport = async (jobId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User not authenticated.");
    }

    const response = await api.delete(`${BACKEND_URL}/api/history/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting report ${jobId}:`, error);
    throw new Error(error?.response?.data?.detail || error.message || `Failed to delete report ${jobId}.`);
  }
};

