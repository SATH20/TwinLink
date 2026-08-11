"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, Lightbulb } from "lucide-react"
import type { Conversation } from "@/lib/types/conversation"

export function InsightsPanel({ conversation }: { conversation: Conversation }) {
  // Build insights strictly from backend data: discussed topics, then any
  // identified strengths. No demo fallbacks.
  const topicInsights = conversation.topicsDiscussed.map(
    (topic) => `The twins discussed ${topic}.`
  )
  const strengthInsights = conversation.strengths.map((strength) => strength.trim())
  const insights = [...topicInsights, ...strengthInsights]

  if (conversation.emotionalTone) {
    insights.unshift(`Overall emotional tone: ${conversation.emotionalTone}.`)
  }

  if (insights.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-[#8b5cf6]/[0.02] backdrop-blur-xl border border-border/50 p-8 shadow-lg hover:border-[#8b5cf6]/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#156d95]/20 text-[#8b5cf6]">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
          AI-Generated Insights
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.01, x: 4 }}
            className="group relative flex items-start gap-4 rounded-xl bg-card/40 p-4 border border-border/30 hover:border-[#8b5cf6]/40 transition-all overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#8b5cf6] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#8b5cf6]/10 text-[#8b5cf6] mt-0.5">
              <Lightbulb className="h-4 w-4" />
            </div>
            
            <p className="flex-1 text-sm leading-relaxed text-foreground/90 py-1">
              {insight}
            </p>
            
            <div className="text-4xl font-bold text-muted/20 group-hover:text-muted/40 transition-colors pointer-events-none select-none">
              {(index + 1).toString().padStart(2, "0")}
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-[#8b5cf6]/30 to-transparent origin-left w-full"
            />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/20 border border-border/30">
        <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
        <span className="text-xs font-medium text-muted-foreground">
          {insights.length} insight{insights.length === 1 ? "" : "s"} generated from the analysis
        </span>
      </div>
    </motion.div>
  )
}
