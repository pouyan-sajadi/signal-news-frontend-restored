import { useEffect, useState } from "react";
import { getReportHistory } from "../../api/reports";
import { Report } from "../../pages/ReportPage";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { History, FileText, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { deleteReport } from "../../api/reports"; // Will create this function next
import { useToast } from "../../hooks/useToast";

export function ReportHistory() {
  const [history, setHistory] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getReportHistory();
        // Sort by timestamp in descending order (newest first)
        const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        // Log the timestamp of the first item after it has been sorted
        if (sortedData && sortedData.length > 0) {
          console.log(`Component pre-render (ReportHistory): First item timestamp is ${sortedData[0].timestamp}`);
        }
        setHistory(sortedData);
      } catch (err) {
        setError("Failed to load report history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    // Use formatDistanceToNow for relative time and format for older dates
    // addSuffix: true adds "ago"
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleViewReport = (report: Report) => {
    // Navigate to the report page, passing the job_id
    navigate(`/report/${report.job_id}`);
  };

  const handleDeleteReport = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Signed-in user: Delete from database via API
        await deleteReport(jobId);
        toast({
          title: "Report Deleted",
          description: "Report successfully removed from your history.",
        });
      } else {
        // Guest user: Delete from sessionStorage
        const guestHistoryString = sessionStorage.getItem('guestReportHistory');
        let guestHistory = guestHistoryString ? JSON.parse(guestHistoryString) : [];
        guestHistory = guestHistory.filter(report => report.job_id !== jobId);
        sessionStorage.setItem('guestReportHistory', JSON.stringify(guestHistory));
        toast({
          title: "Report Deleted",
          description: "Report successfully removed from session history.",
        });
      }

      // Update local state to reflect deletion
      setHistory(prevHistory => prevHistory.filter(report => report.job_id !== jobId));

    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Deletion Failed",
        description: "Could not delete the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading report history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="report-history-section">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Report History
          </CardTitle>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground">No reports generated yet. Generate your first report above!</p>
          ) : (
            <div className="space-y-4">
              {history.map((report) => (
                <div
                  key={report.job_id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">News report on: {report.refined_topic || report.topic}</p>
                    <p className="text-sm text-muted-foreground">
                      Generated {formatTimestamp(report.timestamp)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                    <FileText className="w-4 h-4 mr-2" /> View Report
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.job_id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}