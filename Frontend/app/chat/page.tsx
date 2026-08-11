"use client"

import { motion } from "framer-motion"
import {
  Bot, ArrowLeft, MessageSquare, Loader2, Users, Search, Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useAuth, useUser } from "@clerk/nextjs"
import { useConnections } from "@/lib/hooks/use-connections"
import { getMessages, type MessageResponse } from "@/lib/api-client"
import type { ConnectionWithProfile } from "@/lib/types/api.types"

/**
 * Chats list — shows every ACCEPTED connection as an openable conversation.
 * The list is sorted by the most recent message so active conversations rise to
 * the top. Each row's "Open Chat" navigates to /chat/[connectionId] using the
 * real connection id (never the target user id).
 */
export default function ChatsListPage() {
  const { getToken } = useAuth()
  const { user: clerkUser } = useUser()
  const { connections, loading } = useConnections()
  const currentUserId = clerkUser?.id || ""

  const [lastMessages, setLastMessages] = useState<Record<string, MessageResponse | null>>({})

  const accepted = useMemo(
    () => connections.filter((c) => c.status === "ACCEPTED"),
    [connections]
  )

  // Load the latest message for each accepted connection (for previews + sort).
  useEffect(() => {
    let cancelled = false
    if (accepted.length === 0) return

    async function loadPreviews() {
      const token = await getToken()
      if (!token) return

      const entries = await Promise.all(
        accepted.map(async (conn) => {
          try {
            const msgs = await getMessages(token, conn.id)
            const last = Array.isArray(msgs) && msgs.length > 0 ? msgs[msgs.length - 1] : null
            return [conn.id, last] as const
          } catch {
            return [conn.id, null] as const
          }
        })
      )

      if (cancelled) return
      const map: Record<string, MessageResponse | null> = {}
      for (const [id, last] of entries) map[id] = last
      setLastMessages(map)
    }

    loadPreviews()
    return () => {
      cancelled = true
    }
  }, [accepted, getToken])

  const getOtherUser = (connection: ConnectionWithProfile) => {
    const isReceiver = connection.targetUserId === currentUserId
    return isReceiver ? connection.currentProfile : connection.targetProfile
  }

  // Sort by latest message time (fallback to connection creation time).
  const sortedAccepted = useMemo(() => {
    return [...accepted].sort((a, b) => {
      const aTime = lastMessages[a.id]?.createdAt || a.createdAt
      const bTime = lastMessages[b.id]?.createdAt || b.createdAt
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    })
  }, [accepted, lastMessages])

  const formatTime = (iso?: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ""
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return d.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                  Chats
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/connections">
                <Button variant="ghost" size="icon">
                  <Users className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/notifications">
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && accepted.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-[#156d95]" />
          </div>
        ) : sortedAccepted.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {sortedAccepted.map((conn, index) => {
              const otherUser = getOtherUser(conn)
              const userName = otherUser?.name || "Your Connection"
              const initials =
                userName
                  .split(" ")
                  .map((n: string) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "U"
              const last = lastMessages[conn.id]
              const preview = last
                ? `${last.senderId === currentUserId ? "You: " : ""}${last.content}`
                : "You're connected. Say hello!"

              return (
                <motion.div
                  key={conn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link href={`/chat/${conn.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-[#156d95]/30 hover:shadow-md transition-all cursor-pointer">
                      <Avatar className="w-14 h-14 flex-shrink-0">
                        <AvatarImage src={(otherUser as any)?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground truncate">{userName}</h3>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatTime(last?.createdAt || conn.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{preview}</p>
                      </div>

                      <Button size="sm" variant="outline" className="flex-shrink-0">
                        Open Chat
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-card border border-border p-12 text-center"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center">
        <MessageSquare className="w-10 h-10 text-[#156d95]" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">No chats yet</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Your conversations will appear here once you connect with someone.
      </p>
      <Link href="/recommendations">
        <Button className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
          <Search className="w-4 h-4 mr-2" />
          Find People
        </Button>
      </Link>
    </motion.div>
  )
}
