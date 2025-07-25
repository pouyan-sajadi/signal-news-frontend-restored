import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card } from "../ui/card"
import { PreferencesPanel } from "./PreferencesPanel"
import { ReportPreferences } from "../../pages/HomePage"

interface TopicInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  disabled?: boolean
  preferences: ReportPreferences
  onPreferencesChange: (preferences: ReportPreferences) => void
}

export function TopicInput({ 
  value, 
  onChange, 
  onGenerate, 
  disabled = false,
  preferences,
  onPreferencesChange
}: TopicInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!disabled) {
      onGenerate()
    }
  }

  return (
    <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter any news topic... (e.g., 'AI developments in healthcare', 'Climate change policies 2024')"
            className={`pl-10 h-14 text-lg transition-all duration-200 ${
              isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
            disabled={disabled}
          />
        </div>

        {/* Integrated Preferences Panel */}
        <PreferencesPanel
          preferences={preferences}
          onChange={onPreferencesChange}
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            disabled={!value.trim() || disabled}
          >
            <Sparkles className="h-5 w-5" />
            {disabled ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </form>
    </Card>
  )
}