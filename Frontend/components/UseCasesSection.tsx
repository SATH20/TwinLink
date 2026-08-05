"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, Users, Briefcase, Rocket, BookOpen, Globe, Gamepad2 } from "lucide-react"

interface UseCase {
  name: string
  icon: React.ReactNode
  description: string
  color: string
}

const useCases: UseCase[] = [
  {
    name: "Dating",
    icon: <Heart className="w-6 h-6" />,
    description: "Find romantic connections based on deep compatibility, shared values, and relationship goals.",
    color: "#e11d48",
  },
  {
    name: "Friends",
    icon: <Users className="w-6 h-6" />,
    description: "Discover genuine friendships with people who share your interests, energy, and life philosophy.",
    color: "#0ea5e9",
  },
  {
    name: "Professional",
    icon: <Briefcase className="w-6 h-6" />,
    description: "Build your professional network with people who align with your career goals and industry values.",
    color: "#8b5cf6",
  },
  {
    name: "Co-founders",
    icon: <Rocket className="w-6 h-6" />,
    description: "Find startup co-founders who complement your skills, vision, and entrepreneurial drive.",
    color: "#f97316",
  },
  {
    name: "Study Partners",
    icon: <BookOpen className="w-6 h-6" />,
    description: "Connect with study partners who match your learning style, academic goals, and commitment level.",
    color: "#06b6d4",
  },
  {
    name: "Travel Partners",
    icon: <Globe className="w-6 h-6" />,
    description: "Meet travel companions who share your adventure style, budget preferences, and destination interests.",
    color: "#10b981",
  },
  {
    name: "Gaming",
    icon: <Gamepad2 className="w-6 h-6" />,
    description: "Find gaming partners who match your play style, skill level, and gaming preferences.",
    color: "#a855f7",
  },
]

export function UseCasesSection() {
  return (
    <section className="py-24 bg-background" id="use-cases">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-figtree text-[40px] font-normal leading-tight mb-4">
            One Network. Every Connection Type.
          </h2>
          <p className="font-figtree text-lg text-muted-foreground max-w-2xl mx-auto">
            TwinLink isn't just a dating app. It's an AI-powered network for every meaningful connection in your life.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl border-2 border-border hover:border-foreground/20 transition-all bg-card hover:shadow-lg"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{ backgroundColor: useCase.color }}
              >
                {useCase.icon}
              </div>
              <h3 className="font-figtree text-xl font-medium mb-2">{useCase.name}</h3>
              <p className="font-figtree text-base text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button className="bg-[#156d95] text-white px-[18px] py-[15px] rounded-full font-figtree text-lg hover:rounded-2xl transition-all">
            Create Your Digital Twin
          </button>
        </motion.div>
      </div>
    </section>
  )
}
