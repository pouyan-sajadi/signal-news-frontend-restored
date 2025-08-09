import { useEffect, useState } from "react";
import { getReportHistory } from "../../api/reports";
import { Report } from "../../pages/ReportPage";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { History, FileText, ChevronDown, ChevronUp } from "lucide-react";



export function ReportHistory() {
  const [history, setHistory] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getReportHistory();
        // Sort by timestamp in descending order (newest first)
        const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
    const date = new Date(timestamp); // This is now correctly parsed as UTC
    const now = new Date(); // Get current local time
    const nowUtc = new Date(now.toUTCString()); // Convert current local time to UTC Date object

    const diffMs = nowUtc.getTime() - date.getTime(); // Calculate difference using UTC times
    const diffMinutes = Math.round(Math.abs(diffMs) / (1000 * 60));
    const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));

    // To check if 'date' is "today" in UTC:
    const isSameUtcCalendarDay = date.getUTCFullYear() === nowUtc.getUTCFullYear() &&
                                 date.getUTCMonth() === nowUtc.getUTCMonth() &&
                                 date.getUTCDate() === nowUtc.getUTCDate();

    // Case 1: Less than 60 minutes ago
    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } 
    // Case 2: Over 60 minutes but within the same calendar day (UTC)
    else if (isSameUtcCalendarDay) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } 
    // Case 3: Not within the same calendar day (UTC)
    else {
      return format(date, "MMM dd, yyyy"); // This will still format in local time for display
    }
  };

  const handleViewReport = (report: HistoricalReport) => {
    // Navigate to the report page, passing the job_id
    navigate(`/report/${report.job_id}`);
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}