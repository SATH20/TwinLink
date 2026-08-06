"use client"

import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, Clock, Shield, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function AnimatedRing({ percentage, size = 44, strokeWidth = 3 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/40"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#headerGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#156d95" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function TwinConversationHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/40"
    >
      <div className="container mx-auto px-4 py-5 max-w-[1800px]">
        <div className="flex items-center justify-between gap-6">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 12px rgba(139, 92, 246, 0.2)",
                    "0 0 24px rgba(139, 92, 246, 0.4)",
                    "0 0 12px rgba(139, 92, 246, 0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center flex-shrink-0"
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold bg-gradient-to-r from-[#156d95] via-[#8b5cf6] to-[#0ea5e9] bg-clip-text text-transparent"
                  style={{ fontFamily: "Figtree" }}
                >
                  Twin Conversation
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs text-muted-foreground"
                >
                  Your Digital Twin analyzed compatibility by communicating with another AI Twin.
                </motion.p>
              </div>
            </div>
          </div>

          {/* Right Section - Glowing Metric Pills */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-3"
          >
            {/* Status */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/25"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[#10b981]"
              />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</div>
                <div className="text-sm font-bold text-[#10b981]">Completed</div>
              </div>
            </motion.div>

            {/* Compatibility with Ring */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-br from-[#156d95]/10 to-[#8b5cf6]/10 border border-[#156d95]/25"
            >
              <div className="relative flex items-center justify-center">
                <AnimatedRing percentage={94} />
                <span className="absolute text-xs font-bold bg-gradient-to-r from-[#156d95] to-[#8b5cf6] bg-clip-text text-transparent">
                  94
                </span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Compatibility</div>
                <div className="text-sm font-bold bg-gradient-to-r from-[#156d95] to-[#8b5cf6] bg-clip-text text-transparent">94%</div>
              </div>
            </motion.div>

            {/* AI Confidence */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8b5cf6]/8 border border-[#8b5cf6]/20"
            >
              <Shield className="w-4 h-4 text-[#8b5cf6]" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Confidence</div>
                <div className="text-sm font-bold text-[#8b5cf6]">96%</div>
              </div>
            </motion.div>

            {/* Duration */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border"
            >
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Duration</div>
                <div className="text-sm font-bold text-foreground font-mono">3m 42s</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
