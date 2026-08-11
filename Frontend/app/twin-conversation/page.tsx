"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { TwinConversationHeader } from "@/components/twin-conversation/header"
import { TwinProfilePanel } from "@/components/twin-conversation/twin-profile-panel"
import { ConversationTimeline } from "@/components/twin-conversation/conversation-timeline"
import { AIReasoningPanel } from "@/components/twin-conversation/ai-reasoning-panel"
import { CompatibilityReport } from "@/components/twin-conversation/compatibility-report"
import { ConversationStages } from "@/components/twin-conversation/conversation-stages"
import { InsightsPanel } from "@/components/twin-conversation/insights-panel"
import { MemoryCards } from "@/components/twin-conversation/memory-cards"
import { QuickActions } from "@/components/twin-conversation/quick-actions"
import { ConversationSidebar } from "@/components/twin-conversation/conversation-sidebar"
import { ConversationHistory } from "@/components/twin-conversation/conversation-history"
import { useConversation } from "@/lib/hooks/useConversation"
import {
  calculateDuration,
  derivePersonalityTraits,
  getProfileInterests,
  getProfileValues,
} from "@/lib/utils/conversation.utils"
import type { ProfileResponse } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2, Play, Heart, RotateCcw, Clock, CheckCircle2 } from "lucide-react"

// Authenticated page that reads live query params (`useSearchParams`); always
// rendered dynamically rather than statically prerendered.
export const dynamic = "force-dynamic"

// Minimum compatibility score (%) required to unlock a human chat.
// Configurable via env; defaults to the backend's match threshold of 70.
const COMPATIBILITY_THRESHOLD = Number(process.env.NEXT_PUBLIC_COMPATIBILITY_THRESHOLD) || 70

// How long to poll for the async compatibility analysis to finish.
const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 15

function AmbientOrb({
  color,
  size,
  position,
  delay = 0,
}: {
  color: string
  size: string
  position: string
  delay?: number
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.12, 0.22, 0.12],
        x: [0, 30, -20, 0],
        y: [0, -20, 15, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, delay, ease: "easeInOut" }}
      className={`fixed ${position} ${size} rounded-full blur-3xl pointer-events-none -z-10`}
      style={{ background: color }}
    />
  )
}

// `useSearchParams()` must sit under a Suspense boundary (Next.js CSR bailout).
export default function TwinConversationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#156d95]" />
        </div>
      }
    >
      <TwinConversationContent />
    </Suspense>
  )
}

function TwinConversationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const conversationId = searchParams.get("id")
  const targetUserId = searchParams.get("targetUserId")

  const {
    conversation,
    loading,
    accepting,
    error,
    startConversation,
    getConversation,
    getMyTwin,
    getTargetUserProfile,
    acceptIntroduction,
    createConnection,
    getConnectionByUsers,
    acceptConnectionRequest,
    setError,
  } = useConversation()

  const [isStarting, setIsStarting] = useState(false)
  const [twinsLoading, setTwinsLoading] = useState(false)
  const [myTwinReady, setMyTwinReady] = useState(false)
  const [targetTwinReady, setTargetTwinReady] = useState(false)

  const [myProfile, setMyProfile] = useState<ProfileResponse | null>(null)
  const [targetProfile, setTargetProfile] = useState<ProfileResponse | null>(null)
  const [connection, setConnection] = useState<any>(null)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Real user display names (single source of truth for names).
  const currentUserName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "You"
  const targetUserName = targetProfile?.name?.trim() || "Your Match"

  // 1. Redirect back to Recommendations if opened without a target/conversation.
  useEffect(() => {
    if (!conversationId && !targetUserId) {
      router.replace(
        "/recommendations?message=" +
          encodeURIComponent("Please pick a recommendation to start an AI conversation with your twin.")
      )
    }
  }, [conversationId, targetUserId, router])

  // 2. On arrival from Recommendations: load both twins + profiles. Also
  //    resolve any existing connection between the two users so the correct
  //    state (Pending / Connected) is shown instead of always offering to start
  //    a brand-new conversation. If a connection already has a conversation,
  //    load THAT conversation rather than creating a duplicate.
  useEffect(() => {
    let cancelled = false

    async function loadTwins() {
      if (!targetUserId || conversationId) return

      setTwinsLoading(true)
      const [myTwin, myProfileData, targetProfileData, existingConn] = await Promise.all([
        getMyTwin(),
        getTargetUserProfile(user?.id ?? ""),
        getTargetUserProfile(targetUserId),
        getConnectionByUsers(targetUserId),
      ])

      if (cancelled) return

      setMyTwinReady(!!myTwin)
      setTargetTwinReady(!!targetProfileData)
      if (myProfileData) setMyProfile(myProfileData)
      if (targetProfileData) setTargetProfile(targetProfileData)
      if (existingConn) setConnection(existingConn)

      setTwinsLoading(false)

      // Reuse the conversation tied to an existing connection so the analysis
      // and connection status are shown (and no duplicate conversation is made).
      if (existingConn?.conversationId) {
        await getConversation(existingConn.conversationId).catch(() => null)
      }
    }

    loadTwins()
    return () => {
      cancelled = true
    }
  }, [targetUserId, conversationId, getMyTwin, getTargetUserProfile, getConnectionByUsers, getConversation, user?.id])

  // 3. Load an existing conversation by ID (from history) and its profiles.
  useEffect(() => {
    if (!conversationId) return
    let cancelled = false

    async function loadExisting() {
      const conv = await getConversation(conversationId!).catch(() => null)
      if (cancelled || !conv) return

      // Fetch both participants' profiles for names + profile panels.
      const [profA, profB] = await Promise.all([
        getTargetUserProfile(conv.userA),
        getTargetUserProfile(conv.userB),
      ])
      if (cancelled) return

      // Orient "my" vs "target" based on the current user.
      const myId = user?.id
      if (myId && conv.userB === myId) {
        setMyProfile(profB)
        setTargetProfile(profA)
      } else {
        setMyProfile(profA)
        setTargetProfile(profB)
      }
      // The connection is resolved by the unified effect below (by user pair),
      // which is the single source of truth regardless of how we arrived here.
    }

    loadExisting()
    return () => {
      cancelled = true
    }
  }, [conversationId, getConversation, getTargetUserProfile, user?.id])

  // Unified connection resolution: whenever we know the "other" user (from a
  // targetUserId query param or from the loaded conversation), resolve the one
  // Connection record between the two users. This is the single source of truth
  // for connection status, so an already-accepted connection is always shown as
  // Connected — never "Accept Introduction".
  useEffect(() => {
    const otherId = conversation
      ? conversation.userA === user?.id
        ? conversation.userB
        : conversation.userA
      : targetUserId

    if (!otherId) return
    let cancelled = false

    getConnectionByUsers(otherId).then((conn) => {
      if (!cancelled && conn) setConnection(conn)
    })

    return () => {
      cancelled = true
    }
  }, [conversation?.userA, conversation?.userB, targetUserId, user?.id, getConnectionByUsers])

  // 4. Poll for the async compatibility analysis to complete.
  useEffect(() => {
    if (!conversation || conversation.status !== "COMPLETED") return
    if (conversation.analysisComplete) return

    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts += 1
      const updated = await getConversation(conversation.id).catch(() => null)
      // Stop polling once the analysis finishes, the backend reports FAILED, or
      // we exhaust the max attempts — otherwise the loader would spin forever.
      const done =
        !!updated && (updated.analysisComplete || updated.status === "FAILED")
      if (done || attempts >= MAX_POLL_ATTEMPTS) {
        if (pollRef.current) {
          clearInterval(pollRef.current)
          pollRef.current = null
        }
      }
    }, POLL_INTERVAL_MS)

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [conversation?.id, conversation?.status, conversation?.analysisComplete, getConversation])

  const twinsReady = myTwinReady && targetTwinReady

  const handleStartConversation = useCallback(async () => {
    if (!targetUserId || isStarting || loading) return

    setIsStarting(true)
    setError(null)

    try {
      await startConversation(targetUserId, "first_meeting", 10)
    } catch (err) {
      // Error state is surfaced by the hook; nothing else to do here.
    } finally {
      setIsStarting(false)
    }
  }, [targetUserId, isStarting, loading, startConversation, setError])

  const handleAcceptIntroduction = useCallback(async () => {
    if (!conversation?.id) {
      toast.error("Cannot accept introduction - no conversation found.")
      return
    }

    if (conversation.status !== 'COMPLETED') {
      toast.error("Please wait for the AI conversation to complete first.")
      return
    }

    // Determine the target user (the other participant in the conversation)
    const currentUserId = user?.id
    const otherUserId = conversation.userA === currentUserId ? conversation.userB : conversation.userA
    
    if (!otherUserId) {
      toast.error("Cannot determine target user.")
      return
    }

    try {
      const result = await createConnection(otherUserId, conversation.id)
      setConnection(result)
      
      // Show success message with the matched user's name
      const matchedUserName = targetProfile?.name || targetUserName || "the other user"
      
      // Customize message based on connection status
      if (result.status === 'ACCEPTED') {
        toast.success(`You're connected with ${matchedUserName}!`)
      } else {
        toast.success(`Introduction request sent to ${matchedUserName}!`)
      }
    } catch (err: any) {
      // Only show error if it's not about existing connection
      const message = err?.message || error || "Could not send introduction request."
      if (!message.includes('already exists')) {
        toast.error(message)
      } else {
        // If connection already exists, refetch it (by user pair — source of truth)
        const existingConn = await getConnectionByUsers(otherUserId)
        if (existingConn) {
          setConnection(existingConn)
        }
      }
    }
  }, [conversation?.id, conversation?.status, conversation?.userA, conversation?.userB, user?.id, createConnection, error, targetProfile?.name, targetUserName, getConnectionByUsers])

  // Accept an INCOMING connection request (current user is the recipient).
  const handleAcceptRequest = useCallback(async () => {
    if (!connection?.id) {
      toast.error("No connection request to accept.")
      return
    }

    try {
      const updated = await acceptConnectionRequest(connection.id)
      setConnection(updated)
      toast.success(`You're connected with ${targetProfile?.name || targetUserName || "your match"}!`)
    } catch (err: any) {
      toast.error(err?.message || "Could not accept the connection request.")
    }
  }, [connection?.id, acceptConnectionRequest, targetProfile?.name, targetUserName])

  // ── Derived, single-source-of-truth values (all from `conversation`) ──
  const duration = conversation
    ? calculateDuration(conversation.createdAt, conversation.updatedAt)
    : "0s"
  const messageCount = conversation ? conversation.messages.length : 0
  const compatibilityScore = conversation ? conversation.compatibilityScore : 0
  const confidenceScore = conversation ? conversation.confidenceScore : 0
  const reasoningIterations = conversation ? conversation.reasoningIterations : 0
  const analysisComplete = conversation ? conversation.analysisComplete : false
  // The compatibility analysis failed on the backend. This is a terminal state:
  // we stop the "Analyzing compatibility..." loader instead of polling forever.
  const analysisFailed = conversation ? conversation.status === "FAILED" : false

  // [TEMP LOG 5] Frontend selected conversation status — confirms what the page
  // is actually rendering from after each poll/refresh.
  useEffect(() => {
    if (!conversation) return
    console.log("[TEMP][frontend] selected conversation", {
      id: conversation.id,
      status: conversation.status,
      analysisComplete: conversation.analysisComplete,
      compatibilityScore: conversation.compatibilityScore,
      confidenceScore: conversation.confidenceScore,
    })
  }, [
    conversation?.id,
    conversation?.status,
    conversation?.analysisComplete,
    conversation?.compatibilityScore,
    conversation?.confidenceScore,
  ])

  // Connection state - single source of truth (the backend Connection record)
  const currentUserId = user?.id
  const isConnected = connection?.status === 'ACCEPTED'
  const isPending = connection?.status === 'PENDING'
  const hasConnection = !!connection

  // Distinguish the two sides of a PENDING request so each user sees the right
  // action: the recipient can Accept, the sender only sees "Request Sent".
  const isIncomingRequest =
    isPending && !!connection && connection.targetUserId === currentUserId
  const isOutgoingRequest =
    isPending && !!connection && connection.currentUserId === currentUserId

  // Can start human chat only if connection is ACCEPTED
  const canStartHumanChat = isConnected

  // Can send an introduction request if:
  // 1. Conversation is completed and analyzed
  // 2. No connection exists yet (not pending, accepted, or declined)
  const canAcceptIntroduction = 
    !!conversation &&
    conversation.status === "COMPLETED" &&
    analysisComplete &&
    !isConnected &&
    !isPending

  // ── Error state (only when there is no conversation to show) ──
  if (error && !conversation && !isStarting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-destructive/50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Conversation Failed</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            {targetUserId && (
              <Button onClick={handleStartConversation} disabled={isStarting}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push("/recommendations")}>
              Back to Recommendations
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Redirect effect handles navigation; render nothing to avoid a flash.
  if (!conversation && !targetUserId && !conversationId) {
    return null
  }

  // ── Empty state: start button + history ──
  if (!conversation && !loading && !isStarting) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <AmbientOrb
            color="linear-gradient(135deg, rgba(21, 109, 149, 0.3), rgba(139, 92, 246, 0.15))"
            size="w-[600px] h-[600px]"
            position="top-[-200px] left-[-100px]"
          />
        </div>

        <TwinConversationHeader
          compatibilityScore={0}
          confidenceScore={0}
          duration="0s"
          status="pending"
        />

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center">
                  <Play className="w-10 h-10 text-[#156d95]" />
                </div>
                <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Figtree" }}>
                  Start AI Conversation
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {currentUserName}&apos;s Digital Twin will have an AI-to-AI conversation with{" "}
                  {targetUserName}&apos;s Twin to evaluate compatibility.
                </p>
                {twinsLoading ? (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing both twins...</span>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleStartConversation}
                    disabled={!twinsReady || isStarting}
                    className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] hover:from-[#0d4d6b] hover:to-[#6d28d9] disabled:opacity-50"
                  >
                    {isStarting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Start Conversation
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ConversationHistory />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden scroll-smooth">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <AmbientOrb
          color="linear-gradient(135deg, rgba(21, 109, 149, 0.3), rgba(139, 92, 246, 0.15))"
          size="w-[600px] h-[600px]"
          position="top-[-200px] left-[-100px]"
        />
        <AmbientOrb
          color="linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.1))"
          size="w-[500px] h-[500px]"
          position="top-[40%] right-[-150px]"
          delay={4}
        />
        <AmbientOrb
          color="linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(16, 185, 129, 0.1))"
          size="w-[400px] h-[400px]"
          position="bottom-[-100px] left-[30%]"
          delay={8}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <TwinConversationHeader
        compatibilityScore={compatibilityScore}
        confidenceScore={confidenceScore}
        duration={duration}
        status={conversation?.status || (isStarting ? "IN_PROGRESS" : "pending")}
      />

      {/* Loading State — shown while the backend generates the conversation */}
      {(isStarting || (loading && !conversation)) && (
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-[#156d95] animate-spin mb-4" />
            <p className="text-lg font-semibold mb-2">Generating AI Conversation...</p>
            <p className="text-sm text-muted-foreground text-center">
              {currentUserName}&apos;s Twin and {targetUserName}&apos;s Twin are talking. This can take a
              few moments.
            </p>
          </div>
        </div>
      )}

      {conversation && !isStarting && (
        <div className="container mx-auto px-4 py-8 max-w-[1800px]">
          <div className="grid grid-cols-12 gap-6">
            {/* Left — Your Twin */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="col-span-12 lg:col-span-3"
            >
              <TwinProfilePanel
                name={currentUserName}
                type="your"
                status={conversation.status}
                mission="Finding meaningful connections."
                personality={derivePersonalityTraits(myProfile)}
                interests={getProfileInterests(myProfile)}
                values={getProfileValues(myProfile)}
              />
            </motion.div>

            {/* Center — Conversation */}
            <div className="col-span-12 lg:col-span-6 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <ConversationStages
                  hasConversation={messageCount > 0}
                  analysisComplete={analysisComplete}
                  status={conversation.status}
                />
              </motion.div>

              {/* Transcript — always rendered before the report */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <ConversationTimeline
                  messages={conversation.messages}
                  userATwinName={`${currentUserName}'s Twin`}
                  userBTwinName={`${targetUserName}'s Twin`}
                />
              </motion.div>

              {/* Compatibility analysis (only once the analysis is available) */}
              {analysisComplete ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <AIReasoningPanel conversation={conversation} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <CompatibilityReport conversation={conversation} />
                  </motion.div>

                  {/* Accept Introduction / Accept Request / Start Human Chat */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    {isConnected ? (
                      <Button
                        size="lg"
                        onClick={() => {
                          if (connection?.id) {
                            router.push(`/chat/${connection.id}`)
                          } else {
                            toast.error("Connection ID not found")
                          }
                        }}
                        className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Start Human Chat
                      </Button>
                    ) : isIncomingRequest ? (
                      <Button
                        size="lg"
                        onClick={handleAcceptRequest}
                        disabled={accepting}
                        className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white disabled:opacity-50"
                      >
                        {accepting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Accepting...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Accept Request
                          </>
                        )}
                      </Button>
                    ) : isOutgoingRequest ? (
                      <Button
                        size="lg"
                        disabled
                        className="w-full disabled:opacity-50"
                      >
                        <Clock className="w-5 h-5 mr-2" />
                        Request Sent
                      </Button>
                    ) : canAcceptIntroduction ? (
                      <Button
                        size="lg"
                        onClick={handleAcceptIntroduction}
                        disabled={accepting}
                        className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white disabled:opacity-50"
                      >
                        {accepting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending Request...
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5 mr-2" />
                            Accept Introduction
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button size="lg" disabled className="w-full disabled:opacity-50">
                        <Heart className="w-5 h-5 mr-2" />
                        {compatibilityScore < COMPATIBILITY_THRESHOLD
                          ? `Human Chat requires ${COMPATIBILITY_THRESHOLD}%+ compatibility`
                          : "Wait for AI analysis to complete"}
                      </Button>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <InsightsPanel conversation={conversation} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    <MemoryCards
                      myInterests={getProfileInterests(myProfile)}
                      myValues={getProfileValues(myProfile)}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                  >
                    <QuickActions
                      canAccept={canAcceptIntroduction || isIncomingRequest}
                      accepting={accepting}
                      requestPending={isOutgoingRequest}
                      connected={isConnected}
                      onAccept={isIncomingRequest ? handleAcceptRequest : handleAcceptIntroduction}
                    />
                  </motion.div>
                </>
              ) : analysisFailed ? (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-card/50 border border-destructive/50 rounded-2xl">
                  <AlertCircle className="w-10 h-10 text-destructive mb-3" />
                  <p className="text-sm font-semibold">Compatibility analysis failed</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    We couldn&apos;t evaluate this conversation. Please try again.
                  </p>
                  {targetUserId && (
                    <Button variant="outline" size="sm" onClick={handleStartConversation} disabled={isStarting}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-card/50 border border-border/50 rounded-2xl">
                  <Loader2 className="w-10 h-10 text-[#8b5cf6] animate-spin mb-3" />
                  <p className="text-sm font-semibold">Analyzing compatibility...</p>
                  <p className="text-xs text-muted-foreground">
                    Your twins finished talking. Evaluating the results now.
                  </p>
                </div>
              )}
            </div>

            {/* Right — Matched Twin + Stats */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                <TwinProfilePanel
                  name={targetUserName}
                  type="matched"
                  status={conversation.status}
                  mission="Representing its user."
                  personality={derivePersonalityTraits(targetProfile)}
                  interests={getProfileInterests(targetProfile)}
                  values={getProfileValues(targetProfile)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <ConversationSidebar
                  messageCount={messageCount}
                  reasoningIterations={reasoningIterations}
                  compatibilityScore={compatibilityScore}
                  confidenceScore={confidenceScore}
                  duration={duration}
                  status={conversation.status}
                  analysisComplete={analysisComplete}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                <ConversationHistory />
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
