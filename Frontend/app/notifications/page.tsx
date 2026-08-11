"use client"

import { motion } from "framer-motion"
import { 
  Bot, Bell, Heart, MessageSquare, Sparkles, Users, TrendingUp, CheckCircle2,
  Settings, Filter, Check, Trash2, ArrowLeft, Clock, BellOff, Loader2, RefreshCw, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { useConnections } from "@/lib/hooks/use-connections"
import type { NotificationResponse } from "@/lib/api-client"

/**
 * UI-facing notification category. Derived from the backend notification type
 * plus its data payload so the same visual language as before is preserved.
 */
type NotificationCategory =
  | "match"
  | "conversation"
  | "recommendation"
  | "twin_learning"
  | "system"
  | "message"

/** High-level notification kind used to decide which inline actions to show. */
type NotificationKind =
  | "connection_request"
  | "connection_accepted"
  | "new_message"
  | "other"

interface UiNotification {
  id: string
  category: NotificationCategory
  kind: NotificationKind
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  connectionId?: string
}

/**
 * Map a raw backend notification into the shape the UI renders, including a
 * correct action URL. Connection acceptances deep-link straight to the human
 * chat for that connection; requests are rendered with inline Accept / Decline
 * actions reconciled against the live connection status.
 */
function toUiNotification(n: NotificationResponse): UiNotification {
  const data = n.data || {}
  const connectionId: string | undefined = data.connectionId
  const conversationId: string | undefined = data.conversationId

  const isAccepted =
    n.type === "CONNECTION_ACCEPTED" || !!data.acceptorId || /accept/i.test(n.title)
  const isRequest =
    n.type === "CONNECTION_REQUEST" || (!!data.senderId && !isAccepted && n.type !== "NEW_MESSAGE")
  const isNewMessage = n.type === "NEW_MESSAGE"

  let category: NotificationCategory = "system"
  let kind: NotificationKind = "other"
  let actionUrl: string | undefined

  if (isNewMessage) {
    category = "message"
    kind = "new_message"
    actionUrl = connectionId ? `/chat/${connectionId}` : "/chat"
  } else if (isAccepted) {
    category = "match"
    kind = "connection_accepted"
    actionUrl = connectionId ? `/chat/${connectionId}` : "/connections"
  } else if (isRequest) {
    category = "match"
    kind = "connection_request"
    actionUrl = "/connections"
  } else {
    switch (n.type) {
      case "MATCH_FOUND":
        category = "match"
        actionUrl = "/recommendations"
        break
      case "CONVERSATION_COMPLETE":
        category = "conversation"
        actionUrl = conversationId
          ? `/twin-conversation?id=${conversationId}`
          : "/recommendations"
        break
      case "TWIN_UPDATED":
        category = "twin_learning"
        actionUrl = "/my-twin"
        break
      default:
        category = "system"
        actionUrl = undefined
    }
  }

  return {
    id: n.id,
    category,
    kind,
    title: n.title,
    message: n.message,
    timestamp: new Date(n.createdAt),
    read: n.read,
    actionUrl,
    connectionId,
  }
}

const categories: { id: string; label: string; icon: any }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "match", label: "Connections", icon: Heart },
  { id: "conversation", label: "Conversations", icon: MessageSquare },
  { id: "recommendation", label: "Recommendations", icon: Sparkles },
  { id: "twin_learning", label: "Twin Updates", icon: Bot },
  { id: "message", label: "Messages", icon: MessageSquare },
  { id: "system", label: "System", icon: Settings },
]

