"use client"

import { motion } from "framer-motion"
import { 
  Bot, Bell, Heart, MessageSquare, Sparkles, Users, TrendingUp, CheckCircle2,
  Settings, Filter, Check, Trash2, ArrowLeft, Clock, BellOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import Link from "next/link"

type NotificationType = "match" | "conversation" | "recommendation" | "twin_learning" | "system" | "message"

interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

const notificationsData: Notification[] = [
  {
    id: 1,
    type: "match",
    title: "New High Compatibility Match!",
    message: "Sarah Chen - 94% compatibility. Your Twins had a great conversation!",
    timestamp: new Date(Date.now() - 300000),
    read: false,
    actionUrl: "/recommendations"
  },
  {
    id: 2,
    type: "conversation",
    title: "Twin Conversation Completed",
    message: "Your Twin finished talking with Alex Kumar's Twin. 91% compatibility detected!",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    actionUrl: "/twin-conversation"
  },
  {
    id: 3,
    type: "message",
    title: "New Message from Emma Wilson",
    message: "Hey! I'd love to hear more about your startup ideas...",
    timestamp: new Date(Date.now() - 7200000),
    read: false,
    actionUrl: "/chat/3"
  },
  {
    id: 4,
    type: "recommendation",
    title: "4 New Recommendations Available",
    message: "Your Digital Twin found 4 new highly compatible matches for you today.",
    timestamp: new Date(Date.now() - 10800000),
    read: true,
    actionUrl: "/recommendations"
  },
  {
    id: 5,
    type: "twin_learning",
    title: "Twin Learning Update",
    message: "Your Twin learned new preferences from recent interactions and updated its understanding.",
    timestamp: new Date(Date.now() - 14400000),
    read: true,
    actionUrl: "/my-twin"
  },
  {
    id: 6,
    type: "match",
    title: "Match Accepted Your Introduction",
    message: "Michael Park accepted! You can now start chatting.",
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    actionUrl: "/chat/4"
  },
  {
    id: 7,
    type: "conversation",
    title: "Twin Conversation in Progress",
    message: "Your Twin is currently having a conversation with Lisa Wang's Twin...",
    timestamp: new Date(Date.now() - 172800000),
    read: true,
    actionUrl: "/twin-conversation"
  },
  {
    id: 8,
    type: "system",
    title: "Profile Completion Bonus",
    message: "Great job! Your profile is now 100% complete. This increases match quality.",
    timestamp: new Date(Date.now() - 259200000),
    read: true,
    actionUrl: "/settings/profile"
  },
  {
    id: 9,
    type: "twin_learning",
    title: "Twin Confidence Increased",
    message: "Your Twin's confidence score increased to 96% based on successful interactions.",
    timestamp: new Date(Date.now() - 345600000),
    read: true,
    actionUrl: "/my-twin"
  },
  {
    id: 10,
    type: "recommendation",
    title: "Weekly Summary Available",
    message: "Your Twin explored 247 profiles and had 47 conversations this week.",
    timestamp: new Date(Date.now() - 432000000),
    read: true,
    actionUrl: "/dashboard"
  },
]

const categories = [
  { id: "all", label: "All", icon: Bell },
  { id: "match", label: "Matches", icon: Heart },
  { id: "conversation", label: "Conversations", icon: MessageSquare },
  { id: "recommendation", label: "Recommendations", icon: Sparkles },
  { id: "twin_learning", label: "Twin Updates", icon: Bot },
  { id: "message", label: "Messages", icon: MessageSquare },
  { id: "system", label: "System", icon: Settings },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredNotifications = selectedCategory === "all" 
    ? notifications 
    : notifications.filter(n => n.type === selectedCategory)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "match": return Heart
      case "conversation": return MessageSquare
      case "recommendation": return Sparkles
      case "twin_learning": return Bot
      case "message": return MessageSquare
      case "system": return Settings
      default: return Bell
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
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
                    : notifications.filter(n => n.type === category.id).length
                  const unread = category.id === "all"
                    ? unreadCount
                    : notifications.filter(n => n.type === category.id && !n.read).length

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
            {filteredNotifications.length === 0 ? (
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
                  onDelete={deleteNotification}
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
  onDelete
}: any) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = getIcon(notification.type)

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
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`font-semibold ${notification.read ? "text-foreground" : "text-foreground"}`}>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTimestamp(notification.timestamp)}
              </div>

              {notification.actionUrl && (
                <Link href={notification.actionUrl}>
                  <Button variant="ghost" size="sm" className="text-[#156d95] h-8">
                    View Details
                  </Button>
                </Link>
              )}
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
