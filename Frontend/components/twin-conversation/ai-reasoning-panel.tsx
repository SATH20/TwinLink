"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Brain, TrendingUp } from "lucide-react"
import { getReasoningDimensions } from "@/lib/utils/conversation.utils"
import type { Conversation } from "@/lib/types/conversation"

export function AIReasoningPanel({ conversation }: { conversation: Conversation }) {
  const reasoningCategories = getReasoningDimensions(conversation)

  // Overall compatibility is the single source of truth from the backend.
  const overallScore = conversation.compatibilityScore

  const radius = 50
  const circumference = 2 * Math.PI * radius

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 p-8 shadow-lg hover:border-[#156d95]/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 text-[#156d95]">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
            AI Reasoning Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Multi-dimensional compatibility breakdown
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-[120px] h-[120px] flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
            <circle
              className="text-muted/30"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
            />
            <motion.circle
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset:
                  circumference - (overallScore / 100) * circumference,
              }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#156d95" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#156d95] to-[#8b5cf6] bg-clip-text text-transparent">
              {overallScore}%
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Overall
            </span>
          </div>
        </div>
      </div>

      {reasoningCategories.length > 0 ? (
        <div className="space-y-4 mb-8">
          {reasoningCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="group flex items-center gap-4 rounded-xl p-2 hover:bg-muted/30 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {category.name}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: category.color }}
                  >
                    {category.score}%
                  </span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted/30">
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ backgroundColor: category.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.score}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center mb-8">
          Detailed dimension breakdown is not available for this analysis.
        </p>
      )}

      <div className="pt-6 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Overall Compatibility Score</span>
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-[#156d95] to-[#8b5cf6] bg-clip-text text-transparent">
          {overallScore}%
        </span>
      </div>
    </motion.div>
  )
}
