"use client"

import React from "react"
import { motion } from "framer-motion"
import { Search, ScanSearch, MessageSquare, BarChart3, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STAGES = [
  { id: "searching", label: "Searching", color: "#156d95", icon: Search },
  { id: "analysis", label: "Initial Analysis", color: "#0ea5e9", icon: ScanSearch },
  { id: "conversation", label: "Conversation", color: "#8b5cf6", icon: MessageSquare },
  { id: "evaluation", label: "Evaluation", color: "#f59e0b", icon: BarChart3 },
  { id: "recommendation", label: "Recommendation", color: "#10b981", icon: CheckCircle2 },
]

export function ConversationStages({
  hasConversation = false,
  analysisComplete = false,
  status = "pending"
}: {
  hasConversation?: boolean
  analysisComplete?: boolean
  status?: string
}) {
  // Derive real progress from backend state.
  // Stages 0-2 (Searching, Analysis, Conversation) are complete once the
  // transcript exists. Stages 3-4 (Evaluation, Recommendation) complete once
  // the compatibility analysis has finished.
  const getStageStatus = (index: number): "complete" | "active" | "pending" => {
    if (status === "FAILED") return "pending"

    // Conversation transcript is available.
    if (hasConversation) {
      if (index <= 2) return "complete"
      // Evaluation + Recommendation.
      if (analysisComplete) return "complete"
      // Evaluation is actively running; recommendation still pending.
      return index === 3 ? "active" : "pending"
    }

    // No transcript yet: the conversation is being generated.
    return index === 2 ? "active" : index < 2 ? "complete" : "pending"
  }
  return (
    <div className="w-full bg-card/80 backdrop-blur-xl border border-border/80 rounded-2xl p-8 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-8" style={{ fontFamily: "Figtree" }}>
        Conversation Timeline
      </h3>

      <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-0">
        {STAGES.map((stage, idx) => {
          const isLast = idx === STAGES.length - 1
          const stageStatus = getStageStatus(idx)
          const isActive = stageStatus === "active"
          const isComplete = stageStatus === "complete"
          const isPending = stageStatus === "pending"

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Node */}
              <div className="relative flex lg:flex-col items-center gap-4 lg:gap-3 z-10 lg:w-32 lg:-ml-16 lg:first:ml-0">
                <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
                  {/* Outer Pulsing Ring */}
                  {(isActive || isComplete) && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: stage.color }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  
                  {/* Main Circle */}
                  <div 
                    className={cn(
                      "relative w-full h-full rounded-full flex items-center justify-center shadow-md",
                      isPending ? "bg-muted" : ""
                    )}
                    style={{ 
                      backgroundColor: isPending ? undefined : stage.color,
                      opacity: isPending ? 0.5 : 1
                    }}
                  >
                    <stage.icon className={cn("w-6 h-6", isPending ? "text-muted-foreground" : "text-white")} />
                  </div>
                </div>

                <div className="flex flex-col lg:items-center text-left lg:text-center">
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}>
                    {stage.label}
                  </span>
                  
                  {isComplete && (
                    <span className="text-[10px] uppercase font-bold text-emerald-500 mt-1 tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Complete
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold text-violet-500 mt-1 tracking-wider flex items-center gap-1">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-violet-500"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      In Progress
                    </span>
                  )}
                </div>
              </div>

              {/* Connector Line (visible on lg screens) */}
              {!isLast && (
                <div className="hidden lg:block relative flex-1 h-0.5 mx-4 overflow-hidden rounded-full bg-border">
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(90deg, ${stage.color}, ${STAGES[idx + 1].color})`,
                      opacity: isComplete ? 1 : 0.2
                    }}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"
                      initial={{ left: "0%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
              )}

              {/* Connector Line (mobile vertical) */}
              {!isLast && (
                <div className="lg:hidden absolute left-7 top-14 bottom-0 w-0.5 -mt-4 mb-4 bg-border">
                  <div 
                    className="absolute inset-0 w-full"
                    style={{ 
                      background: `linear-gradient(180deg, ${stage.color}, ${STAGES[idx + 1].color})`,
                      opacity: isComplete ? 1 : 0.2
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
