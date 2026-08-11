"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, Sparkles, Brain, Activity, Eye, Heart, Zap, Clock, Target, ArrowRight,
  TrendingUp, MessageSquare, Users, BarChart3, RefreshCw, Edit, CheckCircle2,
  Lightbulb, Star, Shield, Compass, Book, Camera, Code, Plane, Dumbbell, Film,
  Wifi, Bell, Network, Cpu, Database, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useMyTwinData } from "@/hooks/use-my-twin-data"
import {
  getTwinName,
  mapPersonalityTraits,
  mapValues,
  mapCommunicationStyle,
  mapGoals,
  generateInsights,
  generateMemoryItems,
  calculateNetworkStats,
  generateLearningTimeline,
  getCurrentMissionText,
  calculateMissionProgress,
  getCurrentMissionStage,
} from "@/lib/utils/my-twin.utils"
import {
  getTwinStatusLabel,
  getTwinStatusColor,
  formatRelativeTime,
  calculateTwinHealth,
  calculateLearningProgress,
  getUserInitials,
} from "@/lib/utils/dashboard.utils"

export default function MyTwinPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const { user: clerkUser } = useUser()
  const { twin, profile, isLoading, error, refetch } = useMyTwinData()

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  // Show loading skeleton
  if (isLoading) {
    return <MyTwinSkeleton />
  }

  // Show error state
  if (error || !twin) {
    return <MyTwinError error={error} onRetry={refetch} />
  }

  const userName = clerkUser?.firstName || 'User'
  const twinName = getTwinName(clerkUser?.fullName || userName)
  const statusColors = getTwinStatusColor(twin.status)
  const twinHealth = calculateTwinHealth(twin)
  const learningProgress = calculateLearningProgress(twin)
  const confidenceScore = twinHealth // Using health as confidence

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground hidden sm:block" style={{ fontFamily: "Figtree" }}>
                TwinLink
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Badge className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} hidden sm:flex`}>
                <span className={`w-2 h-2 rounded-full ${statusColors.text.replace('text-', 'bg-')} mr-2 animate-pulse`} />
                Twin Status: {getTwinStatusLabel(twin.status)}
              </Badge>
              <Link href="/notifications">
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <main className="space-y-6">
            <HeroHeader twin={twin} />
            <DigitalTwinCard twin={twin} twinName={twinName} learningProgress={learningProgress} confidenceScore={confidenceScore} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalityProfile profile={profile} />
              <ValuesSection profile={profile} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommunicationStyle profile={profile} />
              <GoalsSection profile={profile} />
            </div>

            <InterestsSection profile={profile} />
            <CurrentMissionCard twin={twin} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIInsights twin={twin} profile={profile} />
              <LearningTimeline twin={twin} profile={profile} />
            </div>

            <MemorySection twin={twin} profile={profile} />
            <MatchPreferences profile={profile} />
            <NetworkStats twin={twin} />
          </main>

          {/* Right Panel */}
          <aside className="space-y-6">
            <LiveTwinStatus twin={twin} />
          </aside>
        </div>
      </div>
    </div>
  )
}

// Hero Header Section
function HeroHeader({ twin }: { twin: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-foreground tracking-tight" style={{ fontFamily: "Figtree" }}>
            My Digital Twin
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed" style={{ fontFamily: "Figtree" }}>
            Your AI representation continuously learns, reasons, and discovers meaningful connections on your behalf.
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Last Active:</span>
          <span className="text-sm font-bold text-green-600">{formatRelativeTime(twin.lastWake)}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#156d95]/10 border border-[#156d95]/20"
          whileHover={{ scale: 1.05 }}
        >
          <Target className="w-4 h-4 text-[#156d95]" />
          <span className="text-sm text-muted-foreground">Current Mission:</span>
          <span className="text-sm font-bold text-[#156d95]">{getCurrentMissionText(twin)}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Digital Twin Card - Premium
function DigitalTwinCard({ twin, twinName, learningProgress, confidenceScore }: { twin: any; twinName: string; learningProgress: number; confidenceScore: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl border border-[#156d95]/20 bg-gradient-to-br from-[#156d95]/5 via-[#8b5cf6]/5 to-[#0ea5e9]/5 p-8">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15], x: [0, 100, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#156d95] to-[#8b5cf6] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-8">
          <div className="relative">
            <motion.div className="relative w-40 h-40" animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#156d95]/30" />
            </motion.div>
            
            <motion.div animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-3">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#156d95] via-[#8b5cf6] to-[#0ea5e9] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  {[...Array(3)].map((_, i) => (
                    <motion.div key={i} animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                      className="absolute inset-0 rounded-3xl border-2 border-white" />
                  ))}
                </div>
                <Brain className="w-20 h-20 text-white relative z-10" />
              </div>
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#156d95] via-[#8b5cf6] to-[#0ea5e9] blur-2xl -z-10" />
            </motion.div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "Figtree" }}>{twinName}</h2>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="font-mono text-xs px-3 py-1">
                  <Cpu className="w-3 h-3 mr-1.5" />v{twin.version}
                </Badge>
                <Badge className={`${getTwinStatusColor(twin.status).bg} ${getTwinStatusColor(twin.status).text} ${getTwinStatusColor(twin.status).border} px-3 py-1`}>
                  <span className={`w-2 h-2 rounded-full ${getTwinStatusColor(twin.status).text.replace('text-', 'bg-')} mr-2 animate-pulse`} />
                  {getTwinStatusLabel(twin.status)}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Network className="w-3 h-3 mr-1.5" />Neural v2
                </Badge>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
                An advanced AI entity powered by neural reasoning that learns and adapts to represent you authentically across the TwinLink network.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/onboarding">
                <Button className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90 shadow-lg">
                  <Edit className="w-4 h-4 mr-2" />Edit Profile
                </Button>
              </Link>
              <Button variant="outline" className="hover:border-[#156d95]/50 hover:text-[#156d95]" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />Refresh Data
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02, y: -4 }} className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#156d95]/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-[#156d95]" /></div>
                <span className="font-semibold text-foreground">Learning Progress</span>
              </div>
              <span className="text-2xl font-bold text-[#156d95]">{learningProgress}%</span>
            </div>
            <div className="space-y-2">
              <Progress value={learningProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">Continuously improving through interactions</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                <span className="font-semibold text-foreground">Confidence Score</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{confidenceScore}%</span>
            </div>
            <div className="space-y-2">
              <Progress value={confidenceScore} className="h-3" />
              <p className="text-xs text-muted-foreground">High confidence in representing you accurately</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Personality Profile Component
function PersonalityProfile({ profile }: { profile: any }) {
  const personality = profile ? mapPersonalityTraits(profile.personality) : []

  if (personality.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Personality Profile</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">Complete onboarding to see your personality profile</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Personality Profile</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {personality.map((trait) => (
          <motion.div key={trait.trait} whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl border bg-gradient-to-br from-card to-muted/20">
            <div className="flex justify-between mb-2">
              <span className={`text-sm font-bold ${trait.color}`}>{trait.trait}</span>
              <Badge variant="secondary" className="text-xs">{trait.confidence}%</Badge>
            </div>
            <Progress value={trait.confidence} className="h-2" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ValuesSection({ profile }: { profile: any }) {
  const values = profile ? mapValues(profile.values || []) : []

  if (values.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Core Values</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">No values specified yet</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Core Values</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {values.map((item) => (
          <motion.div key={item.value} whileHover={{ scale: 1.03 }}
            className="p-4 rounded-xl border bg-gradient-to-br from-card to-blue-500/5">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-sm">{item.value}</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
            <Progress value={item.strength} className="h-2" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function CommunicationStyle({ profile }: { profile: any }) {
  const styles = profile ? mapCommunicationStyle(profile.communicationStyle || '') : []

  if (styles.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Communication Style</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">No communication style specified</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Communication Style</h3>
      </div>
      <div className="space-y-3">
        {styles.map((item) => (
          <div key={item.style} className="p-4 rounded-xl border bg-gradient-to-r from-card to-green-500/5">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{item.style}</span>
              <span className="text-sm font-bold text-green-600">{item.level}%</span>
            </div>
            <Progress value={item.level} className="h-2" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function InterestsSection({ profile }: { profile: any }) {
  const interests = profile?.interests || []
  
  // Icon mapping for interests
  const getInterestIcon = (interest: string) => {
    const iconMap: Record<string, any> = {
      technology: Code,
      ai: Brain,
      movies: Film,
      travel: Plane,
      gaming: Zap,
      fitness: Dumbbell,
      books: Book,
      photography: Camera,
      music: Heart,
      art: Sparkles,
      sports: Activity,
    }
    
    const lowerInterest = interest.toLowerCase()
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerInterest.includes(key)) return icon
    }
    return Heart
  }

  const getInterestColor = (index: number) => {
    const colors = [
      "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "bg-pink-500/10 text-pink-500 border-pink-500/20",
      "bg-green-500/10 text-green-500 border-green-500/20",
      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
      "bg-teal-500/10 text-teal-500 border-teal-500/20",
    ]
    return colors[index % colors.length]
  }

  if (interests.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Interests & Passions</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">No interests specified yet</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Interests & Passions</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {interests.map((interest: string, index: number) => {
          const InterestIcon = getInterestIcon(interest)
          return (
            <motion.div key={interest} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-xl border ${getInterestColor(index)} cursor-pointer flex items-center gap-2 font-medium`}>
              <InterestIcon className="w-4 h-4" />
              <span>{interest}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function GoalsSection({ profile }: { profile: any }) {
  const goals = profile ? mapGoals(profile.goals || {}) : []

  if (goals.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Goals & Intentions</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">No goals specified yet</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Goals & Intentions</h3>
      </div>
      <div className="space-y-3">
        {goals.map((goal: string) => (
          <motion.div key={goal} whileHover={{ x: 4 }}
            className="p-4 rounded-xl border bg-gradient-to-br from-card to-yellow-500/5 flex items-center gap-3 group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="font-medium flex-1">{goal}</span>
            <CheckCircle2 className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function CurrentMissionCard({ twin }: { twin: any }) {
  const missionProgress = calculateMissionProgress(twin)
  const currentStage = getCurrentMissionStage(twin)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
      className="relative overflow-hidden rounded-3xl border border-[#8b5cf6]/30 bg-gradient-to-br from-[#8b5cf6]/10 to-[#0ea5e9]/10 p-8">
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-lg">
            <Compass className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "Figtree" }}>Current Mission</h3>
            <p className="text-muted-foreground">{getCurrentMissionText(twin)}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Mission Progress</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] bg-clip-text text-transparent">
              {missionProgress}%
            </span>
          </div>
          <Progress value={missionProgress} className="h-4" />
          <div className="grid grid-cols-3 gap-3">
            {["Searching", "Talking", "Evaluating"].map((stage) => (
              <div key={stage} className={`p-3 rounded-xl text-center border ${
                stage === currentStage ? "border-[#8b5cf6]/50 bg-[#8b5cf6]/20" : "border-border bg-card/50"
              }`}>
                <div className={`text-xs font-semibold ${stage === currentStage ? "text-[#8b5cf6]" : "text-muted-foreground"}`}>
                  {stage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AIInsights({ twin, profile }: { twin: any; profile: any }) {
  const insights = generateInsights(twin, profile)

  if (insights.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>AI-Generated Insights</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">Your twin will learn insights as it interacts</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>AI-Generated Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div key={index} whileHover={{ x: 4 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:shadow-lg transition-all">
            <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function LearningTimeline({ twin, profile }: { twin: any; profile: any }) {
  const timeline = generateLearningTimeline(twin, profile)

  if (timeline.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Learning Timeline</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">Learning timeline will appear as your twin grows</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Learning Timeline</h3>
      </div>
      <div className="space-y-3">
        {timeline.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-xl border hover:border-[#156d95]/30 hover:bg-muted/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center">
              {item.type === "communication" && <MessageSquare className="w-5 h-5 text-[#156d95]" />}
              {item.type === "interests" && <Heart className="w-5 h-5 text-pink-500" />}
              {item.type === "personality" && <Sparkles className="w-5 h-5 text-purple-500" />}
              {item.type === "preferences" && <Target className="w-5 h-5 text-orange-500" />}
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground mb-1">{item.event}</div>
              <div className="text-xs text-muted-foreground">{item.time}</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function MemorySection({ twin, profile }: { twin: any; profile: any }) {
  const memories = generateMemoryItems(twin, profile)

  if (memories.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Twin Memory Bank</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">Your twin will build memories as it learns about you</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Twin Memory Bank</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {memories.map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.03 }}
            className="p-4 rounded-xl border bg-gradient-to-br from-card to-pink-500/5 hover:shadow-md transition-all">
            <div className="text-xs text-muted-foreground mb-2">{item.category}</div>
            <div className="font-medium text-foreground">{item.memory}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function MatchPreferences({ profile }: { profile: any }) {
  if (!profile) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
        className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Match Preferences</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">No preferences specified yet</p>
      </motion.div>
    )
  }

  const preferences = [
    { title: "Preferred Intent", value: profile.goals?.relationship || "Not specified", icon: Heart, color: "from-pink-500 to-rose-500" },
    { title: "Preferred Communication", value: profile.communicationStyle || "Not specified", icon: MessageSquare, color: "from-blue-500 to-cyan-500" },
    { title: "Age Range", value: profile.preferences?.ageRange ? `${profile.preferences.ageRange.min}-${profile.preferences.ageRange.max}` : "Not specified", icon: Users, color: "from-purple-500 to-indigo-500" },
    { title: "Lifestyle", value: profile.lifestyle?.socialLevel || "Not specified", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Match Preferences</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preferences.map((pref) => {
          const PrefIcon = pref.icon
          return (
            <motion.div key={pref.title} whileHover={{ scale: 1.03 }}
              className="p-5 rounded-xl border hover:shadow-lg transition-all">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pref.color} flex items-center justify-center`}>
                  <PrefIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{pref.title}</div>
                  <div className="font-semibold text-foreground">{pref.value}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function NetworkStats({ twin }: { twin: any }) {
  const stats = calculateNetworkStats(twin)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Network Statistics</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} className="p-5 rounded-xl border bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#156d95]" />
            <span className="text-xs text-muted-foreground">Twins Visited</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.twinsVisited.toLocaleString()}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-5 rounded-xl border bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">AI Conversations</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.aiConversations.toLocaleString()}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-5 rounded-xl border bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Compatibility Checks</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.compatibilityChecks.toLocaleString()}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-5 rounded-xl border bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-xs text-muted-foreground">Matches Found</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.matchesFound.toLocaleString()}</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Live Twin Status Component (Right Sidebar)
function LiveTwinStatus({ twin }: { twin: any }) {
  const statusColors = getTwinStatusColor(twin.status)
  const statusLabel = getTwinStatusLabel(twin.status)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-6 sticky top-24"
    >
      <div className="space-y-6">
        {/* Live Status Indicator */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center"
            >
              <Activity className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border-4 border-[#156d95]"
            />
          </div>

          <Badge className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} mb-2`}>
            <span className={`w-2 h-2 rounded-full ${statusColors.text.replace('text-', 'bg-')} mr-2 animate-pulse`} />
            {statusLabel}
          </Badge>

          <p className="text-sm text-muted-foreground mt-2">
            Your twin is actively {twin.status === 'active' ? 'searching' : twin.status === 'sleeping' ? 'resting' : 'learning'}
          </p>
        </div>

        {/* Activity Feed */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#156d95]" />
            Recent Activity
          </h4>

          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-foreground">Analyzed {twin.conversationsCount || 0} profile matches</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(twin.lastWake)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="flex items-start gap-2">
                <Brain className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-foreground">Updated personality model</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(twin.updatedAt)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-foreground">Twin neural network upgraded</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(twin.createdAt)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Active Time</span>
            <span className="text-xs font-bold text-foreground">{formatRelativeTime(twin.lastWake)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Version</span>
            <span className="text-xs font-bold text-foreground">v{twin.version}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Neural Model</span>
            <span className="text-xs font-bold text-foreground">Advanced AI</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/twin-conversation" className="block">
          <Button className="w-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
            <MessageSquare className="w-4 h-4 mr-2" />
            View Conversations
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

// Loading Skeleton Component
function MyTwinSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-32 h-8 hidden sm:block" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-32 h-8 hidden sm:block" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* Main Content Skeleton */}
          <main className="space-y-6">
            {/* Hero Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-12 w-96" />
              <Skeleton className="h-6 w-full max-w-3xl" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-48" />
              </div>
            </div>

            {/* Digital Twin Card Skeleton */}
            <Skeleton className="h-96 w-full rounded-3xl" />

            {/* Grid Sections Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>

            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>

            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </main>

          {/* Right Panel Skeleton */}
          <aside className="space-y-6">
            <Skeleton className="h-[600px] w-full rounded-2xl" />
          </aside>
        </div>
      </div>
    </div>
  )
}

// Error Component
function MyTwinError({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground hidden sm:block" style={{ fontFamily: "Figtree" }}>
                TwinLink
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Error Content */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center border border-red-500/20">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "Figtree" }}>
            Unable to Load Your Twin
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {error?.message || "We couldn't fetch your Digital Twin data. This might be a temporary issue."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90 shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Link href="/dashboard">
              <Button variant="outline" className="hover:border-[#156d95]/50 hover:text-[#156d95]">
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border">
            <h3 className="font-semibold text-foreground mb-2">Troubleshooting Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#156d95] mt-0.5 flex-shrink-0" />
                <span>Check your internet connection</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#156d95] mt-0.5 flex-shrink-0" />
                <span>Make sure you've completed the onboarding process</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#156d95] mt-0.5 flex-shrink-0" />
                <span>Try refreshing the page or logging out and back in</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#156d95] mt-0.5 flex-shrink-0" />
                <span>If the problem persists, contact support</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
