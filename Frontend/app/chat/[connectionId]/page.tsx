"use client"

import { motion } from "framer-motion"
import {
  Bot, Send, ArrowLeft, Heart, MapPin, Briefcase, Loader2, AlertCircle, MessageSquare, CheckCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect, useRef, useCallback, use } from "react"
import Link from "next/link"
import { useAuth, useUser } from "@clerk/nextjs"
import {
  getConnectionById,
  getUserProfile,
  getMessages,
  sendMessage as apiSendMessage,
  getFriendlyErrorMessage,
  type ConnectionResponse,
  type ProfileResponse,
  type MessageResponse,
} from "@/lib/api-client"

// Poll interval for receiving the other participant's new messages.
const POLL_INTERVAL_MS = 5000

export default function ChatPage({ params }: { params: Promise<{ connectionId: string }> }) {
  // Next.js 16: `params` is a Promise. This is a Client Component, so unwrap it
  // with React.use(). Accessing `params.connectionId` synchronously would yield
  // `undefined`, causing GET /v1/connections/undefined to 404 ("profile not found").
  const { connectionId } = use(params)
  const { getToken } = useAuth()
  const { user } = useUser()
  const myUserId = user?.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connection, setConnection] = useState<ConnectionResponse | null>(null)
  const [otherProfile, setOtherProfile] = useState<ProfileResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [inputValue, setInputValue] = useState("")
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isConnected = connection?.status === "ACCEPTED"
  const isParticipant =
    !!myUserId &&
    !!connection &&
    (connection.currentUserId === myUserId || connection.targetUserId === myUserId)
  const canChat = isConnected && isParticipant

  const otherUserId = connection
    ? connection.currentUserId === myUserId
      ? connection.targetUserId
      : connection.currentUserId
    : undefined

  const otherName = otherProfile?.name?.trim() || "Your Connection"
  const otherProfession = otherProfile?.profession?.title
  const otherLocation =
    otherProfile?.location?.city && otherProfile?.location?.country
      ? `${otherProfile.location.city}, ${otherProfile.location.country}`
      : otherProfile?.location?.city || undefined

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 1. Load the connection, the other participant's profile, and the history.
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const token = await getToken()
        if (!token) throw new Error("Authentication required")

        const conn = await getConnectionById(token, connectionId)
        if (cancelled) return
        setConnection(conn)

        const otherId =
          conn.currentUserId === myUserId ? conn.targetUserId : conn.currentUserId

        // Only load the profile + messages when the users are actually connected.
        if (conn.status === "ACCEPTED") {
          const [profile, history] = await Promise.all([
            getUserProfile(token, otherId).catch(() => null),
            getMessages(token, connectionId).catch(() => []),
          ])
          if (cancelled) return
          if (profile) setOtherProfile(profile)
          setMessages(Array.isArray(history) ? history : [])
        }
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
  }, [connectionId, getToken, myUserId])

  // 2. Poll for new messages so both participants stay in sync.
  useEffect(() => {
    if (!canChat) return
    let cancelled = false

    const interval = setInterval(async () => {
      try {
        const token = await getToken()
        if (!token) return
        const history = await getMessages(token, connectionId)
        if (!cancelled && Array.isArray(history)) setMessages(history)
      } catch {
        // Ignore transient polling errors.
      }
    }, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [canChat, connectionId, getToken])

  const handleSend = useCallback(async () => {
    const content = inputValue.trim()
    if (!content || sending || !canChat) return

    setSending(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")

      const created = await apiSendMessage(token, connectionId, content)
      setMessages((prev) => [...prev, created])
      setInputValue("")
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setSending(false)
    }
  }, [inputValue, sending, canChat, getToken, connectionId])

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ""
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const initials = otherName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  // ── Loading state ──
  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#156d95]" />
      </div>
    )
  }

  // ── Not connected / not allowed state ──
  if (!canChat) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Chat unavailable</h2>
          <p className="text-muted-foreground mb-6">
            {error || "You must be connected to start a chat."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/connections">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Connections
              </Button>
            </Link>
            {connection?.conversationId && (
              <Link href={`/twin-conversation?id=${connection.conversationId}`}>
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Twin Chat
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/connections">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-border">
                <AvatarImage src={otherProfile?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="font-semibold text-foreground">{otherName}</h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Connected
                  </span>
                  {otherProfession && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {otherProfession}
                    </span>
                  )}
                  {otherLocation && (
                    <span className="hidden sm:flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {otherLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {typeof connection?.compatibilityScore === "number" && connection.compatibilityScore > 0 && (
              <Badge className="bg-[#156d95]/10 text-[#156d95] border-[#156d95]/20 hidden sm:flex">
                <Heart className="w-3 h-3 mr-1" />
                {Math.round(connection.compatibilityScore)}% Match
              </Badge>
            )}
            {connection?.conversationId && (
              <Link href={`/twin-conversation?id=${connection.conversationId}`}>
                <Button variant="ghost" size="sm" className="text-[#156d95]">
                  View Twin Chat
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  You&apos;re connected with {otherName}. Say hello to start the conversation!
                </p>
              </div>
            ) : (
              messages.reduce((acc: any[], message, index) => {
                const currentDate = formatDate(message.createdAt)
                const prevDate = index > 0 ? formatDate(messages[index - 1].createdAt) : null

                if (currentDate !== prevDate) {
                  acc.push(<DateSeparator key={`date-${index}`} date={currentDate} />)
                }

                acc.push(
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isUser={message.senderId === myUserId}
                    initials={initials || "U"}
                    formatTime={formatTime}
                  />
                )

                return acc
              }, [])
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="rounded-2xl"
                  disabled={sending}
                />
              </div>

              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90 rounded-full px-6"
                disabled={!inputValue.trim() || sending}
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Date Separator Component
function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-4 py-1 rounded-full bg-muted text-xs text-muted-foreground font-medium">
        {date}
      </div>
    </div>
  )
}

// Message Bubble Component
function MessageBubble({
  message,
  isUser,
  initials,
  formatTime,
}: {
  message: MessageResponse
  isUser: boolean
  initials: string
  formatTime: (iso: string) => string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex items-end gap-2 max-w-[70%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {!isUser && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          <div className="flex items-center gap-1 mt-1 px-2">
            <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
            {isUser && <CheckCheck className="w-3 h-3 text-[#156d95]" />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
