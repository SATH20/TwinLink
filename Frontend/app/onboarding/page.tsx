"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@clerk/nextjs"
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
import { registerUser, updateProfile, createTwin, ApiError, getFriendlyErrorMessage } from "@/lib/api-client"
import { transformOnboardingData, validateOnboardingData } from "@/lib/onboarding-transformer"

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
  const [apiError, setApiError] = useState<string | null>(null)
  const [isApiComplete, setIsApiComplete] = useState(false)
  const isSubmitting = useRef(false) // Prevent duplicate submissions
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
  const { getToken } = useAuth()
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

  /**
   * Handles the complete onboarding flow:
   * 1. Validate all fields
   * 2. Show the generating animation (step 10)
   * 3. Register/sync user with backend
   * 4. Transform & send profile data
   * 5. Create Digital Twin
   * 6. Mark onboarding complete in Clerk
   * 7. Redirect to Dashboard
   */
  const handleComplete = async () => {
    // Prevent duplicate submissions
    if (isSubmitting.current) return
    isSubmitting.current = true

    // Validate before submission
    const validation = validateOnboardingData(formData)
    if (!validation.isValid) {
      setApiError(validation.errors.join(". "))
      isSubmitting.current = false
      return
    }

    // Reset state and show generating animation
    setApiError(null)
    setIsApiComplete(false)
    setIsLoading(true)
    setStep(10) // Show GeneratingTwinStep

    try {
      // Step 1: Get Clerk authentication token
      const token = await getToken()
      if (!token) {
        throw new ApiError(401, "Authentication error. Please sign in again.", "AUTH_ERROR")
      }

      // Step 2: Register/sync user with backend
      // This creates the user in Firestore if they don't exist
      try {
        await registerUser(token)
      } catch (error) {
        // If registration fails with a non-critical error, log and continue
        // The profile update will create the user record anyway
        if (error instanceof ApiError && error.status !== 0) {
          console.warn("User registration warning:", error.message)
        } else {
          throw error
        }
      }

      // Step 3: Transform frontend data to backend DTO format
      const profilePayload = transformOnboardingData(formData)

      // Step 4: Send profile data to backend
      const profileResponse = await updateProfile(token, profilePayload)
      console.log("Profile updated, completeness:", profileResponse.completenessScore)

      // Step 5: Create Digital Twin
      // Backend will: check completeness >= 60%, call FastAPI, store twin in Firestore
      try {
        const twinResponse = await createTwin(token)
        console.log("Twin created:", twinResponse.id, "Status:", twinResponse.status)
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          // Twin already exists — this is fine, continue
          console.log("Twin already exists, continuing...")
        } else {
          throw error
        }
      }

      // Step 6: Mark onboarding as complete in Clerk metadata
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboardingComplete: true,
          onboardingData: formData,
        },
      })

      // Step 7: Signal animation that API is done
      setIsApiComplete(true)
      // The GeneratingTwinStep component will call handleAnimationComplete
      // when both the animation and API are finished

    } catch (error) {
      console.error("Onboarding error:", error)
      const message = getFriendlyErrorMessage(error)
      setApiError(message || "Something went wrong. Please try again.")
      isSubmitting.current = false
    }
  }

  /**
   * Called by GeneratingTwinStep when both the animation
   * and API call are complete. Redirects to Dashboard.
   */
  const handleAnimationComplete = useCallback(() => {
    router.push("/dashboard")
  }, [router])

  /**
   * Retry handler for when twin generation fails.
   * Resets error state and re-triggers the full flow.
   */
  const handleRetry = useCallback(() => {
    setApiError(null)
    setIsApiComplete(false)
    isSubmitting.current = false
    // Re-trigger the complete flow
    handleComplete()
  }, [formData, user])

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

        {step === 10 && (
          <GeneratingTwinStep
            key="generating"
            error={apiError}
            onRetry={handleRetry}
            onComplete={handleAnimationComplete}
            isApiComplete={isApiComplete}
          />
        )}
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
