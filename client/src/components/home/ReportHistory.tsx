import { useEffect, useState } from "react";
import { getReportHistory, ReportPreferences } from "../../api/reports";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { History, FileText } from "lucide-react";

interface HistoricalReport {
  job_id: string;
  topic: string;
  timestamp: string;
  user_preferences: ReportPreferences;
}

export function ReportHistory() {
  const [history, setHistory] = useState<HistoricalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" /> Report History
        </CardTitle>
      </CardHeader>
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
                  <p className="font-medium">{report.topic}</p>
                  <p className="text-sm text-muted-foreground">
                    Generated {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
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
    </Card>
  );
}
