import { motion } from "framer-motion"
import { 
  Sparkles, Shield, Star, MessageSquare, Heart, Target, CheckCircle2,
  Compass, Clock, Lightbulb, Brain, Users, BarChart3, Eye, Cpu, Activity,
  TrendingUp, Database
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const getGradientForTrait = (color: string) => {
  const gradients: { [key: string]: string } = {
    "text-purple-500": "from-purple-500 to-purple-600",
    "text-blue-500": "from-blue-500 to-blue-600",
    "text-green-500": "from-green-500 to-green-600",
    "text-yellow-500": "from-yellow-500 to-yellow-600",
    "text-orange-500": "from-orange-500 to-orange-500",
    "text-teal-500": "from-teal-500 to-teal-600",
    "text-pink-500": "from-pink-500 to-pink-600",
    "text-indigo-500": "from-indigo-500 to-indigo-600",
  }
  return gradients[color] || "from-gray-500 to-gray-600"
}

export function PersonalityProfile({ personality }: { personality: any[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Personality Profile</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {personality.map((trait, index) => (
          <motion.div key={trait.trait} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.05, y: -4 }}
            className="p-4 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-bold ${trait.color}`}>{trait.trait}</span>
              <Badge variant="secondary" className="text-xs">{trait.confidence}%</Badge>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${trait.confidence}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
                className={`h-full bg-gradient-to-r ${getGradientForTrait(trait.color)} relative`}>
                <motion.div animate={{ x: ["0%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function ValuesSection({ values }: { values: any[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Core Values</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {values.map((item, index) => (
          <motion.div key={item.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }} whileHover={{ scale: 1.05, y: -2 }}
            className="p-4 rounded-xl border border-border bg-gradient-to-br from-card to-blue-500/5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground text-sm">{item.value}</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-xs text-muted-foreground mb-2">Strength: {item.strength}%</div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.strength}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.05 }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 relative">
                <motion.div animate={{ x: ["0%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function CommunicationStyle({ communicationStyle }: { communicationStyle: any[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Figtree" }}>Communication Style</h3>
      </div>

      <div className="space-y-3">
        {communicationStyle.map((item, index) => (
          <motion.div key={item.style} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }} whileHover={{ x: 4 }}
            className="p-4 rounded-xl border border-border bg-gradient-to-r from-card to-green-500/5 hover:shadow-md hover:border-green-500/30 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground">{item.style}</span>
              <span className="text-sm font-bold text-green-600">{item.level}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.level}%` }}
                transition={{ duration: 1, delay: 0.6 + index * 0.05 }} className="h-full bg-gradient-to-r from-green-500 to-emerald-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
