import api from './api';
import { supabase } from '../lib/supabaseClient';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
// const BACKEND_URL = 'http://localhost:8000'; // Hardcoded for local testing

import { ReportPreferences } from '../pages/HomePage';
import { Report } from '../pages/ReportPage';

export const saveHistory = async (topic: string, preferences: ReportPreferences, finalReport: string, jobId: string) => {
  
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
      
      await api.post(`${BACKEND_URL}/api/history`, {
        search_topic: topic,
        report_summary: report, // Send the correctly structured object
      }, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
    } else {
      // Guest user: save to sessionStorage
      
      const guestHistoryString = sessionStorage.getItem('guestReportHistory');
      const guestHistory = guestHistoryString ? JSON.parse(guestHistoryString) : [];
      guestHistory.unshift(report); // Add new report to the beginning of the array
      sessionStorage.setItem('guestReportHistory', JSON.stringify(guestHistory));
    }
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};
