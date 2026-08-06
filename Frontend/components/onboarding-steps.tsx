import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, Check, Search, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// Progress Indicator Component
export function ProgressIndicator({ step, totalSteps }: { step: number; totalSteps: number }) {
  const progress = ((step - 1) / (totalSteps - 2)) * 100

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground" style={{ fontFamily: "Figtree" }}>
          Step {step} of {totalSteps - 2}
        </span>
        <span className="text-sm font-medium text-[#156d95]" style={{ fontFamily: "Figtree" }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6]"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// Step Container
export function StepContainer({ 
  children, 
  step, 
  totalSteps, 
  onNext, 
  onBack,
  isValid = true,
  title,
  subtitle
}: {
  children: React.ReactNode
  step: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  isValid?: boolean
  title: string
  subtitle: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-3xl w-full"
    >
      <ProgressIndicator step={step} totalSteps={totalSteps} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "Figtree" }}>
            {title}
          </h2>
          <p className="text-lg text-muted-foreground" style={{ fontFamily: "Figtree" }}>
            {subtitle}
          </p>
        </div>

        {children}

        <div className="flex items-center justify-between mt-10 pt-8 border-t border-border">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] hover:from-[#0e5a7a] hover:to-[#6d28d9] text-white px-8"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Selection Card Component
export function SelectionCard({
  icon: Icon,
  label,
  description,
  isSelected,
  onClick,
}: {
  icon: React.ElementType
  label: string
  description?: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl border-2 transition-all text-left w-full
        ${isSelected 
          ? "border-[#156d95] bg-[#156d95]/10" 
          : "border-border bg-card hover:border-[#156d95]/50"
        }
      `}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#156d95] flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${isSelected 
            ? "bg-gradient-to-br from-[#156d95] to-[#8b5cf6]" 
            : "bg-muted"
          }
        `}>
          <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1">
          <div className={`font-semibold mb-1 ${isSelected ? "text-[#156d95]" : "text-foreground"}`}>
            {label}
          </div>
          {description && (
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  )
}

// Chip Component for Multi-Select
export function SelectableChip({
  label,
  isSelected,
  onClick,
}: {
  label: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full font-medium transition-all border-2
        ${isSelected 
          ? "bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white border-transparent" 
          : "bg-card text-foreground border-border hover:border-[#156d95]/50"
        }
      `}
    >
      {isSelected && <Check className="w-4 h-4 inline mr-1" />}
      {label}
    </motion.button>
  )
}

// Basic Info Step
export function BasicInfoStep({
  data,
  updateData,
  onNext,
  onBack,
  step,
  totalSteps,
}: any) {
  const [languageInput, setLanguageInput] = useState("")

  const addLanguage = () => {
    if (languageInput.trim() && !data.languages.includes(languageInput.trim())) {
      updateData("languages", [...data.languages, languageInput.trim()])
      setLanguageInput("")
    }
  }

  const removeLanguage = (lang: string) => {
    updateData("languages", data.languages.filter((l: string) => l !== lang))
  }

  const isValid = data.name && data.age && data.gender && data.location && data.profession

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
      title="Let's start with the basics"
      subtitle="Help your Twin understand who you are"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <Input
              value={data.name}
              onChange={(e) => updateData("name", e.target.value)}
              placeholder="Enter your name"
              className="h-12"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Age</label>
            <Input
              type="number"
              value={data.age}
              onChange={(e) => updateData("age", e.target.value)}
              placeholder="25"
              className="h-12"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {["Male", "Female", "Non-binary"].map((gender) => (
              <Button
                key={gender}
                type="button"
                variant={data.gender === gender ? "default" : "outline"}
                className={`h-12 ${data.gender === gender ? "bg-[#156d95]" : ""}`}
                onClick={() => updateData("gender", gender)}
              >
                {data.gender === gender && <Check className="w-4 h-4 mr-2" />}
                {gender}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <Input
            value={data.location}
            onChange={(e) => updateData("location", e.target.value)}
            placeholder="City, Country"
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Profession</label>
          <Input
            value={data.profession}
            onChange={(e) => updateData("profession", e.target.value)}
            placeholder="Software Engineer, Designer, etc."
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Languages</label>
          <div className="flex gap-2 mb-3">
            <Input
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
              placeholder="Add a language"
              className="h-12"
            />
            <Button onClick={addLanguage} type="button" className="bg-[#156d95]">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang: string) => (
              <Badge
                key={lang}
                variant="secondary"
                className="px-3 py-1 cursor-pointer hover:bg-destructive/20"
                onClick={() => removeLanguage(lang)}
              >
                {lang} ×
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </StepContainer>
  )
}

// Continue with more components...