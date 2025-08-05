import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { HeroSection } from "../components/home/HeroSection"
import { Dashboard } from "./Dashboard"
import { GenerateReport } from "../components/home/GenerateReport";
import { ReportHistory } from "../components/home/ReportHistory";
import { generateReport, FinalReportData } from "../api/reports"
import { useToast } from "../hooks/useToast"
import { Card } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Button } from "../components/ui/button"
import { X, Search, BarChart3, Target, Brain, Edit3 } from "lucide-react"

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
      // Navigate to the report page, passing the full report data in state
      navigate(`/report/${job_id}`, { state: { report: finalReport } })
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
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <div className="mt-8">
        <Dashboard />
      </div>
      <div className="mt-12">
        <GenerateReport
          topic={topic}
          setTopic={setTopic}
          preferences={preferences}
          setPreferences={setPreferences}
          isGenerating={isGenerating}
          handleGenerateReport={handleGenerateReport}
          progress={progress}
          currentStepIndex={currentStepIndex}
          refinedTopic={refinedTopic}
          processingStep={processingStep}
          handleCancelGeneration={handleCancelGeneration}
        />
        <div className="mt-12">
          <ReportHistory />
        </div>
      </div>
    </div>
  )
}