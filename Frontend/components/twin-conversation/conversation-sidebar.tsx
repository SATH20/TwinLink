"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, MessageSquare, RefreshCw, TrendingUp, Clock } from "lucide-react"

export function ConversationSidebar({
  messageCount = 0,
  reasoningIterations = 0,
  compatibilityScore = 0,
  confidenceScore = 0,
  duration = "0s",
  status = "pending",
  analysisComplete = false,
}: {
  messageCount?: number
  reasoningIterations?: number
  compatibilityScore?: number
  confidenceScore?: number
  duration?: string
  status?: string
  analysisComplete?: boolean
}) {
  const [counts, setCounts] = useState<Record<string, number>>({})

  const statistics = [
    { label: "Messages Exchanged", value: messageCount, icon: MessageSquare, color: "#156d95" },
    { label: "Reasoning Iterations", value: reasoningIterations, icon: RefreshCw, color: "#8b5cf6" },
    { label: "AI Confidence", value: confidenceScore, suffix: "%", icon: TrendingUp, color: "#10b981" },
  ]

  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = []
    statistics.forEach((stat) => {
      let current = 0
      const target = stat.value
      if (target <= 0) {
        setCounts((prev) => ({ ...prev, [stat.label]: 0 }))
        return
      }
      const step = Math.max(1, Math.ceil(target / 40))
      const interval = setInterval(() => {
        current = Math.min(current + step, target)
        setCounts((prev) => ({ ...prev, [stat.label]: current }))
        if (current >= target) clearInterval(interval)
      }, 40)
      intervals.push(interval)
    })
    return () => intervals.forEach(clearInterval)
  }, [messageCount, reasoningIterations, confidenceScore])

  return (
    <div className="sticky top-32 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-card border border-border shadow-sm">
            <Activity className="w-5 h-5 text-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
            Statistics
          </h2>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
          <div
            className={`w-2 h-2 rounded-full bg-[#10b981] ${status === "IN_PROGRESS" ? "animate-pulse" : ""}`}
          />
          <span className="text-xs font-semibold text-[#10b981]">
            {status === "COMPLETED" ? "Complete" : status === "IN_PROGRESS" ? "Live" : "Idle"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {statistics.map((stat, index) => {
          const Icon = stat.icon
          const currentVal = counts[stat.label] || 0
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="relative rounded-xl border p-4 overflow-hidden"
              style={{
                borderColor: `${stat.color}33`,
                backgroundColor: `${stat.color}0A`,
              }}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: `${stat.color}1A` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
                    {currentVal}{stat.suffix || ""}
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 h-1 w-full bg-border/50">
                <motion.div 
                  className="h-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="h-px w-full bg-border/50 my-6" />

      {analysisComplete && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Overall Compatibility</span>
            <span className="text-sm font-bold text-[#10b981]">{Math.min(100, compatibilityScore)}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#10b981] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, compatibilityScore)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Duration</span>
          </div>
          <span className="text-sm font-semibold text-foreground font-mono">{duration}</span>
        </div>
      </div>
    </div>
  )
}
