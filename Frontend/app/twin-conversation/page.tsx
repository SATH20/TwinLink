"use client"

import { motion } from "framer-motion"
import { TwinConversationHeader } from "@/components/twin-conversation/header"
import { TwinProfilePanel } from "@/components/twin-conversation/twin-profile-panel"
import { ConversationTimeline } from "@/components/twin-conversation/conversation-timeline"
import { AIReasoningPanel } from "@/components/twin-conversation/ai-reasoning-panel"
import { CompatibilityReport } from "@/components/twin-conversation/compatibility-report"
import { ConversationStages } from "@/components/twin-conversation/conversation-stages"
import { InsightsPanel } from "@/components/twin-conversation/insights-panel"
import { MemoryCards } from "@/components/twin-conversation/memory-cards"
import { QuickActions } from "@/components/twin-conversation/quick-actions"
import { ConversationSidebar } from "@/components/twin-conversation/conversation-sidebar"

function AmbientOrb({
  color,
  size,
  position,
  delay = 0,
}: {
  color: string
  size: string
  position: string
  delay?: number
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.12, 0.22, 0.12],
        x: [0, 30, -20, 0],
        y: [0, -20, 15, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`fixed ${position} ${size} rounded-full blur-3xl pointer-events-none -z-10`}
      style={{ background: color }}
    />
  )
}

export default function TwinConversationPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden scroll-smooth">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <AmbientOrb
          color="linear-gradient(135deg, rgba(21, 109, 149, 0.3), rgba(139, 92, 246, 0.15))"
          size="w-[600px] h-[600px]"
          position="top-[-200px] left-[-100px]"
          delay={0}
        />
        <AmbientOrb
          color="linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.1))"
          size="w-[500px] h-[500px]"
          position="top-[40%] right-[-150px]"
          delay={4}
        />
        <AmbientOrb
          color="linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(16, 185, 129, 0.1))"
          size="w-[400px] h-[400px]"
          position="bottom-[-100px] left-[30%]"
          delay={8}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <TwinConversationHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-[1800px]">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Your Twin Profile */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="col-span-12 lg:col-span-3"
          >
            <TwinProfilePanel
              name="Sathwik"
              type="your"
              status="ACTIVE"
              mission="Finding meaningful connections."
              personality={["Thoughtful", "Ambitious", "Tech-savvy"]}
              interests={["AI", "Startups", "Philosophy"]}
              values={["Honesty", "Growth", "Innovation"]}
            />
          </motion.div>

          {/* Center Panel - Main Conversation */}
          <div className="col-span-12 lg:col-span-6 space-y-8">
            {/* Conversation Stages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <ConversationStages />
            </motion.div>

            {/* Main Conversation Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <ConversationTimeline />
            </motion.div>

            {/* AI Reasoning Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <AIReasoningPanel />
            </motion.div>

            {/* Compatibility Report */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <CompatibilityReport />
            </motion.div>

            {/* Insights Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <InsightsPanel />
            </motion.div>

            {/* Memory Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <MemoryCards />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <QuickActions />
            </motion.div>
          </div>

          {/* Right Panel - Matched Twin Profile & Stats */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <TwinProfilePanel
                name="Priya"
                type="matched"
                status="ACTIVE"
                mission="Representing its user."
                personality={["Empathetic", "Driven", "Creative"]}
                interests={["Technology", "Travel", "Design"]}
                values={["Commitment", "Trust", "Balance"]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <ConversationSidebar />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
