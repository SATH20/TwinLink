"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, Sparkles, Brain, Heart, MessageSquare, Users, MapPin, Briefcase,
  TrendingUp, Activity, Eye, Clock, Target, CheckCircle2, Filter, Search,
  SlidersHorizontal, ArrowRight, Star, Zap, Bell, X, ChevronDown, BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import Link from "next/link"

// Mock data - will be replaced with API calls later
const recommendationsData = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 27,
    location: "San Francisco, CA",
    profession: "AI Product Manager",
    compatibility: 94,
    confidence: 96,
    intent: "Long-term Relationship",
    bio: "Building the future of AI products. Love meaningful conversations, outdoor adventures, and exploring new technologies.",
    sharedInterests: ["Technology", "AI", "Travel", "Books", "Fitness"],
    status: "Ready for chat",
    reasons: [
      "Shared long-term goals",
      "Similar communication style",
      "Common interests in AI and technology",
      "Compatible lifestyles"
    ],
    aiSummary: "Your Digital Twin believes you both communicate thoughtfully, value honesty, and enjoy meaningful conversations. This recommendation is based on personality alignment and shared long-term goals.",
    twinActivity: [
      { event: "Twin conversation completed", time: "2 hours ago" },
      { event: "Compatibility calculated", time: "1 hour ago" },
      { event: "Recommendation approved", time: "30 min ago" }
    ],
    image: null
  },
  {
    id: 2,
    name: "Alex Kumar",
    age: 29,
    location: "New York, NY",
    profession: "Software Engineer",
    compatibility: 91,
    confidence: 93,
    intent: "Professional Networking",
    bio: "Full-stack developer passionate about building scalable systems. Always learning, always coding.",
    sharedInterests: ["Technology", "Gaming", "Movies", "AI", "Books"],
    status: "Ready for chat",
    reasons: [
      "Similar career aspirations",
      "Shared technical interests",
      "Compatible problem-solving approaches",
      "Growth-oriented mindset"
    ],
    aiSummary: "Both Twins identified strong professional synergy and shared passion for technology innovation. Your communication patterns suggest productive collaboration potential.",
    twinActivity: [
      { event: "Twin conversation completed", time: "3 hours ago" },
      { event: "Compatibility calculated", time: "2 hours ago" },
      { event: "Recommendation approved", time: "1 hour ago" }
    ],
    image: null
  },
  {
    id: 3,
    name: "Emma Wilson",
    age: 26,
    location: "Austin, TX",
    profession: "UX Designer",
    compatibility: 88,
    confidence: 90,
    intent: "Dating",
    bio: "Creating beautiful user experiences. Coffee enthusiast, bookworm, and weekend hiker.",
    sharedInterests: ["Travel", "Books", "Fitness", "Photography", "Movies"],
    status: "Ready for chat",
    reasons: [
      "Complementary skill sets",
      "Similar lifestyle preferences",
      "Shared values around growth",
      "Compatible communication styles"
    ],
    aiSummary: "Your Twins discovered mutual appreciation for creativity, personal development, and meaningful connections. Both value work-life balance and authentic relationships.",
    twinActivity: [
      { event: "Twin conversation completed", time: "4 hours ago" },
      { event: "Compatibility calculated", time: "3 hours ago" },
      { event: "Recommendation approved", time: "2 hours ago" }
    ],
    image: null
  },
  {
    id: 4,
    name: "Michael Park",
    age: 30,
    location: "Seattle, WA",
    profession: "Data Scientist",
    compatibility: 86,
    confidence: 88,
    intent: "Startup Co-founder",
    bio: "Turning data into insights. Looking for co-founders who share my vision for AI-driven solutions.",
    sharedInterests: ["Technology", "AI", "Gaming", "Travel", "Fitness"],
    status: "Ready for chat",
    reasons: [
      "Entrepreneurial mindset",
      "Complementary technical skills",
      "Shared startup interests",
      "Similar risk tolerance"
    ],
    aiSummary: "Both Twins demonstrate strong analytical thinking and entrepreneurial drive. Your Digital Twin identified potential for successful business partnership.",
    twinActivity: [
      { event: "Twin conversation completed", time: "5 hours ago" },
      { event: "Compatibility calculated", time: "4 hours ago" },
      { event: "Recommendation approved", time: "3 hours ago" }
    ],
    image: null
  }
]

