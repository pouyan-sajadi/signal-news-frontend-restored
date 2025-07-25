import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Share2, Download, Bookmark, MoreHorizontal } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { ReportContent } from "../components/report/ReportContent"
import { NerdStats } from "../components/report/NerdStats"
import { RelatedTopics } from "../components/report/RelatedTopics"
import { FinalReportData } from "../api/reports"
import { useToast } from "../hooks/useToast"

export interface Report {
  topic: string;
  content: string;
  preferences: {
    focus: string;
    depth: number;
    tone: string;
  };
  stats: {
    searchQueries: string[];
    sourcesAnalyzed: number;
    sourcesSelected: number;
    processingTime: number;
    generatedAt: string;
  };
  sources: Array<{
    title: string;
    url: string;
    domain: string;
  }>;
  relatedTopics: string[];
}

export function ReportPage() {
  const { id } = useParams<{ id: string }>() // `id` here is actually the slug from the topic
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    if (location.state && (location.state as { report: FinalReportData }).report) {
      const finalReportData = (location.state as { report: FinalReportData }).report;
      // Map FinalReportData to Report interface
      const mappedReport: Report = {
        topic: finalReportData.topic,
        content: finalReportData.agent_details.editing,
        preferences: {
          focus: "N/A", // Preferences are not directly in FinalReportData, might need to be passed separately or inferred
          depth: 0,
          tone: "N/A",
        },
        stats: {
          searchQueries: finalReportData.agent_details.search.map((s: any) => s.query || ""), // Assuming search has a query field
          sourcesAnalyzed: 0, // Not directly available in current FinalReportData
          sourcesSelected: 0, // Not directly available
          processingTime: 0, // Not directly available
          generatedAt: new Date().toISOString(),
        },
        sources: [], // Not directly available
        relatedTopics: [], // Not directly available
      };

      // Attempt to extract preferences if available in agent_details or other parts
      // This part might need adjustment based on actual backend output for preferences
      if (finalReportData.agent_details.synthesis) {
        // Example: if synthesis contains preferences, parse it
        // This is a placeholder, actual parsing logic depends on backend output
        try {
          const synthesisDetails = JSON.parse(finalReportData.agent_details.synthesis);
          if (synthesisDetails.preferences) {
            mappedReport.preferences = synthesisDetails.preferences;
          }
        } catch (e) {
          // Ignore if not JSON or preferences not found
        }
      }

      // Populate stats and sources if available in agent_details
      if (finalReportData.agent_details.search && finalReportData.agent_details.search.length > 0) {
        mappedReport.stats.sourcesAnalyzed = finalReportData.agent_details.search.length; // Assuming each search entry is an analyzed source
      }
      if (finalReportData.agent_details.selection && finalReportData.agent_details.selection.length > 0) {
        mappedReport.stats.sourcesSelected = finalReportData.agent_details.selection.length; // Assuming each selection entry is a selected source
      }

      setReport(mappedReport);
      setLoading(false);
    } else {
      // If navigated directly or state is lost, show error and redirect
      toast({
        title: "Report Not Found",
        description: "Report data could not be loaded. Please generate a new report.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [location.state, navigate, toast]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Report link copied to clipboard"
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-muted-foreground">Report not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Bookmark className="h-4 w-4" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowStats(!showStats)}
            className="gap-2"
          >
            <MoreHorizontal className="h-4 w-4" />
            Stats
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <Card className="p-6 mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The Signal Report: {report.topic}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{report.preferences.focus}</Badge>
            <Badge variant="secondary">Depth: {report.preferences.depth}/5</Badge>
            <Badge variant="secondary">{report.preferences.tone}</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Generated on {new Date(report.stats.generatedAt).toLocaleDateString()} • 
            {report.stats.sourcesSelected} sources analyzed
          </p>
        </div>
      </Card>

      {/* Nerd Stats */}
      {showStats && (
        <div className="mb-8">
          <NerdStats stats={report.stats} sources={report.sources} />
        </div>
      )}

      {/* Report Content */}
      <div className="mb-8">
        <ReportContent content={report.content} />
      </div>

      {/* Related Topics */}
      <RelatedTopics 
        topics={report.relatedTopics}
        onTopicSelect={(topic) => {
          console.log("Selected related topic:", topic)
          navigate("/", { state: { selectedTopic: topic } })
        }}
      />
    </div>
  )
}