import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { HeroSection } from "../components/home/HeroSection"
import { DailyNewsDashboard } from "../components/home/DailyNewsDashboard"
import { TopicInput } from "../components/home/TopicInput"
import { QuickTopics } from "../components/home/QuickTopics"
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
    focus: "General Overview",
    depth: 3,
    tone: "Neutral"
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
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
      const finalReport = await generateReport({
        topic: topic.trim(),
        preferences,
        onProgress: (message: string, progressData?: any) => {
          console.log("Processing step:", message)
          setProcessingStep(message)
          
          if (progressData && progressData.step) {
            const stepIndex = steps.findIndex(s => progressData.step.toLowerCase().includes(s.id))
            if (stepIndex !== -1) {
              setCurrentStepIndex(stepIndex)
              setProgress(((stepIndex + 1) / steps.length) * 100)
            }
          }
        }
      })

      console.log("Report generated successfully:", finalReport)
      // Navigate to the report page, passing the full report data in state
      navigate(`/report/${finalReport.topic.replace(/\s+/g, '-').toLowerCase()}`, { state: { report: finalReport } })
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <HeroSection />

      <div className="mt-12 space-y-8">
        {/* Daily News Dashboard */}
        {!isGenerating && (
          <DailyNewsDashboard />
        )}

        {/* Topic Input with Integrated Preferences */}
        <TopicInput
          value={topic}
          onChange={setTopic}
          onGenerate={handleGenerateReport}
          disabled={isGenerating}
          preferences={preferences}
          onPreferencesChange={setPreferences}
        />

        {!isGenerating && (
          <QuickTopics onTopicSelect={setTopic} />
        )}

        {/* Inline Processing Status */}
        {isGenerating && (
          <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Generating Report</h3>
                  <p className="text-muted-foreground mt-1">
                    Topic: <span className="font-medium">{topic}</span>
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCancelGeneration}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      index === currentStepIndex
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : index < currentStepIndex
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      index === currentStepIndex
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'
                        : index < currentStepIndex
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-600'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.icon}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>

                    {index === currentStepIndex && (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-xs text-blue-600">Processing...</span>
                      </div>
                    )}

                    {index < currentStepIndex && (
                      <div className="text-green-600">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Current Status */}
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {processingStep || "Initializing..."}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}