export default function NotificationsPage() {
  const { notifications: raw, loading, error, refetch, markAsRead, markAllAsRead, dismiss } =
    useNotifications()
  const { connections, accepting, declining, acceptConnection, declineConnection } = useConnections()
  const { user } = useUser()
  const currentUserId = user?.id || ""
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const notifications = raw.map(toUiNotification)

  // Reconcile connection-request notifications against the live connection
  // status (single source of truth), so a request never shows Accept/Decline
  // once it has already been accepted or declined.
  const connectionsById = useMemo(() => {
    const map: Record<string, (typeof connections)[number]> = {}
    for (const c of connections) map[c.id] = c
    return map
  }, [connections])

  const handleAccept = async (connectionId: string) => {
    try {
      await acceptConnection(connectionId)
      toast.success("Connection accepted. You can now start chatting.")
    } catch {
      toast.error("Failed to accept the connection request.")
    }
  }

  const handleDecline = async (connectionId: string) => {
    try {
      await declineConnection(connectionId)
      toast.success("Connection request declined.")
    } catch {
      toast.error("Failed to decline the connection request.")
    }
  }

  const filteredNotifications =
    selectedCategory === "all"
      ? notifications
      : notifications.filter((n) => n.category === selectedCategory)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (category: NotificationCategory) => {
    switch (category) {
      case "match": return Heart
      case "conversation": return MessageSquare
      case "recommendation": return Sparkles
      case "twin_learning": return Bot
      case "message": return MessageSquare
      case "system": return Settings
      default: return Bell
    }
  }

  const getNotificationColor = (category: NotificationCategory) => {
    switch (category) {
      case "match": return "from-pink-500 to-rose-500"
      case "conversation": return "from-blue-500 to-cyan-500"
      case "recommendation": return "from-purple-500 to-indigo-500"
      case "twin_learning": return "from-green-500 to-emerald-500"
      case "message": return "from-yellow-500 to-orange-500"
      case "system": return "from-gray-500 to-slate-500"
      default: return "from-[#156d95] to-[#8b5cf6]"
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (Number.isNaN(diff)) return ""
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => refetch()}>
                <RefreshCw className="w-5 h-5" />
              </Button>
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  className="hidden sm:flex"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              <Link href="/settings/notifications">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar - Categories */}
          <aside className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card border border-border p-4 sticky top-24"
            >
              <h3 className="font-semibold text-foreground mb-4 text-sm">Filter by Type</h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon
                  const count = category.id === "all" 
                    ? notifications.length 
                    : notifications.filter(n => n.category === category.id).length
                  const unread = category.id === "all"
                    ? unreadCount
                    : notifications.filter(n => n.category === category.id && !n.read).length

                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        selectedCategory === category.id 
                          ? "bg-[#156d95]/10 text-[#156d95] hover:bg-[#156d95]/20" 
                          : ""
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span className="flex-1 text-left">{category.label}</span>
                      <div className="flex items-center gap-2">
                        {unread > 0 && (
                          <Badge className="bg-[#156d95] text-white">{unread}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">({count})</span>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </motion.div>
          </aside>

          {/* Main Content - Notifications List */}
          <main className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="flex-1 text-sm text-foreground">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => refetch()}>Retry</Button>
              </div>
            )}

            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#156d95]" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <EmptyState category={selectedCategory} />
            ) : (
              filteredNotifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  index={index}
                  getIcon={getNotificationIcon}
                  getColor={getNotificationColor}
                  formatTimestamp={formatTimestamp}
                  onMarkAsRead={markAsRead}
                  onDelete={dismiss}
                  connection={notification.connectionId ? connectionsById[notification.connectionId] : undefined}
                  currentUserId={currentUserId}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  accepting={accepting}
                  declining={declining}
                />
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// Notification Card Component
function NotificationCard({
  notification,
  index,
  getIcon,
  getColor,
  formatTimestamp,
  onMarkAsRead,
  onDelete,
  connection,
  currentUserId,
  onAccept,
  onDecline,
  accepting,
  declining,
}: {
  notification: UiNotification
  index: number
  getIcon: (category: NotificationCategory) => any
  getColor: (category: NotificationCategory) => string
  formatTimestamp: (date: Date) => string
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  connection?: { id: string; status: string; targetUserId: string; currentUserId: string }
  currentUserId: string
  onAccept: (connectionId: string) => void
  onDecline: (connectionId: string) => void
  accepting: string | null
  declining: string | null
}) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = getIcon(notification.category)

  // Decide what interactive footer to render for a connection-request
  // notification, based on the LIVE connection status (source of truth).
  const isRequest = notification.kind === "connection_request"
  const connStatus = connection?.status
  const iAmRecipient = !!connection && connection.targetUserId === currentUserId
  const showAcceptDecline = isRequest && connStatus === "PENDING" && iAmRecipient
  const showConnected = connStatus === "ACCEPTED"
  const showDeclined = isRequest && connStatus === "DECLINED"
  const isBusy = !!connection && (accepting === connection.id || declining === connection.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-2xl border transition-all ${
        notification.read 
          ? "bg-card border-border hover:border-[#156d95]/30" 
          : "bg-[#156d95]/5 border-[#156d95]/20 hover:border-[#156d95]/40"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColor(notification.category)} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground">
                {notification.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notification.read && (
                  <span className="w-2 h-2 rounded-full bg-[#156d95] animate-pulse" />
                )}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-1"
                  >
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => onDelete(notification.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {notification.message}
            </p>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTimestamp(notification.timestamp)}
              </div>

              {/* Inline connection-request actions, reconciled with live status */}
              {showAcceptDecline ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:opacity-90"
                    disabled={isBusy}
                    onClick={() => {
                      if (!notification.read) onMarkAsRead(notification.id)
                      onAccept(connection!.id)
                    }}
                  >
                    {accepting === connection!.id ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    disabled={isBusy}
                    onClick={() => {
                      if (!notification.read) onMarkAsRead(notification.id)
                      onDecline(connection!.id)
                    }}
                  >
                    {declining === connection!.id ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <BellOff className="w-4 h-4 mr-1" />
                    )}
                    Decline
                  </Button>
                </div>
              ) : showConnected ? (
                <Link href={`/chat/${connection!.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#156d95] h-8"
                    onClick={() => {
                      if (!notification.read) onMarkAsRead(notification.id)
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Open Chat
                  </Button>
                </Link>
              ) : showDeclined ? (
                <Badge variant="outline" className="text-muted-foreground">Declined</Badge>
              ) : notification.actionUrl ? (
                <Link href={notification.actionUrl}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#156d95] h-8"
                    onClick={() => {
                      if (!notification.read) onMarkAsRead(notification.id)
                    }}
                  >
                    View Details
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Empty State Component
function EmptyState({ category }: { category: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-card border border-border p-12 text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center"
      >
        <BellOff className="w-10 h-10 text-muted-foreground" />
      </motion.div>

      <h3 className="text-xl font-bold text-foreground mb-2">No Notifications</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        {category === "all" 
          ? "You're all caught up! No new notifications at the moment." 
          : `No ${category} notifications yet. Check back soon!`}
      </p>
    </motion.div>
  )
}
