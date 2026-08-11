"use client"

import React from "react"
import { motion } from "framer-motion"
import { Database, Shield, Cpu, Heart, MessageCircle } from "lucide-react"

interface MemoryCard {
  id: number
  tag: string
  content: string
  color: string
  icon: typeof Shield
}

export function MemoryCards({
  myInterests = [],
  myValues = [],
}: {
  myInterests?: string[]
  myValues?: string[]
}) {
  // Build the memory cards from the user's real profile data. Values and
  // interests are the data points the twin references during analysis.
  const valueCards: MemoryCard[] = myValues.slice(0, 4).map((value, idx) => ({
    id: idx + 1,
    tag: "Value",
    content: value,
    color: "#156d95",
    icon: Shield,
  }))

  const interestCards: MemoryCard[] = myInterests.slice(0, 4).map((interest, idx) => ({
    id: valueCards.length + idx + 1,
    tag: "Interest",
    content: interest,
    color: "#0ea5e9",
    icon: Cpu,
  }))

  const memories = [...valueCards, ...interestCards]

  if (memories.length === 0) {
    return null
  }

  const valueCount = valueCards.length
  const interestCount = interestCards.length

  return (
    <div className="rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-[#156d95]/10">
          <Database className="w-6 h-6 text-[#156d95]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
          Memory Used
        </h2>
      </div>
      <p className="text-muted-foreground mb-6">Key data points referenced during analysis</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {memories.map((memory, index) => {
          const Icon = memory.icon
          return (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 12 }}
              whileHover={{ rotateY: 8, rotateX: -4, scale: 1.05 }}
              className="relative overflow-hidden rounded-xl border p-4 flex flex-col h-full"
              style={{
                borderColor: `${memory.color}4D`,
                backgroundColor: `${memory.color}14`,
                transformPerspective: 800,
              }}
            >
              <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                  className="w-full h-full"
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.1) 40%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>

              <div className="flex justify-between items-center mb-3 relative z-10">
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-md"
                  style={{ backgroundColor: `${memory.color}33`, color: memory.color }}
                >
                  {memory.tag}
                </span>
                <span className="text-xs font-mono text-muted-foreground">#{memory.id}</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 relative z-10 py-2">
                <Icon className="w-6 h-6" style={{ color: memory.color }} />
                <p className="font-semibold text-sm leading-tight" style={{ color: memory.color }}>
                  {memory.content}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between text-sm">
        <div className="text-muted-foreground font-medium">
          Total memory cards: {memories.length}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#156d95]" />
            <span className="text-muted-foreground">Values ({valueCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-[#0ea5e9]" />
            <span className="text-muted-foreground">Interests ({interestCount})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
