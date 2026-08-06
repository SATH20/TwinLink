"use client"

import { motion } from "framer-motion"
import { UserCog, Bot, BarChart3, Network, Shield, TrendingUp } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <UserCog className="w-8 h-8" />,
    title: "Create Your Digital Twin",
    description:
      "Build an AI version of yourself that captures your personality, values, interests, and goals through an intelligent onboarding conversation.",
  },
  {
    icon: <Bot className="w-8 h-8" />,
    title: "AI Twin Conversations",
    description:
      "Your Digital Twin engages with other Twins in the network, having deep conversations to explore compatibility before you meet.",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Compatibility Analysis",
    description:
      "Advanced AI analyzes personality traits, values alignment, communication styles, and life goals to determine compatibility scores.",
  },
  {
    icon: <Network className="w-8 h-8" />,
    title: "Autonomous AI Network",
    description:
      "Join a network of millions of Digital Twins operating 24/7, continuously discovering and evaluating potential connections on your behalf.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Privacy First",
    description:
      "Your identity remains anonymous until you choose to reveal it. All data is encrypted end-to-end with enterprise-grade security.",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Continuous Learning",
    description:
      "Your Twin learns from your feedback and interactions, becoming more accurate at identifying compatible people over time.",
  },
]

export const FeaturesSection = () => {
  return (
    <section className="w-full py-24 bg-muted/20" id="features">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2
            className="text-[40px] leading-tight font-normal text-foreground mb-6 tracking-tight"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
              fontWeight: "400",
            }}
          >
            AI-Powered Connection Discovery
          </h2>
          <p
            className="text-lg leading-7 text-muted-foreground max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
            }}
          >
            TwinLink combines advanced AI with autonomous networking to find the connections that matter most to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/20 transition-all hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>

              <h3
                className="text-xl font-medium text-foreground mb-3"
                style={{ fontFamily: "var(--font-figtree), Figtree" }}
              >
                {feature.title}
              </h3>

              <p
                className="text-base leading-6 text-muted-foreground"
                style={{ fontFamily: "var(--font-figtree), Figtree" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
