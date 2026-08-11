import { motion } from "framer-motion"
import { Edit2, Check, Sparkles, Bot, Zap, Brain, Network, Shield, XCircle, RefreshCw } from "lucide-react"
import { StepContainer } from "./onboarding-steps"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useState, useEffect, useRef, useCallback } from "react"

// Review Step
export function ReviewStep({ data, onNext, onBack, onEdit, step, totalSteps }: any) {
  const sections = [
    {
      title: "Basic Information",
      editStep: 1,
      items: [
        { label: "Name", value: data.name },
        { label: "Age", value: data.age },
        { label: "Gender", value: data.gender },
        { label: "Location", value: data.location },
        { label: "Profession", value: data.profession },
        { label: "Languages", value: data.languages.join(", ") || "None" },
      ]
    },
    {
      title: "Personality",
      editStep: 2,
      items: [{ label: "Traits", value: data.personality.join(", ") || "None" }]
    },
    {
      title: "Interests",
      editStep: 3,
      items: [{ label: "Interests", value: data.interests.slice(0, 10).join(", ") + (data.interests.length > 10 ? "..." : "") || "None" }]
    },
    {
      title: "Lifestyle",
      editStep: 4,
      items: [{ label: "Preferences", value: data.lifestyle.join(", ") || "None" }]
    },
    {
      title: "Communication",
      editStep: 5,
      items: [{ label: "Style", value: data.communicationStyle.join(", ") || "None" }]
    },
    {
      title: "Goals",
      editStep: 6,
      items: [{ label: "Objectives", value: data.goals.join(", ") || "None" }]
    },
    {
      title: "Connection Intent",
      editStep: 7,
      items: [{ label: "Looking for", value: data.relationshipIntent.join(", ") || "None" }]
    },
    {
      title: "Deal Breakers",
      editStep: 8,
      items: [{ label: "Avoid", value: data.dealBreakers.join(", ") || "None selected" }]
    },
  ]

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      isValid={true}
      title="Review your profile"
      subtitle="Make sure everything looks good before creating your Digital Twin."
    >
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl border border-border bg-card hover:border-[#156d95]/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(section.editStep)}
                className="text-[#156d95] hover:text-[#0e5a7a]"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-sm text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#156d95]/10 via-[#8b5cf6]/10 to-[#0ea5e9]/10 border border-[#156d95]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Ready to create your Twin?</h4>
            <p className="text-sm text-muted-foreground">
              Your AI Digital Twin will be trained with this information to represent you authentically across the TwinLink network.
            </p>
          </div>
        </div>
      </div>
    </StepContainer>
  )
}

// Generating Twin Step - The Most Important Screen
export function GeneratingTwinStep({ 
  error,
  onRetry,
  onComplete,
  isApiComplete = false,
}: { 
  error?: string | null
  onRetry?: () => void
  onComplete?: () => void
  isApiComplete?: boolean
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [animationDone, setAnimationDone] = useState(false)

  const steps = [
    { text: "Initializing AI...", icon: Bot, progress: 0 },
    { text: "Learning your personality...", icon: Brain, progress: 15 },
    { text: "Building reasoning profile...", icon: Zap, progress: 30 },
    { text: "Creating communication model...", icon: Network, progress: 50 },
    { text: "Preparing Digital Twin memory...", icon: Shield, progress: 70 },
    { text: "Connecting to TwinLink Network...", icon: Network, progress: 85 },
    { text: "Almost Ready...", icon: Sparkles, progress: 95 },
    { text: "Your Digital Twin is Ready!", icon: Check, progress: 100 },
  ]

  const FINAL_STEP = steps.length - 1
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Clear interval helper
  const clearAnimationInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Main animation: advance steps on a timer
  useEffect(() => {
    if (error) {
      clearAnimationInterval()
      return
    }

    // Determine speed: fast (400ms) if API is done and we're catching up, normal (750ms) otherwise
    const speed = isApiComplete ? 400 : 750

    clearAnimationInterval()
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        // Pause at step 6 if API hasn't finished yet
        if (prev >= 6 && !isApiComplete) {
          return prev
        }
        // Advance if not at the end
        if (prev < FINAL_STEP) {
          return prev + 1
        }
        // Already at the end, stop advancing
        return prev
      })
    }, speed)

    return clearAnimationInterval
  }, [isApiComplete, error, clearAnimationInterval, FINAL_STEP])

  // Detect when animation reaches the final step
  useEffect(() => {
    if (currentStep === FINAL_STEP && !animationDone) {
      clearAnimationInterval()
      setAnimationDone(true)
    }
  }, [currentStep, FINAL_STEP, animationDone, clearAnimationInterval])

  // When both animation is done and API is complete, call onComplete
  useEffect(() => {
    if (animationDone && isApiComplete && onComplete) {
      // Small delay so user sees the "Ready!" state
      const timeout = setTimeout(() => {
        onComplete()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [animationDone, isApiComplete, onComplete])


  const CurrentIcon = steps[currentStep].icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl w-full"
    >
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-12 shadow-2xl">
        {/* Animated Twin Icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center">
              <Bot className="w-16 h-16 text-white" />
            </div>
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#156d95] to-[#8b5cf6] blur-2xl"
            />
          </motion.div>
        </div>

        {/* Current Step */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <CurrentIcon className="w-6 h-6 text-[#156d95]" />
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
              {steps[currentStep].text}
            </h2>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#156d95] via-[#8b5cf6] to-[#0ea5e9]"
              initial={{ width: "0%" }}
              animate={{ width: `${steps[currentStep].progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-muted-foreground">{steps[currentStep].progress}%</span>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Something went wrong</h4>
                <p className="text-sm text-muted-foreground mb-3">{error}</p>
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] hover:from-[#0e5a7a] hover:to-[#6d28d9] text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Visual AI Training Sequence */}
        {!error && (
          <div className="space-y-2 font-mono text-sm">
            {steps.slice(0, currentStep + 1).map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-[#156d95]"
              >
                <Check className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs md:text-sm">{step.text}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Terminal-like Effect */}
        {!error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-border"
          >
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-[#156d95]">█</span> Processing neural patterns...
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <span className="text-[#8b5cf6]">█</span> Syncing with network nodes...
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              >
                <span className="text-[#0ea5e9]">█</span> Calibrating personality matrix...
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Particle Animation */}
        {!error && (
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

