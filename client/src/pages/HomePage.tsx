import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Dashboard } from "./Dashboard"
import { TopSearchSection } from "../components/home/TopSearchSection";
import { HeroSection } from "../components/home/HeroSection";

import { generateReport, FinalReportData } from "../api/reports"
import { useToast } from "../hooks/useToast"
import { Card } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Button, ButtonProps } from "../components/ui/button"
import { X, Search, BarChart3, Target, Brain, Edit3 } from "lucide-react"
import { Report } from "../components/home/ReportHistory";

interface OutletContext {
  setReportCount: React.Dispatch<React.SetStateAction<number>>;
}

export interface ReportPreferences {
  focus: string
  depth: number
  tone: string
}

export function HomePage() {
  const [topic, setTopic] = useState("")
  const [preferences, setPreferences] = useState<ReportPreferences>({
    focus: "Just the Facts",
    depth: 1,
    tone: "Express Mode"
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
  const [refinedTopic, setRefinedTopic] = useState("")
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setReportCount } = useOutletContext<OutletContext>();

  const steps = [
    {
      id: "search",
      icon: <Search className="h-4 w-4" />,
      title: "Search Phase",
      description: "Refining search query and finding relevant articles",
      color: "text-blue-500"
    },
    {
      id: "profiling",
      icon: <BarChart3 className="h-4 w-4" />,
      title: "Profiling Phase",
      description: "Analyzing article relevance and quality",
      color: "text-green-500"
    },
    {
      id: "selection",
      icon: <Target className="h-4 w-4" />,
      title: "Selection Phase",
      description: "Selecting the best sources for analysis",
      color: "text-orange-500"
    },
    {
      id: "synthesis",
      icon: <Brain className="h-4 w-4" />,
      title: "Synthesis Phase",
      description: "Generating comprehensive analysis",
      color: "text-purple-500"
    },
    {
      id: "editing",
      icon: <Edit3 className="h-4 w-4" />,
      title: "Editing Phase",
      description: "Polishing final report",
      color: "text-pink-500"
    }
  ]

  const handleGenerateReport = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate a report.",
        variant: "destructive"
      })
      return
    }

    console.log("Starting report generation for topic:", topic)
    setIsGenerating(true)
    setProgress(0)
    setCurrentStepIndex(0)

    try {
      const { job_id, finalReport } = await generateReport({
        topic: topic.trim(),
        preferences,
        onProgress: (message: string, progressData?: any) => {
          console.log("Processing step:", message, progressData)
          setProcessingStep(message)
          
          if (progressData && progressData.step) {
            const stepIndex = steps.findIndex(s => progressData.step.toLowerCase().includes(s.id))
            if (stepIndex !== -1) {
              // Update current step immediately
              setCurrentStepIndex(stepIndex)

              // Update refined topic when available
              if (progressData.refined_topic) {
                setRefinedTopic(progressData.refined_topic)
              }

              // Only update progress when a step is completed
              if (progressData.status === 'completed') {
                setProgress(((stepIndex + 1) / steps.length) * 100)
              }
            }
          }
        }
      })

      console.log("Report generated successfully:", finalReport)
      setReportCount(prev => prev + 1); // Increment report count

      // Construct the Report object to pass to the ReportPage
      const reportToPass: Report = {
        job_id: job_id,
        user_preferences: preferences,
        final_report_data: {
          editing: finalReport.agent_details.editing,
          search: finalReport.agent_details.search,
          profiling: finalReport.agent_details.profiling,
          selection: finalReport.agent_details.selection,
          synthesis: finalReport.agent_details.synthesis,
        },
        topic: topic.trim(),
        refined_topic: refinedTopic || topic.trim(), // Use refined topic if available
        timestamp: new Date().toISOString(),
      };

      // Navigate to the report page, passing the correctly structured report object
      navigate(`/report/${job_id}`, { state: { report: reportToPass } })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
      setProcessingStep("")
      setProgress(0)
      setCurrentStepIndex(0)
    }
  }

  const handleCancelGeneration = () => {
    console.log("Report generation cancelled")
    setIsGenerating(false)
    setProcessingStep("")
    setProgress(0)
    setCurrentStepIndex(0)
  }

  return (
    <div className="container mx-auto py-8 flex flex-col flex-grow">
      <HeroSection />
      <div className="mt-8 flex-grow">
        <Dashboard />
      </div>
      <TopSearchSection
        topic={topic}
        setTopic={setTopic}
        preferences={preferences}
        setPreferences={setPreferences}
        isGenerating={isGenerating}
        handleGenerateReport={handleGenerateReport}
        processingStep={processingStep}
        progress={progress}
        currentStepIndex={currentStepIndex}
        refinedTopic={refinedTopic}
        handleCancelGeneration={handleCancelGeneration}
      />
    </div>
  )
}