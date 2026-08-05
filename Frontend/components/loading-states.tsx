"use client"

import { motion } from "framer-motion"
import { Bot, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Dashboard Loading
export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5 p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <Skeleton className="h-20 w-full rounded-3xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    </div>
  )
}

// Recommendations Loading
export function RecommendationsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-96 rounded-2xl" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

// Conversations Loading
export function ConversationsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Twin Generation Loading
export function TwinGenerationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative w-32 h-32 mx-auto"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#156d95] to-[#8b5cf6] opacity-20 blur-2xl" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center">
            <Bot className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Generating Your Digital Twin</h2>
          <p className="text-muted-foreground">This may take a few moments...</p>
        </div>

        <div className="w-64 mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/3 bg-gradient-to-r from-[#156d95] to-[#8b5cf6]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Notifications Loading
export function NotificationsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5 p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Generic Loading Spinner
export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="flex items-center justify-center"
    >
      <Loader2 className={`${sizeClasses[size]} text-[#156d95]`} />
    </motion.div>
  )
}

// Full Page Loading
export function FullPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center"
        >
          <Bot className="w-8 h-8 text-white" />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Loading...</h3>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </motion.div>
    </div>
  )
}
