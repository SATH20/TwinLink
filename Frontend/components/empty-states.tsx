"use client"

import { motion } from "framer-motion"
import { 
  Heart, MessageSquare, Bell, Search, Users, Sparkles, Bot
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// No Matches Empty State
export function NoMatchesEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center mb-6"
      >
        <Heart className="w-16 h-16 text-pink-500" />
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3">No Matches Yet</h3>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
        Your Digital Twin is actively exploring the network. New high-compatibility matches will appear here soon.
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Bot className="w-4 h-4 text-[#156d95]" />
        </motion.div>
        <span>Your Twin is searching...</span>
      </div>
    </motion.div>
  )
}

// No Notifications Empty State
export function NoNotificationsEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6"
      >
        <Bell className="w-16 h-16 text-blue-500" />
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3">You're All Caught Up!</h3>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        No new notifications at the moment. We'll notify you when something important happens.
      </p>
    </motion.div>
  )
}

// No Conversations Empty State
export function NoConversationsEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6"
      >
        <MessageSquare className="w-16 h-16 text-purple-500" />
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3">No Conversations Yet</h3>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
        Your Digital Twin is currently exploring and having conversations with other AI Twins. Check back soon!
      </p>

      <Link href="/discover">
        <Button className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
          <Users className="w-4 h-4 mr-2" />
          Discover People
        </Button>
      </Link>
    </motion.div>
  )
}

// No Messages Empty State
export function NoMessagesEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6"
      >
        <MessageSquare className="w-16 h-16 text-green-500" />
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3">No Messages</h3>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
        Start a conversation with your matches to build meaningful connections.
      </p>

      <Link href="/recommendations">
        <Button className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
          <Heart className="w-4 h-4 mr-2" />
          View Recommendations
        </Button>
      </Link>
    </motion.div>
  )
}

// No Search Results Empty State
export function NoSearchResultsEmpty({ query }: { query?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
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
        className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-6"
      >
        <Search className="w-16 h-16 text-yellow-500" />
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3">No Results Found</h3>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
        {query 
          ? `We couldn't find any results for "${query}". Try adjusting your search.`
          : "No results match your current filters. Try adjusting your criteria."}
      </p>

      <Button variant="outline">
        <Search className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </motion.div>
  )
}

// Twin Learning Empty State
export function TwinLearningEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative w-32 h-32 mb-6"
      >
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#156d95]/30" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center">
          <Bot className="w-12 h-12 text-[#156d95]" />
        </div>
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3">Your Twin is Learning</h3>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        Your Digital Twin is currently analyzing your preferences and learning to represent you better. This process improves over time.
      </p>
    </motion.div>
  )
}

// Generic Empty State
export function GenericEmpty({ 
  icon: Icon = Sparkles, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: {
  icon?: any
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center mb-6"
      >
        <Icon className="w-16 h-16 text-[#156d95]" />
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">{description}</p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
            {actionLabel}
          </Button>
        </Link>
      )}
    </motion.div>
  )
}
