"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, Sparkles, Brain, Activity, Eye, Heart, Zap, Clock, Target, ArrowRight,
  TrendingUp, MessageSquare, Users, BarChart3, RefreshCw, Edit, CheckCircle2,
  Lightbulb, Star, Shield, Compass, Book, Camera, Code, Plane, Dumbbell, Film,
  Wifi, Bell, Network, Cpu, Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import Link from "next/link"

// Mock data - will be replaced with API calls later
const twinData = {
  name: "Alex's Digital Twin",
  version: "v2.4.5",
  status: "ACTIVE",
  lastActive: "Just Now",
  currentMission: "Searching for highly compatible people",
  learningProgress: 87,
  confidenceScore: 94,
  
  personality: [
    { trait: "Creative", confidence: 92, color: "text-purple-500" },
    { trait: "Logical", confidence: 88, color: "text-blue-500" },
    { trait: "Empathetic", confidence: 95, color: "text-green-500" },
    { trait: "Curious", confidence: 91, color: "text-yellow-500" },
    { trait: "Ambitious", confidence: 89, color: "text-orange-500" },
    { trait: "Patient", confidence: 84, color: "text-teal-500" },
    { trait: "Funny", confidence: 78, color: "text-pink-500" },
    { trait: "Confident", confidence: 86, color: "text-indigo-500" },
  ],
  
  values: [
    { value: "Honesty", strength: 96 },
    { value: "Growth", strength: 93 },
    { value: "Trust", strength: 91 },
    { value: "Respect", strength: 94 },
    { value: "Kindness", strength: 89 },
    { value: "Long-Term Thinking", strength: 87 },
  ],
  
  communicationStyle: [
    { style: "Friendly", level: 92 },
    { style: "Thoughtful", level: 88 },
    { style: "Listener", level: 95 },
    { style: "Professional", level: 84 },
    { style: "Calm", level: 90 },
  ],
  
  interests: [
    { name: "Technology", icon: Code, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { name: "AI", icon: Brain, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    { name: "Movies", icon: Film, color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
    { name: "Travel", icon: Plane, color: "bg-green-500/10 text-green-500 border-green-500/20" },
    { name: "Gaming", icon: Zap, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    { name: "Fitness", icon: Dumbbell, color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    { name: "Books", icon: Book, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
    { name: "Photography", icon: Camera, color: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
  ],
  
  goals: [
    "Long-term Relationship",
    "Professional Networking",
    "Startup Co-founder",
    "Career Growth",
    "Study Partner",
  ],
  
  missionProgress: 73,
  currentStage: "Evaluating",
  
  learningTimeline: [
    { event: "Learned your communication style", time: "2 hours ago", type: "communication" },
    { event: "Updated interests based on interactions", time: "5 hours ago", type: "interests" },
    { event: "Improved personality understanding", time: "1 day ago", type: "personality" },
    { event: "Refined compatibility preferences", time: "2 days ago", type: "preferences" },
  ],
  
  insights: [
    "You communicate best with thoughtful people.",
    "You enjoy deeper conversations over casual chats.",
    "You prefer ambitious and growth-oriented people.",
    "You value authenticity in connections.",
  ],
  
  memories: [
    { memory: "Prefers meaningful conversations", category: "Communication" },
    { memory: "Enjoys AI and technology", category: "Interests" },
    { memory: "Values honesty above all", category: "Values" },
    { memory: "Looking for long-term connections", category: "Goals" },
    { memory: "Appreciates deep thinkers", category: "Preferences" },
    { memory: "Seeks ambitious partners", category: "Preferences" },
  ],
  
  networkStats: {
    twinsVisited: 1847,
    aiConversations: 342,
    compatibilityChecks: 1203,
    matchesFound: 47,
  },
}

export default function MyTwinPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

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
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                Twin Status: {twinData.status}
              </Badge>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <main className="space-y-6">
            <HeroHeader />
            <DigitalTwinCard />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalityProfile />
              <ValuesSection />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommunicationStyle />
              <GoalsSection />
            </div>

            <InterestsSection />
            <CurrentMissionCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIInsights />
              <LearningTimeline />
            </div>

            <MemorySection />
            <MatchPreferences />
            <NetworkStats />
          </main>

          {/* Right Panel */}
          <aside className="space-y-6">
            <LiveTwinStatus />
          </aside>
        </div>
      </div>
    </div>
  )
}

// Hero Header Section
function HeroHeader() {
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
          <span className="text-sm font-bold text-green-600">{twinData.lastActive}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#156d95]/10 border border-[#156d95]/20"
          whileHover={{ scale: 1.05 }}
        >
          <Target className="w-4 h-4 text-[#156d95]" />
          <span className="text-sm text-muted-foreground">Current Mission:</span>
          <span className="text-sm font-bold text-[#156d95]">{twinData.currentMission}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Digital Twin Card - Premium
function DigitalTwinCard() {
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
              <h2 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "Figtree" }}>{twinData.name}</h2>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="font-mono text-xs px-3 py-1"><Cpu className="w-3 h-3 mr-1.5" />{twinData.version}</Badge>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />{twinData.status}</Badge>
                <Badge variant="outline" className="px-3 py-1"><Network className="w-3 h-3 mr-1.5" />Neural v2</Badge>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
                An advanced AI entity powered by neural reasoning that learns and adapts to represent you authentically across the TwinLink network.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90 shadow-lg">
                <Edit className="w-4 h-4 mr-2" />Edit Profile</Button>
              <Button variant="outline" className="hover:border-[#156d95]/50 hover:text-[#156d95]">
                <RefreshCw className="w-4 h-4 mr-2" />Regenerate Twin</Button>
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
              <span className="text-2xl font-bold text-[#156d95]">{twinData.learningProgress}%</span>
            </div>
            <div className="space-y-2">
              <Progress value={twinData.learningProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">Continuously improving through interactions</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                <span className="font-semibold text-foreground">Confidence Score</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{twinData.confidenceScore}%</span>
            </div>
            <div className="space-y-2">
              <Progress value={twinData.confidenceScore} className="h-3" />
              <p className="text-xs text-muted-foreground">High confidence in representing you accurately</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Remaining components implementations
function PersonalityProfile() {
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
        {twinData.personality.map((trait, index) => (
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

function ValuesSection() {
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
        {twinData.values.map((item) => (
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

function CommunicationStyle() {
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
        {twinData.communicationStyle.map((item) => (
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

function InterestsSection() {
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
        {twinData.interests.map((interest) => {
          const InterestIcon = interest.icon
          return (
            <motion.div key={interest.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-xl border ${interest.color} cursor-pointer flex items-center gap-2 font-medium`}>
              <InterestIcon className="w-4 h-4" />
              <span>{interest.name}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function GoalsSection() {
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
        {twinData.goals.map((goal) => (
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

function CurrentMissionCard() {
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
            <p className="text-muted-foreground">Finding people who value honesty, ambition, and technology.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Mission Progress</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] bg-clip-text text-transparent">
              {twinData.missionProgress}%
            </span>
          </div>
          <Progress value={twinData.missionProgress} className="h-4" />
          <div className="grid grid-cols-3 gap-3">
            {["Searching", "Talking", "Evaluating"].map((stage) => (
              <div key={stage} className={`p-3 rounded-xl text-center border ${
                stage === twinData.currentStage ? "border-[#8b5cf6]/50 bg-[#8b5cf6]/20" : "border-border bg-card/50"
              }`}>
                <div className={`text-xs font-semibold ${stage === twinData.currentStage ? "text-[#8b5cf6]" : "text-muted-foreground"}`}>
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

function AIInsights() {
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
        {twinData.insights.map((insight, index) => (
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

function LearningTimeline() {
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
        {twinData.learningTimeline.map((item, index) => (
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

function MemorySection() {
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
        {twinData.memories.map((item, index) => (
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

function MatchPreferences() {
  const preferences = [
    { title: "Preferred Intent", value: "Long-term Relationship", icon: Heart, color: "from-pink-500 to-rose-500" },
    { title: "Preferred Personality", value: "Thoughtful & Ambitious", icon: Sparkles, color: "from-purple-500 to-indigo-500" },
    { title: "Preferred Communication", value: "Deep & Meaningful", icon: MessageSquare, color: "from-blue-500 to-cyan-500" },
    { title: "Preferred Lifestyle", value: "Active & Growth-Oriented", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
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

function NetworkStats() {
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
          <div className="text-3xl font-bold text-foreground">{twinData.networkStats.twinsVisited.toLocaleString()}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-5 rounded-xl border bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">AI Conversations</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{twinData.networkStats.aiConversations.toLocaleString()}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-5 rounded-xl border bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Compatibility Checks</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{twinData.networkStats.compatibilityChecks.toLocaleString()}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-5 rounded-xl border bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-xs text-muted-foreground">Matches Found</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{twinData.networkStats.matchesFound.toLocaleString()}</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function LiveTwinStatus() {
  const [activityIndex, setActivityIndex] = useState(0)

  const activities = [
    { action: "Analyzing", detail: "profile compatibility scores", icon: BarChart3, color: "text-blue-500" },
    { action: "Searching", detail: "technology enthusiasts nearby", icon: Users, color: "text-purple-500" },
    { action: "Conversing", detail: "with Sarah's Twin", icon: MessageSquare, color: "text-green-500" },
    { action: "Evaluating", detail: "shared values alignment", icon: CheckCircle2, color: "text-yellow-500" },
    { action: "Learning", detail: "from recent interactions", icon: Brain, color: "text-pink-500" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % activities.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6 sticky top-24">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-card border border-border p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
            <Cpu className="w-5 h-5 text-[#156d95]" />
          </motion.div>
          <h3 className="font-semibold text-foreground">Live Twin Activity</h3>
          <Badge className="bg-green-500/10 text-green-600 ml-auto">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse" />Online
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activityIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }} className="mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#156d95]/10 to-[#8b5cf6]/10 border border-[#156d95]/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center">
                  {(() => {
                    const ActivityIcon = activities[activityIndex].icon
                    return <ActivityIcon className="w-5 h-5 text-white" />
                  })()}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${activities[activityIndex].color} mb-1`}>{activities[activityIndex].action}...</div>
                  <div className="text-xs text-muted-foreground">{activities[activityIndex].detail}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground mb-3">Recent Activities</div>
          {activities.slice(0, 4).map((activity, index) => {
            const ActivityIcon = activity.icon
            return (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <ActivityIcon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{activity.action}</div>
                  <div className="text-xs text-muted-foreground truncate">{activity.detail}</div>
                </div>
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />Last update: 30 seconds ago
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl bg-card border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Twin Health Monitor</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2 text-xs">
              <span className="text-muted-foreground">Neural Network</span>
              <span className="font-bold text-green-600">100%</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2 text-xs">
              <span className="text-muted-foreground">Memory Systems</span>
              <span className="font-bold text-blue-600">98%</span>
            </div>
            <Progress value={98} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2 text-xs">
              <span className="text-muted-foreground">Learning Engine</span>
              <span className="font-bold text-purple-600">94%</span>
            </div>
            <Progress value={94} className="h-2" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start"><Eye className="w-4 h-4 mr-2" />View Matches</Button>
          <Button variant="outline" className="w-full justify-start"><MessageSquare className="w-4 h-4 mr-2" />AI Conversations</Button>
          <Button variant="outline" className="w-full justify-start"><Target className="w-4 h-4 mr-2" />Update Mission</Button>
          <Button variant="outline" className="w-full justify-start"><Brain className="w-4 h-4 mr-2" />Train Twin</Button>
        </div>
      </motion.div>
    </div>
  )
}
