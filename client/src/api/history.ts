import api from './api';
import { supabase } from '../lib/supabaseClient';

const BACKEND_URL = 'http://localhost:8000';

import { ReportPreferences } from '../pages/HomePage';
import { Report } from '../pages/ReportPage';

export const saveHistory = async (topic: string, preferences: ReportPreferences, finalReport: string, jobId: string) => {
  console.log("Attempting to save history for topic:", topic, "with job ID:", jobId);
  try {
    const { data: { session } } = await supabase.auth.getSession();

    // Construct the report object first, as it's needed for both paths
    const report: Report = {
      job_id: jobId,
      user_preferences: preferences,
      final_report_data: {
        editing: finalReport,
        search: [],
        profiling: [],
        selection: [],
        synthesis: ''
      },
      topic: topic,
      timestamp: new Date().toISOString(),
    };

    if (session?.user) {
      // Logged-in user: save to backend
      console.log("User session found, proceeding to save history to backend with payload:", report);
      await api.post(`${BACKEND_URL}/api/history`, {
        search_topic: topic,
        report_summary: report, // Send the correctly structured object
      }, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      console.log("Successfully called /api/history endpoint.");
    } else {
      // Guest user: save to sessionStorage
      console.log("No user session found. Saving history to sessionStorage.");
      const guestHistoryString = sessionStorage.getItem('guestReportHistory');
      const guestHistory = guestHistoryString ? JSON.parse(guestHistoryString) : [];
      guestHistory.unshift(report); // Add new report to the beginning of the array
      sessionStorage.setItem('guestReportHistory', JSON.stringify(guestHistory));
    }
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};
