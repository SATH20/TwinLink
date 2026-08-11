"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Award, Shield, CheckCircle, Brain, Target, Heart, Star, Zap } from "lucide-react"
import { getRecommendationDisplay } from "@/lib/utils/conversation.utils"
import type { Conversation } from "@/lib/types/conversation"

const FINDING_ICONS = [Star, Heart, Zap, Target]
const FINDING_COLORS = ["#156d95", "#8b5cf6", "#10b981", "#f59e0b"]

export function CompatibilityReport({ conversation }: { conversation: Conversation }) {
  const overallScore = conversation.compatibilityScore
  const confidence = conversation.confidenceScore
  const radius = 40
  const circumference = 2 * Math.PI * radius

  // Findings come straight from backend strengths — no demo defaults.
  const findings = conversation.strengths.slice(0, 4).map((strength, idx) => {
    const [head, ...rest] = strength.split(":")
    return {
      label: rest.length > 0 ? head.trim() : "Strength",
      text: rest.length > 0 ? rest.join(":").trim() : strength.trim(),
      color: FINDING_COLORS[idx % FINDING_COLORS.length],
      icon: FINDING_ICONS[idx % FINDING_ICONS.length],
    }
  })

  const action = getRecommendationDisplay(conversation.recommendation, overallScore)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl bg-card/80 backdrop-blur-xl border border-border p-8 shadow-[0_0_40px_-15px_rgba(21,109,149,0.3)] hover:border-[#156d95]/30 transition-all overflow-hidden"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20">
            <Award className="h-6 w-6 text-[#8b5cf6]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
              Compatibility Report
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-generated comprehensive analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-[#156d95]/5 to-[#8b5cf6]/5 border border-border/50 relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 rounded-full border-2 border-dashed border-[#156d95]/20"
          />
          <div className="relative w-24 h-24 mb-4 flex items-center justify-center z-10">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                className="text-muted/20"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
              />
              <motion.circle
                stroke="#156d95"
                strokeWidth="6"
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset: circumference - (overallScore / 100) * circumference,
                }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#156d95] to-[#8b5cf6] bg-clip-text text-transparent">
                {overallScore}%
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-foreground z-10">Overall Compatibility</span>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border/50"
        >
          <Shield className="w-10 h-10 text-[#8b5cf6] mb-4" />
          <span className="text-3xl font-bold text-foreground mb-1">{confidence}%</span>
          <span className="text-sm font-medium text-muted-foreground">AI Confidence</span>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border"
          style={{ 
            backgroundColor: `${action.color}0D`,
            borderColor: `${action.color}33`
          }}
        >
          <CheckCircle className="w-10 h-10 mb-4" style={{ color: action.color }} />
          <div className="px-3 py-1 text-white text-sm font-bold rounded-full mb-2 shadow-sm" style={{ backgroundColor: action.color }}>
            {action.label}
          </div>
          <span className="text-sm font-medium" style={{ color: action.color }}>Recommendation</span>
        </motion.div>
      </div>

      {conversation.summary && (
        <div className="p-5 rounded-xl bg-card/60 border border-border/50 backdrop-blur-md mb-8 flex gap-4 items-start shadow-inner">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#156d95]/10 flex items-center justify-center mt-1">
            <Brain className="w-4 h-4 text-[#156d95]" />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {conversation.summary}
          </p>
        </div>
      )}

      {findings.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {findings.map((finding, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors"
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${finding.color}15` }}>
                <finding.icon className="w-5 h-5" style={{ color: finding.color }} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">{finding.label}</div>
                <div className="text-sm font-semibold" style={{ color: finding.color }}>{finding.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {conversation.recommendation && (
        <div className="rounded-xl bg-gradient-to-r from-[#156d95]/10 via-[#8b5cf6]/10 to-transparent p-4 border-l-4 border-[#8b5cf6]">
          <p className="text-sm font-medium text-foreground">
            <strong className="text-[#8b5cf6]">Next Step:</strong> {action.nextStep}
          </p>
        </div>
      )}
    </motion.div>
  )
}