const statsData = {
  totalRecommendations: 12,
  avgCompatibility: 89,
  lastUpdate: "Just now",
  recommendationsToday: 4,
  conversationsCompleted: 47,
  pendingMatches: 3
}

export default function RecommendationsPage() {
  const [mounted, setMounted] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("compatibility")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const filteredRecommendations = recommendationsData.filter(rec => {
    if (selectedIntent && rec.intent !== selectedIntent) return false
    if (searchQuery && !rec.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

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
            {/* Hero Header */}
            <HeroHeader />

            {/* Filters Bar */}
            <FiltersBar 
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectedIntent={selectedIntent}
              setSelectedIntent={setSelectedIntent}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Recommendations Grid */}
            {filteredRecommendations.length > 0 ? (
              <div className="space-y-6">
                {filteredRecommendations.map((recommendation, index) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <StatsSidebar />
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
            AI Match Recommendations
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed" style={{ fontFamily: "Figtree" }}>
            Your Digital Twin has analyzed conversations and found the most meaningful connections for you.
          </p>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#156d95]/10 border border-[#156d95]/20"
          whileHover={{ scale: 1.05 }}
        >
          <Users className="w-4 h-4 text-[#156d95]" />
          <span className="text-sm text-muted-foreground">Total Recommendations:</span>
          <span className="text-sm font-bold text-[#156d95]">{statsData.totalRecommendations}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-muted-foreground">Avg Compatibility:</span>
          <span className="text-sm font-bold text-green-600">{statsData.avgCompatibility}%</span>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <Clock className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-muted-foreground">Last AI Update:</span>
          <span className="text-sm font-bold text-purple-600">{statsData.lastUpdate}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Filters Bar Component
function FiltersBar({ 
  showFilters, 
  setShowFilters, 
  selectedIntent, 
  setSelectedIntent, 
  sortBy, 
  setSortBy,
  searchQuery,
  setSearchQuery
}: any) {
  const intents = ["Long-term Relationship", "Dating", "Professional Networking", "Startup Co-founder", "Friendship"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-card border border-border p-6 space-y-4"
    >
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search recommendations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-[#156d95] hover:bg-[#0e5a7a]" : ""}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {selectedIntent && <Badge className="ml-2 bg-white/20">1</Badge>}
          </Button>

          <Button variant="outline">
            <span className="text-sm">Sort: {sortBy === "compatibility" ? "Highest %" : "Newest"}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3">Filter by Intent</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedIntent === null ? "default" : "outline"}
                  onClick={() => setSelectedIntent(null)}
                  className={selectedIntent === null ? "bg-[#156d95]" : ""}
                >
                  All
                </Button>
                {intents.map((intent) => (
                  <Button
                    key={intent}
                    size="sm"
                    variant={selectedIntent === intent ? "default" : "outline"}
                    onClick={() => setSelectedIntent(intent)}
                    className={selectedIntent === intent ? "bg-[#156d95]" : ""}
                  >
                    {intent}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Recommendation Card Component
function RecommendationCard({ recommendation, index }: any) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="rounded-2xl bg-card border border-border hover:border-[#156d95]/30 hover:shadow-xl transition-all overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Profile Info */}
          <div className="flex flex-col sm:flex-row gap-6 flex-1">
            {/* Avatar */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-border">
                <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white text-2xl">
                  {recommendation.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                      {recommendation.name}, {recommendation.age}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {recommendation.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {recommendation.profession}
                      </div>
                    </div>
                  </div>
                </div>

                <Badge className="bg-[#156d95]/10 text-[#156d95] border-[#156d95]/20">
                  {recommendation.intent}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {recommendation.bio}
              </p>

              {/* Shared Interests */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Shared Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.sharedInterests.map((interest: string) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Compatibility */}
          <div className="lg:w-64 space-y-4">
            <CompatibilityCircle 
              compatibility={recommendation.compatibility}
              confidence={recommendation.confidence}
            />

            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Read Twin Chat
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Heart className="w-4 h-4 mr-2" />
                Start Human Chat
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {recommendation.status}
            </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <div className="pt-6 mt-6 border-t border-border space-y-6">
            {/* AI Summary */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recommendation.aiSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Match Reasons */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Why This Match?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendation.reasons.map((reason: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-muted/50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Twin Activity Timeline */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Twin Activity</h4>
              <div className="space-y-2">
                {recommendation.twinActivity.map((activity: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#156d95]" />
                    <span className="text-foreground">{activity.event}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 text-[#156d95] hover:text-[#0e5a7a]"
        >
          {expanded ? "Show Less" : "Show AI Analysis"}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </Button>
      </div>
    </motion.div>
  )
}

// Compatibility Circle Visualization
function CompatibilityCircle({ compatibility, confidence }: { compatibility: number; confidence: number }) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (compatibility / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Compatibility Circle */}
      <div className="relative">
        <svg className="w-32 h-32 -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            className="stroke-muted"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="45"
            className="stroke-[#156d95]"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-3xl font-bold text-foreground"
          >
            {compatibility}%
          </motion.div>
          <div className="text-xs text-muted-foreground">Match</div>
        </div>
      </div>

      {/* Confidence Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <Sparkles className="w-3 h-3 text-green-500" />
        <span className="text-xs font-semibold text-green-600">{confidence}% AI Confidence</span>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center mb-6"
      >
        <Brain className="w-16 h-16 text-[#156d95]" />
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "Figtree" }}>
        Your Twin is Exploring
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Your Digital Twin is currently exploring the network and talking with other AI Twins. 
        New recommendations will appear here soon.
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Activity className="w-4 h-4 text-[#156d95]" />
        </motion.div>
        <span>Actively searching...</span>
      </div>

      {/* Animated Progress */}
      <div className="w-64 mt-8">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6]"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// Stats Sidebar Component
function StatsSidebar() {
  return (
    <div className="space-y-6 sticky top-24">
      {/* Quick Statistics */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl bg-card border border-border p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-[#156d95]" />
          <h3 className="font-semibold text-foreground">Quick Statistics</h3>
        </div>

        <div className="space-y-4">
          <StatItem
            icon={Users}
            label="Recommendations Today"
            value={statsData.recommendationsToday}
            color="text-blue-500"
          />
          <StatItem
            icon={MessageSquare}
            label="Conversations Completed"
            value={statsData.conversationsCompleted}
            color="text-purple-500"
          />
          <StatItem
            icon={TrendingUp}
            label="Average Compatibility"
            value={`${statsData.avgCompatibility}%`}
            color="text-green-500"
          />
          <StatItem
            icon={Heart}
            label="Pending Matches"
            value={statsData.pendingMatches}
            color="text-pink-500"
          />
        </div>
      </motion.div>

      {/* Twin Activity Status */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-card border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-5 h-5 text-[#156d95]" />
          </motion.div>
          <h3 className="font-semibold text-foreground">Twin Activity</h3>
          <Badge className="bg-green-500/10 text-green-600 ml-auto">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse" />
            Active
          </Badge>
        </div>

        <div className="space-y-3">
          <ActivityItem
            icon={Users}
            text="Exploring 23 profiles"
            color="text-blue-500"
          />
          <ActivityItem
            icon={MessageSquare}
            text="5 conversations ongoing"
            color="text-purple-500"
          />
          <ActivityItem
            icon={Target}
            text="Analyzing compatibility"
            color="text-yellow-500"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            Last activity: 2 minutes ago
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card border border-border p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95]">
            <Eye className="w-4 h-4 mr-2" />
            View All Matches
          </Button>
          <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95]">
            <MessageSquare className="w-4 h-4 mr-2" />
            Twin Conversations
          </Button>
          <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95]">
            <Target className="w-4 h-4 mr-2" />
            Update Preferences
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// Stat Item Component
function StatItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </div>
  )
}

// Activity Item Component
function ActivityItem({ icon: Icon, text, color }: any) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-[#156d95]"
      />
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-foreground">{text}</span>
    </div>
  )
}
