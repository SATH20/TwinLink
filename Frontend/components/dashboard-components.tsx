import { motion } from "framer-motion"
import { Heart, MessageSquare, ArrowRight, Target, Sparkles, Activity, Zap, Users, TrendingUp, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Match Recommendations Card
export function MatchRecommendationsCard() {
  const matches = [
    {
      name: "Sarah Chen",
      age: 27,
      compatibility: 94,
      reason: "Shares your passion for technology and entrepreneurship",
      intent: "Professional Networking",
      image: null,
    },
    {
      name: "Alex Kumar",
      age: 29,
      compatibility: 91,
      reason: "Similar communication style and career goals",
      intent: "Mentorship",
      image: null,
    },
    {
      name: "Emma Wilson",
      age: 26,
      compatibility: 88,
      reason: "Both value long-term relationships and honesty",
      intent: "Dating",
      image: null,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "Figtree" }}>
            Top Match Recommendations
          </h3>
          <p className="text-sm text-muted-foreground">Your Twin found these high-compatibility connections</p>
        </div>
        <Button variant="ghost" className="text-[#156d95]">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 hover:shadow-xl hover:border-[#156d95]/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white">
                    {match.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{match.name}, {match.age}</div>
                  <Badge variant="secondary" className="text-xs">{match.intent}</Badge>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Compatibility</span>
                <span className="text-sm font-bold text-[#156d95]">{match.compatibility}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${match.compatibility}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className="h-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6]"
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{match.reason}</p>

            <Button className="w-full bg-[#156d95] hover:bg-[#0e5a7a] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0 translate-y-2">
              View Match <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Recent AI Conversations Card
export function RecentConversationsCard() {
  const conversations = [
    {
      participant: "Rahul's Twin",
      summary: "Both value honesty and career growth.",
      compatibility: 91,
      messages: 12,
      lastActive: "5 min ago",
    },
    {
      participant: "Maya's Twin",
      summary: "Shared interest in AI and technology startups.",
      compatibility: 89,
      messages: 8,
      lastActive: "1 hour ago",
    },
    {
      participant: "John's Twin",
      summary: "Similar lifestyle preferences and fitness goals.",
      compatibility: 87,
      messages: 15,
      lastActive: "2 hours ago",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>
          Recent AI Conversations
        </h3>
        <Badge variant="secondary">
          <MessageSquare className="w-3 h-3 mr-1" />
          3 Active
        </Badge>
      </div>

      <div className="space-y-4">
        {conversations.map((conv, index) => (
          <motion.div
            key={conv.participant}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-4 rounded-xl border border-border hover:border-[#156d95]/50 hover:bg-muted/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-bold text-[#156d95]">{conv.compatibility}%</div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-foreground">🤖 Your Twin ↔ 🤖 {conv.participant}</div>
                  <span className="text-xs text-muted-foreground">{conv.lastActive}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{conv.summary}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{conv.messages} messages exchanged</span>
                </div>
              </div>

              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Read <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Mission Card
export function MissionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl bg-gradient-to-br from-[#8b5cf6]/10 to-[#0ea5e9]/10 border border-[#8b5cf6]/20 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center flex-shrink-0">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "Figtree" }}>
            Current AI Mission
          </h3>
          <p className="text-muted-foreground mb-4">
            Finding users who value long-term commitment, technology, and personal growth.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">73%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "73%" }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] relative"
              >
                <motion.div
                  animate={{ x: [0, 100, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// AI Insights Card
export function InsightsCard() {
  const insights = [
    "Your Twin discovered that you connect well with ambitious and empathetic people.",
    "You prefer deeper conversations over casual interactions.",
    "People with similar career goals tend to have higher compatibility with you.",
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>
          AI-Generated Insights
        </h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border border-[#10b981]/20"
          >
            <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-[#10b981]" />
            </div>
            <p className="text-sm text-foreground">{insight}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Network Status Card
export function NetworkStatusCard() {
  const stats = [
    { label: "Digital Twins Online", value: "12,847", trend: "+1.2k", icon: Users },
    { label: "AI Conversations Today", value: "45,231", trend: "+3.4k", icon: MessageSquare },
    { label: "Matches Generated", value: "892", trend: "+127", icon: Heart },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Wifi className="w-5 h-5 text-green-500" />
        </motion.div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>
          Network Status
        </h3>
        <Badge className="bg-green-500/10 text-green-600">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="p-4 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-[#156d95]" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              {stat.trend} today
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Live Activity Panel (Right Sidebar)
export function LiveActivityPanel() {
  const activities = [
    { action: "Searching", target: "technology enthusiasts", color: "text-blue-500", icon: Users },
    { action: "Talking", target: "with Sarah's Twin", color: "text-purple-500", icon: MessageSquare },
    { action: "Evaluating", target: "profile compatibility", color: "text-yellow-500", icon: Activity },
    { action: "Found Match", target: "94% compatibility", color: "text-green-500", icon: Heart },
  ]

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden xl:block w-80 space-y-4"
    >
      <div className="sticky top-24 space-y-4">
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="w-5 h-5 text-[#156d95]" />
            </motion.div>
            <h3 className="font-semibold text-foreground">Live Twin Activity</h3>
            <Badge className="bg-green-500/10 text-green-600 ml-auto">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse" />
              Live
            </Badge>
          </div>

          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, repeat: Infinity, repeatDelay: 4 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center"
                >
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </motion.div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${activity.color}`}>{activity.action}...</div>
                  <div className="text-xs text-muted-foreground">{activity.target}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95] hover:border-[#156d95]/20">
              <Zap className="w-4 h-4 mr-2" />
              View My Twin
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95] hover:border-[#156d95]/20">
              <Heart className="w-4 h-4 mr-2" />
              Explore Matches
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95] hover:border-[#156d95]/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-[#156d95]/10 hover:text-[#156d95] hover:border-[#156d95]/20">
              <Users className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
