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
    if (step < TOTAL_STEPS - 2) {
      // Steps 0-8: advance to next step
      setStep(step + 1)
    } else {
      // Step 9 (ReviewStep): trigger submission + twin generation
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
    console.log("1. handleComplete() called")

    // Prevent duplicate submissions
    if (isSubmitting.current) {
      console.log("1a. Already submitting, returning early")
      return
    }
    isSubmitting.current = true

    // Validate before submission
    const validation = validateOnboardingData(formData)
    if (!validation.isValid) {
      console.log("1b. Validation failed:", validation.errors)
      setApiError(validation.errors.join(". "))
      isSubmitting.current = false
      return
    }
    console.log("2. Validation passed")

    // Reset state and show generating animation
    setApiError(null)
    setIsApiComplete(false)
    setIsLoading(true)
    setStep(10) // Show GeneratingTwinStep
    console.log("3. Showing generating animation (step 10)")

    try {
      // Step 1: Get Clerk authentication token
      console.log("4. Getting Clerk token...")
      const token = await getToken()
      console.log("5. Token received:", token ? "OK (length=" + token.length + ")" : "NULL")
      if (!token) {
        throw new ApiError(401, "Authentication error. Please sign in again.", "AUTH_ERROR")
      }

      // Step 2: Register/sync user with backend
      console.log("6. Registering user with backend...")
      try {
        await registerUser(token, user?.fullName ?? undefined)
        console.log("7. User registered successfully")
      } catch (error) {
        if (error instanceof ApiError && error.status !== 0) {
          console.warn("7. User registration warning (non-fatal):", error.message)
        } else {
          throw error
        }
      }

      // Step 3: Transform frontend data to backend DTO format
      console.log("8. Transforming onboarding data...")
      const profilePayload = transformOnboardingData(formData)
      console.log("9. Profile payload ready, keys:", Object.keys(profilePayload))

      // Step 4: Send profile data to backend
      console.log("10. Calling updateProfile...")
      const profileResponse = await updateProfile(token, profilePayload)
      console.log("11. Profile updated. Completeness:", profileResponse.completenessScore)

      // Step 5: Create Digital Twin
      console.log("12. Calling createTwin...")
      try {
        const twinResponse = await createTwin(token)
        console.log("13. Twin created. ID:", twinResponse.id, "Status:", twinResponse.status)
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          console.log("13. Twin already exists (409) — continuing")
        } else {
          throw error
        }
      }

      // Step 6: Mark onboarding as complete in Clerk metadata
      console.log("14. Updating Clerk metadata...")
      try {
        await user?.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            onboardingComplete: true,
          },
        })
        console.log("15. Clerk metadata updated")
      } catch (clerkError) {
        // Non-fatal: Clerk metadata update failure should not block redirect
        console.warn("15. Clerk metadata update failed (non-fatal):", clerkError)
      }

      // Step 7: Force Clerk to refresh the session token so the middleware
      // sees the updated unsafeMetadata (onboardingComplete: true) in the new JWT.
      // Without this, the middleware reads the stale token minted at sign-in time,
      // sees onboardingComplete: undefined, and redirects back to /onboarding.
      console.log("16. Forcing Clerk token refresh (skipCache: true)...")
      await getToken({ skipCache: true })
      console.log("17. Token refreshed — JWT now contains updated metadata")

      // Step 8: Signal animation that API is done
      console.log("18. Setting isApiComplete = true")
      setIsApiComplete(true)

      // Step 9: Redirect — wait briefly for animation to show 100%
      console.log("19. Waiting 1500ms for animation to reach 100%...")
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log("20. Calling router.replace('/dashboard')...")
      router.replace("/dashboard")
      console.log("21. router.replace() called — navigation in progress")


    } catch (error) {
      console.error("ERROR in handleComplete:", error)
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
