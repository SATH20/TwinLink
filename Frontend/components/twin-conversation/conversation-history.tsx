"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { History, MessageSquare, ChevronRight, Loader2 } from "lucide-react"
import { useConversation } from "@/lib/hooks/useConversation"
import { useRouter } from "next/navigation"

export function ConversationHistory() {
  const router = useRouter()
  const { conversations, loading, getUserConversations } = useConversation()

  useEffect(() => {
    getUserConversations()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const handleConversationClick = (conversationId: string) => {
    router.push(`/twin-conversation?id=${conversationId}`)
  }

  return (
    <div className="rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-card border border-border shadow-sm">
          <History className="w-5 h-5 text-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
          Conversation History
        </h2>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/30 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No previous conversations</p>
        </div>
      )}

      {!loading && conversations.length > 0 && (
        <div className="space-y-3">
          {conversations.slice(0, 5).map((conv, index) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleConversationClick(conv.id)}
              className="w-full text-left p-4 rounded-xl bg-card border border-border/50 hover:border-[#156d95]/50 hover:bg-card/80 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-[#156d95]" />
                    <span className="text-sm font-semibold text-foreground">
                      {conv.status === "FAILED"
                        ? "Failed"
                        : conv.analysisComplete
                          ? "Match Evaluated"
                          : "Analyzing..."}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(conv.createdAt)}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#156d95] transition-colors" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">Compatibility:</div>
                  {conv.analysisComplete ? (
                    <div
                      className="text-sm font-bold"
                      style={{
                        color: conv.compatibilityScore >= 80 ? "#10b981" :
                               conv.compatibilityScore >= 60 ? "#f59e0b" : "#ef4444"
                      }}
                    >
                      {conv.compatibilityScore}%
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-muted-foreground">—</div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {conv.messages.length} msgs
                  </span>
                </div>
              </div>
            </motion.button>
          ))}

          {conversations.length > 5 && (
            <button className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all ({conversations.length}) →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
