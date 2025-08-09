import api from './api';
import { supabase } from '../lib/supabaseClient';

const BACKEND_URL = 'http://localhost:8000';

import { ReportPreferences } from '../pages/HomePage';

export const saveHistory = async (topic: string, preferences: ReportPreferences, finalReport: string, jobId: string) => {
  console.log("Attempting to save history for topic:", topic, "with job ID:", jobId);
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Construct the object to match the ReportPage's expected structure
      const reportSummary = {
        job_id: jobId,
        user_preferences: preferences,
        final_report_data: {
          editing: finalReport, // The markdown string
          // Add placeholder data for other expected fields to prevent errors
          search: [],
          profiling: [],
          selection: [],
          synthesis: ''
        },
        topic: topic,
        timestamp: new Date().toISOString(),
      };

      console.log("User session found, proceeding to save history with payload:", reportSummary);
      await api.post(`${BACKEND_URL}/api/history`, {
        search_topic: topic,
        report_summary: reportSummary, // Send the correctly structured object
      }, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      console.log("Successfully called /api/history endpoint.");
    } else {
      console.log("No user session found. Skipping history save.");
    }
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};
