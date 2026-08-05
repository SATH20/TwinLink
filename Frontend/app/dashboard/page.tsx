"use client"

import { motion } from "framer-motion"
import { 
  Bot, 
  Sparkles, 
  Users, 
  MessageSquare, 
  Settings, 
  Bell,
  TrendingUp,
  Activity,
  Eye,
  Heart,
  Zap,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  BarChart3,
  Brain,
  Wifi,
  Mail,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  MatchRecommendationsCard,
  RecentConversationsCard,
  MissionCard,
  InsightsCard,
  NetworkStatusCard,
  LiveActivityPanel
} from "@/components/dashboard-components"

export default function DashboardPage() {
  // Mock user data for demo
  const mockUser = {
    firstName: "Alex",
    imageUrl: null
  }

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground hidden sm:block" style={{ fontFamily: "Figtree" }}>
                TwinLink
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#156d95] rounded-full" />
              </Button>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white">
                  {mockUser.firstName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                {getGreeting()}, {mockUser.firstName}! 👋
              </h1>
              <p className="text-lg text-muted-foreground" style={{ fontFamily: "Figtree" }}>
                Your AI Twin has been exploring the network while you were away.
              </p>
            </motion.div>

            {/* Twin Status Hero Card */}
            <TwinStatusCard />

            {/* Today's Activity */}
            <TodayActivityCard />

            {/* Match Recommendations */}
            <MatchRecommendationsCard />

            {/* Recent AI Conversations */}
            <RecentConversationsCard />

            {/* Mission Card */}
            <MissionCard />

            {/* AI Insights */}
            <InsightsCard />

            {/* Network Status */}
            <NetworkStatusCard />

            {/* Notifications */}
            <NotificationsCard />
          </main>

          {/* Right Panel - Live Activity */}
          <LiveActivityPanel />
        </div>
      </div>
    </div>
  )
}

// Sidebar Component
function Sidebar() {
  const navItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Bot, label: "My Twin", href: "/my-twin" },
    { icon: Heart, label: "Recommendations", href: "/recommendations" },
    { icon: MessageSquare, label: "Conversations", href: "/conversations" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block w-64 space-y-2"
    >
      <div className="sticky top-24">
        {navItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={item.href}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start h-11 ${
                  item.active ? "bg-[#156d95]/10 text-[#156d95] hover:bg-[#156d95]/20" : ""
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  )
}

// Twin Status Hero Card
function TwinStatusCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#156d95]/10 via-[#8b5cf6]/10 to-[#0ea5e9]/10 border border-[#156d95]/20 p-8"
    >
      {/* Animated background gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#156d95] to-[#8b5cf6] rounded-full blur-3xl"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center relative"
            >
              <Bot className="w-8 h-8 text-white" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#156d95] to-[#8b5cf6] blur-xl"
              />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "Figtree" }}>
                🤖 Your Digital Twin
              </h2>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  ACTIVE
                </Badge>
              </div>
              <p className="text-muted-foreground" style={{ fontFamily: "Figtree" }}>
                Mission: Searching for meaningful connections
              </p>
            </div>
          </div>

          <Button className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
            <Eye className="w-4 h-4 mr-2" />
            View Twin
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-[#156d95]/30 transition-all">
            <div className="text-sm text-muted-foreground mb-1">Twin Health</div>
            <div className="text-3xl font-bold text-foreground mb-2">100%</div>
            <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-[#156d95]/30 transition-all">
            <div className="text-sm text-muted-foreground mb-1">Last Active</div>
            <div className="text-3xl font-bold text-foreground mb-2">2 min ago</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <Activity className="w-3 h-3" />
              Currently exploring
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-[#156d95]/30 transition-all">
            <div className="text-sm text-muted-foreground mb-1">Conversations Today</div>
            <div className="text-3xl font-bold text-foreground mb-2">17</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-[#156d95]">
              <TrendingUp className="w-3 h-3" />
              +5 since yesterday
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Today's Activity Card
function TodayActivityCard() {
  const activities = [
    { icon: Users, label: "Explored 148 Twins", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { icon: MessageSquare, label: "Started 12 AI Conversations", color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { icon: Zap, label: "Continued 5 Conversations", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { icon: Eye, label: "Evaluated 27 Profiles", color: "text-green-500", bgColor: "bg-green-500/10" },
    { icon: Heart, label: "Found 4 High Compatibility Matches", color: "text-pink-500", bgColor: "bg-pink-500/10" },
    { icon: Brain, label: "Learned New Preferences", color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>
          Today's Twin Activity
        </h3>
        <Badge variant="secondary" className="text-xs">Last 24 hours</Badge>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all group cursor-pointer border border-transparent hover:border-border"
          >
            <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="font-medium text-foreground">{activity.label}</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Notifications Card
function NotificationsCard() {
  const notifications = [
    { 
      icon: Heart, 
      title: "New Match Found", 
      message: "Sarah Chen - 94% compatibility", 
      time: "5 minutes ago",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    { 
      icon: MessageSquare, 
      title: "Conversation Completed", 
      message: "Your Twin finished talking with Alex's Twin", 
      time: "1 hour ago",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      icon: Bot, 
      title: "Twin Updated", 
      message: "Your Twin learned new preferences from recent interactions", 
      time: "3 hours ago",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      icon: Sparkles, 
      title: "New Insight", 
      message: "Your Twin discovered a new compatibility pattern", 
      time: "5 hours ago",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>
          Recent Notifications
        </h3>
        <Button variant="ghost" size="sm" className="text-[#156d95]">
          View All <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.05 }}
            className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-border group"
          >
            <div className={`w-10 h-10 rounded-lg ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
              <notification.icon className={`w-5 h-5 ${notification.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground">{notification.title}</div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
