"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, Sparkles, Brain, Heart, MessageSquare, Users, MapPin, Briefcase,
  TrendingUp, Activity, Eye, Clock, Target, CheckCircle2, Filter, Search,
  SlidersHorizontal, ArrowRight, Star, Zap, Bell, X, ChevronDown, BarChart3,
  RefreshCw, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect, useCallback, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useUser, useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { useRecommendations } from "@/hooks/use-recommendations"
import {
  getConnections,
  createConnection,
  acceptConnection as apiAcceptConnection,
  getUserConversations,
  getFriendlyErrorMessage,
  type ConnectionResponse,
} from "@/lib/api-client"
import {
  getMatchStatusColor,
  getMatchedUserName,
  getLocationString,
  getProfession,
  getAge,
  getIntent,
  getBio,
  getSharedInterests,
  getSharedValues,
  getSharedGoals,
  formatCompatibility,
  formatConfidence,
  getCompatibilityColor,
  getCompatibilityGradient,
  getAISummary,
  getMatchReasons,
  calculateRecommendationStats,
  sortRecommendations,
  filterByIntent,
  searchRecommendations,
  getInitials,
} from "@/lib/utils/recommendations.utils"

// This page is authenticated and reads live query params (`useSearchParams`),
// so it is always rendered dynamically rather than statically prerendered.
export const dynamic = "force-dynamic"

// `useSearchParams()` must sit under a Suspense boundary (Next.js CSR bailout).
export default function RecommendationsPage() {
  return (
    <Suspense fallback={<RecommendationsSkeleton />}>
      <RecommendationsContent />
    </Suspense>
  )
}

