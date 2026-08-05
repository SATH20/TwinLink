"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Bot, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BasicInfoStep } from "@/components/onboarding-steps"
import { 
  PersonalityStep, 
  InterestsStep, 
  LifestyleStep,
  CommunicationStyleStep,
  GoalsStep,
  RelationshipIntentStep,
  DealBreakersStep
} from "@/components/onboarding-steps-2"
import { ReviewStep, GeneratingTwinStep } from "@/components/onboarding-final-steps"

// Types
interface OnboardingData {
  name: string
  age: string
  gender: string
  location: string
  languages: string[]
  profession: string
  personality: string[]
  interests: string[]
  lifestyle: string[]
  communicationStyle: string[]
  goals: string[]
  relationshipIntent: string[]
  dealBreakers: string[]
}

const TOTAL_STEPS = 11

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    age: "",
    gender: "",
    location: "",
    languages: [],
    profession: "",
    personality: [],
    interests: [],
    lifestyle: [],
    communicationStyle: [],
    goals: [],
    relationshipIntent: [],
    dealBreakers: []
  })

  const { user } = useUser()
  const router = useRouter()

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboardingComplete: true,
          onboardingData: formData,
        },
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 6000)
    } catch (error) {
      console.error("Onboarding completion error:", error)
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayValue = (field: keyof OnboardingData, value: string) => {
    const currentArray = formData[field] as string[]
    if (currentArray.includes(value)) {
      updateFormData(field, currentArray.filter(item => item !== value))
    } else {
      updateFormData(field, [...currentArray, value])
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#156d95]/5 via-background to-[#8b5cf6]/5 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 0 && <WelcomeScreen key="welcome" onNext={handleNext} />}
        
        {step === 1 && (
          <BasicInfoStep
            key="basic-info"
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            step={2}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 2 && (
          <PersonalityStep
            key="personality"
            selected={formData.personality}
            onToggle={(value: string) => toggleArrayValue("personality", value)}
            onNext={handleNext}
            onBack={handleBack}
            step={3}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 3 && (
          <InterestsStep
            key="interests"
            selected={formData.interests}
            onToggle={(value: string) => toggleArrayValue("interests", value)}
            onNext={handleNext}
            onBack={handleBack}
            step={4}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 4 && (
          <LifestyleStep
            key="lifestyle"
            selected={formData.lifestyle}
            onToggle={(value: string) => toggleArrayValue("lifestyle", value)}
            onNext={handleNext}
            onBack={handleBack}
            step={5}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 5 && (
          <CommunicationStyleStep
            key="communication"
            selected={formData.communicationStyle}
            onToggle={(value: string) => toggleArrayValue("communicationStyle", value)}
            onNext={handleNext}
            onBack={handleBack}
            step={6}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 6 && (
          <GoalsStep
            key="goals"
            selected={formData.goals}
            onToggle={(value: string) => toggleArrayValue("goals", value)}
            onNext={handleNext}
            onBack={handleBack}
            step={7}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 7 && (
          <RelationshipIntentStep
            key="relationship"
            selected={formData.relationshipIntent}
            onToggle={(value: string) => toggleArrayValue("relationshipIntent", value)}
            onNext={handleNext}
            onBack={handleBack}
            step={8}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 8 && (
          <DealBreakersStep
            key="dealbreakers"
            selected={formData.dealBreakers}
            onToggle={(value: string) => toggleArrayValue("dealBreakers", value)}
            onNext={handleNext}
            onBack={handleBack}
            step={9}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 9 && (
          <ReviewStep
            key="review"
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onEdit={(stepNum: number) => setStep(stepNum)}
            step={10}
            totalSteps={TOTAL_STEPS}
          />
        )}

        {step === 10 && <GeneratingTwinStep key="generating" />}
      </AnimatePresence>
    </div>
  )
}

// Welcome Screen Component
function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl w-full text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center relative"
      >
        <Bot className="w-16 h-16 text-white" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#156d95] to-[#8b5cf6] blur-xl"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl font-bold text-foreground mb-4"
        style={{ fontFamily: "Figtree" }}
      >
        Let's Create Your Digital Twin
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto"
        style={{ fontFamily: "Figtree" }}
      >
        Your Twin will understand who you are and represent you across the TwinLink Network.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] hover:from-[#0e5a7a] hover:to-[#6d28d9] text-white h-14 px-8 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Building My Twin
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
