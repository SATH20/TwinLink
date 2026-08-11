"use client"

import { motion } from "framer-motion"
import {
  Bot, ArrowLeft, MapPin, Briefcase, Heart, Sparkles, MessageSquare, Loader2,
  AlertCircle, CheckCircle2, XCircle, Clock, Target, Brain, Star, Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect, useCallback, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import {
  getUserProfile,
  getConnections,
  createConnection,
  acceptConnection as apiAcceptConnection,
  declineConnection as apiDeclineConnection,
  getUserConversations,
  getFriendlyErrorMessage,
  type ProfileResponse,
  type ConnectionResponse,
} from "@/lib/api-client"
import { derivePersonalityTraits } from "@/lib/utils/conversation.utils"

/**
 * Public profile view for another user, reached from Recommendations
 * ("View Details"). Shows only public-facing fields (never preferences or
 * deal-breakers) plus the live connection status, which is always resolved from
 * the backend Connection record (the single source of truth).
 *
 * Next.js 16: `params` is a Promise. This is a Client Component, so we unwrap it
 * with React.use(); accessing `params.userId` synchronously would be undefined.
 */
export default function ProfileViewPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const { getToken } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const myUserId = user?.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [connection, setConnection] = useState<ConnectionResponse | null>(null)
  const [working, setWorking] = useState(false)

  const loadConnection = useCallback(
    async (token: string) => {
      const connections = await getConnections(token).catch(() => [])
      const match =
        connections.find(
          (c) => c.currentUserId === userId || c.targetUserId === userId
        ) ?? null
      setConnection(match)
      return match
    },
    [userId]
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const token = await getToken()
        if (!token) throw new Error("Authentication required")

        const [profileData] = await Promise.all([
          getUserProfile(token, userId),
          loadConnection(token),
        ])
        if (cancelled) return
        setProfile(profileData)
      } catch (err) {
        if (!cancelled) setError(getFriendlyErrorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId, getToken, loadConnection])

  // Connection state — derived purely from the backend record.
  const status = connection?.status
  const isConnected = status === "ACCEPTED"
  const isPending = status === "PENDING"
  const isDeclined = status === "DECLINED"
  const isIncoming = isPending && connection?.targetUserId === myUserId
  const isOutgoing = isPending && connection?.currentUserId === myUserId

  const name = profile?.name?.trim() || "User"
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  const age = profile?.age
  const location =
    profile?.location?.city && profile?.location?.country
      ? `${profile.location.city}, ${profile.location.country}`
      : profile?.location?.city || profile?.location?.country || null
  const profession = profile?.profession?.title || null
  const bio = (profile as any)?.bio?.trim() || null
  const interests: string[] = Array.isArray(profile?.interests) ? profile!.interests! : []
  const values: string[] = Array.isArray(profile?.values) ? (profile!.values as string[]) : []
  const personalityTraits = derivePersonalityTraits(profile ?? null)
  const relationshipGoal = profile?.goals?.relationship
  const personalGoals: string[] = Array.isArray(profile?.goals?.personal)
    ? (profile!.goals!.personal as string[])
    : []

  // ── Send a connection request ("Connect") ──
  // A connection request requires a COMPLETED AI conversation between the two
  // users (backend rule). If one exists we create the request directly and the
  // recipient is notified. Otherwise we route the user to start the AI
  // conversation first — never a dead button, never a fake state.
  const handleConnect = useCallback(async () => {
    if (working || !myUserId) return
    setWorking(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")

      const conversations = await getUserConversations(token).catch(() => [])
      const completed = conversations.find(
        (c) =>
          c.status === "COMPLETED" &&
          ((c.userA === myUserId && c.userB === userId) ||
            (c.userA === userId && c.userB === myUserId))
      )

      if (!completed) {
        toast.info("Start an AI conversation first, then send your request.")
        router.push(`/twin-conversation?targetUserId=${userId}`)
        return
      }

      const created = await createConnection(token, userId, completed.id)
      setConnection(created)
      if (created.status === "ACCEPTED") {
        toast.success(`You're connected with ${name}!`)
      } else {
        toast.success(`Connection request sent to ${name}.`)
      }
    } catch (err: any) {
      const message = getFriendlyErrorMessage(err)
      if (message.includes("already")) {
        const token = await getToken()
        if (token) await loadConnection(token)
      } else {
        toast.error(message || "Could not send the connection request.")
      }
    } finally {
      setWorking(false)
    }
  }, [working, myUserId, getToken, userId, name, router, loadConnection])

  const handleAccept = useCallback(async () => {
    if (!connection?.id || working) return
    setWorking(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      const updated = await apiAcceptConnection(token, connection.id)
      setConnection(updated)
      toast.success(`You're connected with ${name}!`)
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err) || "Could not accept the request.")
    } finally {
      setWorking(false)
    }
  }, [connection?.id, working, getToken, name])

  const handleDecline = useCallback(async () => {
    if (!connection?.id || working) return
    setWorking(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      const updated = await apiDeclineConnection(token, connection.id)
      setConnection(updated)
      toast.success("Connection request declined.")
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err) || "Could not decline the request.")
    } finally {
      setWorking(false)
    }
  }, [connection?.id, working, getToken])

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#156d95]" />
      </div>
    )
  }

  // ── Error (never silently redirect) ──
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Unable to load profile</h2>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find this user's profile."}
          </p>
          <Link href="/recommendations">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recommendations
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground hidden sm:block" style={{ fontFamily: "Figtree" }}>
                  TwinLink
                </span>
              </Link>
            </div>
            <ConnectionStatusBadge status={status} />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card border border-border p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-border">
              <AvatarImage src={(profile as any)?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                  {name}{age ? `, ${age}` : ""}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {location}
                    </span>
                  )}
                  {profession && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {profession}
                    </span>
                  )}
                </div>
              </div>

              {relationshipGoal && (
                <Badge className="bg-[#156d95]/10 text-[#156d95] border-[#156d95]/20">
                  {relationshipGoal}
                </Badge>
              )}

              {/* Action buttons — driven by the live connection status */}
              <div className="flex flex-wrap gap-3 pt-2">
                {isConnected ? (
                  <Link href={`/chat/${connection!.id}`}>
                    <Button className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:opacity-90">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Chat
                    </Button>
                  </Link>
                ) : isIncoming ? (
                  <>
                    <Button
                      onClick={handleAccept}
                      disabled={working}
                      className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:opacity-90"
                    >
                      {working ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                      Accept
                    </Button>
                    <Button onClick={handleDecline} disabled={working} variant="outline">
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </>
                ) : isOutgoing ? (
                  <Button disabled variant="secondary">
                    <Clock className="w-4 h-4 mr-2" />
                    Pending
                  </Button>
                ) : isDeclined ? (
                  <Button disabled variant="outline">
                    <XCircle className="w-4 h-4 mr-2" />
                    Declined
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={working}
                    className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90"
                  >
                    {working ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
                    Connect
                  </Button>
                )}

                <Link href={`/twin-conversation?targetUserId=${userId}`}>
                  <Button variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start AI Conversation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About / Bio */}
        {bio && (
          <Section title="About" icon={Bot}>
            <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
          </Section>
        )}

        {/* Personality */}
        {personalityTraits.length > 0 && (
          <Section title="Personality" icon={Brain}>
            <div className="flex flex-wrap gap-2">
              {personalityTraits.map((trait) => (
                <Badge key={trait} variant="secondary">{trait}</Badge>
              ))}
            </div>
          </Section>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <Section title="Interests" icon={Star}>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge key={interest} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </Section>
        )}

        {/* Values */}
        {values.length > 0 && (
          <Section title="Values" icon={Heart}>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <Badge key={value} variant="secondary">{value}</Badge>
              ))}
            </div>
          </Section>
        )}

        {/* Goals */}
        {(relationshipGoal || personalGoals.length > 0) && (
          <Section title="Goals" icon={Target}>
            <div className="space-y-2">
              {relationshipGoal && (
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">Looking for: </span>
                  {relationshipGoal}
                </p>
              )}
              {personalGoals.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {personalGoals.map((goal) => (
                    <Badge key={goal} variant="outline">{goal}</Badge>
                  ))}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Fallback when there is no public detail to show */}
        {!bio &&
          personalityTraits.length === 0 &&
          interests.length === 0 &&
          values.length === 0 &&
          !relationshipGoal &&
          personalGoals.length === 0 && (
            <div className="rounded-2xl bg-card border border-border p-10 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {name} hasn&apos;t shared additional profile details yet.
              </p>
            </div>
          )}
      </div>
    </div>
  )
}

function ConnectionStatusBadge({ status }: { status?: string }) {
  if (status === "ACCEPTED") {
    return (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Connected
      </Badge>
    )
  }
  if (status === "PENDING") {
    return (
      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    )
  }
  if (status === "DECLINED") {
    return (
      <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
        <XCircle className="w-3 h-3 mr-1" />
        Declined
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Not connected
    </Badge>
  )
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#156d95]" />
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}