function RecommendationsContent() {
  const [mounted, setMounted] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("compatibility")
  const [searchQuery, setSearchQuery] = useState("")

  const searchParams = useSearchParams()
  const redirectMessage = searchParams.get("message")
  const [showMessage, setShowMessage] = useState(false)

  const { user: clerkUser } = useUser()
  const { getToken } = useAuth()
  const { recommendations, isLoading, error, refetch, startMatching, isStartingMatch, matchError, matchInfo } = useRecommendations()

  // Live connection status per other-user, resolved from the backend Connection
  // records (single source of truth). Keyed by the OTHER participant's user id.
  const [connectionMap, setConnectionMap] = useState<Record<string, ConnectionResponse>>({})

  const refreshConnections = useCallback(async () => {
    try {
      const token = await getToken()
      if (!token) return
      const conns = await getConnections(token)
      const map: Record<string, ConnectionResponse> = {}
      for (const c of conns) {
        const otherId = c.currentUserId === clerkUser?.id ? c.targetUserId : c.currentUserId
        map[otherId] = c
      }
      setConnectionMap(map)
    } catch {
      // Non-fatal: cards fall back to the "Connect" state.
    }
  }, [getToken, clerkUser?.id])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    refreshConnections()
  }, [refreshConnections])

  useEffect(() => {
    if (redirectMessage) {
      setShowMessage(true)
    }
  }, [redirectMessage])

  if (!mounted) return null

  // Show loading skeleton
  if (isLoading) {
    return <RecommendationsSkeleton />
  }

  // Show error state
  if (error) {
    return <RecommendationsError error={error} onRetry={refetch} />
  }

  // Apply filters and sorting
  let filteredRecs = recommendations
  filteredRecs = filterByIntent(filteredRecs, selectedIntent)
  filteredRecs = searchRecommendations(filteredRecs, searchQuery)
  filteredRecs = sortRecommendations(filteredRecs, sortBy)

  const stats = calculateRecommendationStats(recommendations)

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
              <Button variant="ghost" size="icon" onClick={() => refetch()}>
                <RefreshCw className="w-5 h-5" />
              </Button>
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
            {/* Friendly redirect message */}
            <AnimatePresence>
              {showMessage && redirectMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-[#156d95]/10 border border-[#156d95]/20"
                >
                  <Sparkles className="w-5 h-5 text-[#156d95] flex-shrink-0 mt-0.5" />
                  <p className="flex-1 text-sm text-foreground">{redirectMessage}</p>
                  <button
                    onClick={() => setShowMessage(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Dismiss message"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero Header */}
            <HeroHeader stats={stats} />

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
            {filteredRecs.length > 0 ? (
              <div className="space-y-6">
                {filteredRecs.map((recommendation, index) => {
                  const matchedUserId =
                    recommendation.userA === clerkUser?.id ? recommendation.userB : recommendation.userA
                  return (
                    <RecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                      index={index}
                      clerkUser={clerkUser}
                      connection={connectionMap[matchedUserId]}
                      onConnectionChange={refreshConnections}
                    />
                  )
                })}
              </div>
            ) : recommendations.length === 0 ? (
              <EmptyState
                onStartMatching={startMatching}
                isStartingMatch={isStartingMatch}
                matchError={matchError}
                matchInfo={matchInfo}
              />
            ) : (
              <NoResultsState />
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <StatsSidebar stats={stats} />
          </aside>
        </div>
      </div>
    </div>
  )
}

// Hero Header Section
function HeroHeader({ stats }: any) {
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
          <span className="text-sm font-bold text-[#156d95]">{stats.totalRecommendations}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-muted-foreground">Avg Compatibility:</span>
          <span className="text-sm font-bold text-green-600">{stats.avgCompatibility}%</span>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <Clock className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-muted-foreground">Last AI Update:</span>
          <span className="text-sm font-bold text-purple-600">{stats.lastUpdate}</span>
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
  const intents = ["Long-term Relationship", "Dating", "Professional Networking", "Friendship", "Connection"]

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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-background text-sm"
          >
            <option value="compatibility">Highest %</option>
            <option value="confidence">Confidence</option>
            <option value="recent">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
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
function RecommendationCard({ recommendation, index, clerkUser, connection, onConnectionChange }: any) {
  const [expanded, setExpanded] = useState(false)
  const [working, setWorking] = useState(false)
  const { getToken } = useAuth()
  const router = useRouter()

  const matchedProfile = recommendation.matchedProfile
  const name = getMatchedUserName(matchedProfile)
  const age = getAge(matchedProfile)
  const location = getLocationString(matchedProfile)
  const profession = getProfession(matchedProfile)
  const intent = getIntent(matchedProfile)
  const bio = getBio(matchedProfile)
  const initials = getInitials(matchedProfile)
  const aiSummary = getAISummary(recommendation)
  const reasons = getMatchReasons(recommendation)
  const statusColors = getMatchStatusColor(recommendation.status)
  
  // Determine the matched user's ID (the other user in the match)
  const matchedUserId = recommendation.userA === clerkUser?.id ? recommendation.userB : recommendation.userA

  // Connection state — resolved from the backend Connection record.
  const status: string | undefined = connection?.status
  const isConnected = status === "ACCEPTED"
  const isPending = status === "PENDING"
  const isDeclined = status === "DECLINED"
  const isIncoming = isPending && connection?.targetUserId === clerkUser?.id
  const isOutgoing = isPending && connection?.currentUserId === clerkUser?.id

  // "Connect" sends a connection request. This requires a COMPLETED AI
  // conversation between the two users (backend rule); if none exists yet we
  // route the user to start one first, so the button is never dead and no fake
  // "requested" state is shown.
  const handleConnect = useCallback(async () => {
    if (working || !clerkUser?.id) return
    setWorking(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")

      const conversations = await getUserConversations(token).catch(() => [])
      const completed = conversations.find(
        (c) =>
          c.status === "COMPLETED" &&
          ((c.userA === clerkUser.id && c.userB === matchedUserId) ||
            (c.userA === matchedUserId && c.userB === clerkUser.id))
      )

      if (!completed) {
        toast.info("Start an AI conversation first, then send your request.")
        router.push(`/twin-conversation?targetUserId=${matchedUserId}`)
        return
      }

      const created = await createConnection(token, matchedUserId, completed.id)
      if (created.status === "ACCEPTED") {
        toast.success(`You're connected with ${name}!`)
      } else {
        toast.success(`Connection request sent to ${name}.`)
      }
      await onConnectionChange?.()
    } catch (err: any) {
      const message = getFriendlyErrorMessage(err)
      if (message.includes("already")) {
        await onConnectionChange?.()
      } else {
        toast.error(message || "Could not send the connection request.")
      }
    } finally {
      setWorking(false)
    }
  }, [working, clerkUser?.id, getToken, matchedUserId, name, router, onConnectionChange])

  const handleAccept = useCallback(async () => {
    if (!connection?.id || working) return
    setWorking(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      await apiAcceptConnection(token, connection.id)
      toast.success(`You're connected with ${name}!`)
      await onConnectionChange?.()
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err) || "Could not accept the request.")
    } finally {
      setWorking(false)
    }
  }, [connection?.id, working, getToken, name, onConnectionChange])

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
                  {initials}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                      {name}{age ? `, ${age}` : ''}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {profession}
                      </div>
                    </div>
                  </div>
                </div>

                <Badge className="bg-[#156d95]/10 text-[#156d95] border-[#156d95]/20">
                  {intent}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {bio}
              </p>

              {/* Shared Interests */}
              {matchedProfile && matchedProfile.interests && matchedProfile.interests.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchedProfile.interests.slice(0, 5).map((interest: string) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Compatibility */}
          <div className="lg:w-64 space-y-4">
            <CompatibilityCircle 
              compatibility={recommendation.compatibilityScore}
              confidence={recommendation.confidenceScore}
            />

            <div className="space-y-2">
              <Link href={`/profile/${matchedUserId}`}>
                <Button className="w-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
              <Link href={`/twin-conversation?targetUserId=${matchedUserId}`}>
                <Button variant="outline" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start AI Conversation
                </Button>
              </Link>

              {/* Connection-aware action (single source of truth = backend) */}
              {isConnected ? (
                <Link href={`/chat/${connection.id}`}>
                  <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:opacity-90">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Human Chat
                  </Button>
                </Link>
              ) : isIncoming ? (
                <Button
                  onClick={handleAccept}
                  disabled={working}
                  className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:opacity-90"
                >
                  {working ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Accept
                </Button>
              ) : isOutgoing ? (
                <Button variant="secondary" disabled className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending
                </Button>
              ) : isDeclined ? (
                <Button variant="outline" disabled className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  Declined
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={working}
                  variant="outline"
                  className="w-full border-[#156d95]/40 text-[#156d95] hover:bg-[#156d95]/10"
                >
                  {working ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
                  Connect
                </Button>
              )}

              {recommendation.conversationId && (
                <Link href={`/twin-conversation?id=${recommendation.conversationId}`}>
                  <Button variant="ghost" className="w-full text-muted-foreground">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Read Twin Chat
                  </Button>
                </Link>
              )}
            </div>

            <Badge className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} w-full justify-center`}>
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {statusColors.label}
            </Badge>
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
                    {aiSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Match Reasons */}
            {reasons.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Why This Match?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reasons.map((reason: string, idx: number) => (
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
            )}

            {/* Weaknesses/Considerations */}
            {recommendation.weaknesses && recommendation.weaknesses.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Considerations</h4>
                <div className="space-y-2">
                  {recommendation.weaknesses.map((weakness: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Match Recommendation */}
            {recommendation.recommendation && (
              <div className="p-4 rounded-xl bg-[#156d95]/10 border border-[#156d95]/20">
                <h4 className="text-sm font-semibold text-[#156d95] mb-2">AI Recommendation</h4>
                <p className="text-sm text-foreground">{recommendation.recommendation}</p>
              </div>
            )}
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
            {Math.round(compatibility)}%
          </motion.div>
          <div className="text-xs text-muted-foreground">Match</div>
        </div>
      </div>

      {/* Confidence Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <Sparkles className="w-3 h-3 text-green-500" />
        <span className="text-xs font-semibold text-green-600">{Math.round(confidence)}% AI Confidence</span>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({ onStartMatching, isStartingMatch, matchError, matchInfo }: any) {
  // The matching run completed but nothing was saved for the user.
  const searchedButEmpty =
    !isStartingMatch && !matchError && matchInfo && matchInfo.persisted === 0

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
        No Compatible Connections Yet
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Your Twin hasn&apos;t found any compatible connections yet. Start the matching process to let your Twin explore and find compatible people.
      </p>

      {/* Inline error from the matching action (never fail silently) */}
      <AnimatePresence>
        {matchError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 max-w-md"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm text-foreground">
              {matchError.message || "We couldn't start the matching process. Please try again."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback when the run succeeded but produced no matches */}
      <AnimatePresence>
        {searchedButEmpty && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-2 p-4 mb-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 max-w-md"
          >
            <div className="flex items-start gap-3">
              <Search className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="flex-1 text-sm text-foreground">
                {matchInfo.totalCandidates === 0
                  ? "Your Twin searched but there are no other members to match with yet. Check back soon!"
                  : `Your Twin reviewed ${matchInfo.totalCandidates} ${matchInfo.totalCandidates === 1 ? "member" : "members"} but none met your matching criteria right now. Try updating your preferences or search again later.`}
              </p>
            </div>
            {matchInfo.eliminationReasons && Object.keys(matchInfo.eliminationReasons).length > 0 && (
              <div className="pl-8 text-xs text-muted-foreground">
                <span className="font-semibold">Filtered out by:</span>{" "}
                {Object.entries(matchInfo.eliminationReasons)
                  .sort((a: any, b: any) => b[1] - a[1])
                  .map(([reason, count]) => `${reason} (${count})`)
                  .join(", ")}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => onStartMatching()}
        disabled={isStartingMatch}
        className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90"
      >
        {isStartingMatch ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Searching for matches...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            {matchError || searchedButEmpty ? "Search Again" : "Start Matching Process"}
          </>
        )}
      </Button>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
        <Activity className="w-4 h-4 text-[#156d95]" />
        <span>
          {isStartingMatch
            ? "Your Twin is analyzing compatibility with other members..."
            : "Your Twin will search for compatible matches"}
        </span>
      </div>
    </motion.div>
  )
}

// No Results State (when filters return nothing)
function NoResultsState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-muted-foreground" />
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "Figtree" }}>
        No Matches Found
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        No recommendations match your current filters. Try adjusting your search criteria.
      </p>
    </motion.div>
  )
}

// Stats Sidebar Component
function StatsSidebar({ stats }: any) {
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
            label="Total Recommendations"
            value={stats.totalRecommendations}
            color="text-blue-500"
          />
          <StatItem
            icon={TrendingUp}
            label="Average Compatibility"
            value={`${stats.avgCompatibility}%`}
            color="text-green-500"
          />
          <StatItem
            icon={Star}
            label="High Matches (85%+)"
            value={stats.highCompatibilityCount}
            color="text-yellow-500"
          />
          <StatItem
            icon={Clock}
            label="Last Update"
            value={stats.lastUpdate}
            color="text-purple-500"
            isTime
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
            text={`${stats.totalRecommendations} recommendations found`}
            color="text-blue-500"
          />
          <ActivityItem
            icon={MessageSquare}
            text="Analyzing compatibility"
            color="text-purple-500"
          />
          <ActivityItem
            icon={Target}
            text="Searching for matches"
            color="text-yellow-500"
          />
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
          <Link href="/my-twin">
            <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95]">
              <Eye className="w-4 h-4 mr-2" />
              View My Twin
            </Button>
          </Link>
          <Link href="/twin-conversation">
            <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95]">
              <MessageSquare className="w-4 h-4 mr-2" />
              Twin Conversations
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95]">
              <Target className="w-4 h-4 mr-2" />
              Update Preferences
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

// Stat Item Component
function StatItem({ icon: Icon, label, value, color, isTime = false }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={`${isTime ? 'text-sm' : 'text-lg'} font-bold text-foreground`}>{value}</span>
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

// Loading Skeleton Component
function RecommendationsSkeleton() {
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
              <Skeleton className="w-10 h-10 rounded-full" />
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
                <Skeleton className="h-10 w-48" />
              </div>
            </div>

            {/* Filters Skeleton */}
            <Skeleton className="h-24 w-full rounded-2xl" />

            {/* Cards Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          </main>

          {/* Sidebar Skeleton */}
          <aside className="space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </aside>
        </div>
      </div>
    </div>
  )
}

// Error Component
function RecommendationsError({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
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
            Unable to Load Recommendations
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {error?.message || "We couldn't fetch your match recommendations. This might be a temporary issue."}
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
                <span>Make sure the backend is running</span>
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
