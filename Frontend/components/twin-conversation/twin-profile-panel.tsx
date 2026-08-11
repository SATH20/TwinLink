"use client"

import { motion } from "framer-motion"
import { Bot, Sparkles, Target, Heart, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TwinProfilePanelProps {
  name: string
  type: "your" | "matched"
  status: string
  mission: string
  personality: string[]
  interests: string[]
  values: string[]
}

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"

export function TwinProfilePanel({
  name,
  type,
  status,
  mission,
  personality,
  interests,
  values,
}: TwinProfilePanelProps) {
  const safePersonality = Array.isArray(personality) ? personality : []
  const safeInterests = Array.isArray(interests) ? interests : []
  const safeValues = Array.isArray(values) ? values : []
  const isYourTwin = type === "your"
  const accentColor = isYourTwin ? "#156d95" : "#8b5cf6"
  const accentColorDark = isYourTwin ? "#0e5a7a" : "#6d28d9"
  const gradient = `linear-gradient(135deg, ${accentColor}, ${accentColorDark})`
  const statusLabel =
    status === "COMPLETED" ? "Completed" : status === "IN_PROGRESS" ? "Talking" : status

  return (
    <div className="sticky top-32 rounded-2xl bg-card/80 backdrop-blur-xl border border-border p-6 shadow-lg space-y-6">
      {/* Avatar Section */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          {/* Outer glow hex */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 -m-3"
            style={{
              clipPath: hexClip,
              background: gradient,
            }}
          />
          {/* Main hex avatar */}
          <motion.div
            animate={{
              boxShadow: [
                `0 0 16px ${accentColor}30`,
                `0 0 32px ${accentColor}50`,
                `0 0 16px ${accentColor}30`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative w-20 h-20 flex items-center justify-center"
            style={{
              clipPath: hexClip,
              background: gradient,
            }}
          >
            <Bot className="w-10 h-10 text-white" />
          </motion.div>

          {/* Status dot */}
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] border-2 border-card flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </motion.div>
        </div>

        {/* Name & Title */}
        <div>
          <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
            {name}&apos;s Twin
          </h3>
          <p className="text-sm text-muted-foreground">
            {isYourTwin ? "Your AI Representative" : "AI Representative"}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center gap-2">
          <Badge
            className="text-xs font-semibold text-white"
            style={{ background: gradient }}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 inline-block"
            />
            {statusLabel}
          </Badge>
        </div>
      </div>

      {/* Mission */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Target className="w-3.5 h-3.5" style={{ color: accentColor }} />
          Mission
        </div>
        <div
          className="p-3.5 rounded-xl border"
          style={{
            borderColor: `${accentColor}15`,
            background: `linear-gradient(135deg, ${accentColor}06, transparent)`,
          }}
        >
          <p className="text-sm text-foreground/80 italic leading-relaxed">&ldquo;{mission}&rdquo;</p>
        </div>
      </div>

      {/* Personality */}
      {safePersonality.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
          Personality
        </div>
        <div className="flex flex-wrap gap-1.5">
          {safePersonality.map((trait, index) => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.08 }}
            >
              <Badge
                className="text-xs font-medium"
                style={{
                  backgroundColor: `${accentColor}12`,
                  color: accentColor,
                  border: `1px solid ${accentColor}25`,
                }}
              >
                {trait}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
      )}

      {/* Interests */}
      {safeInterests.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5" style={{ color: accentColor }} />
          Interests
        </div>
        <div className="flex flex-wrap gap-1.5">
          {safeInterests.map((interest, index) => (
            <motion.div
              key={interest}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + index * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <Badge
                variant="outline"
                className="text-xs"
                style={{ borderColor: `${accentColor}30` }}
              >
                {interest}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
      )}

      {/* Values */}
      {safeValues.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" style={{ color: accentColor }} />
          Values
        </div>
        <div className="space-y-1.5">
          {safeValues.map((value, index) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.08 }}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-sm text-foreground/80">{value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      )}
    </div>
  )
}
