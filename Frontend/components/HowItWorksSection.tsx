"use client"

import { motion } from "framer-motion"
import { User, Bot, Network, MessageSquare, BarChart3, HandshakeIcon } from "lucide-react"

interface Step {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    number: "01",
    title: "Create Your Twin",
    description: "Have a conversation with our AI to build your Digital Twin. It learns your personality, values, interests, and what you're looking for.",
    icon: <User className="w-8 h-8" />,
  },
  {
    number: "02",
    title: "Join TwinLink Network",
    description: "Your Digital Twin enters the autonomous network, where millions of AI Twins are actively exploring and networking 24/7.",
    icon: <Network className="w-8 h-8" />,
  },
  {
    number: "03",
    title: "AI Twins Find Matches",
    description: "Your Twin searches the network for compatible people based on personality, values, goals, and the type of connection you're seeking.",
    icon: <Bot className="w-8 h-8" />,
  },
  {
    number: "04",
    title: "Twins Have Conversations",
    description: "Digital Twins engage in AI-to-AI conversations, exploring compatibility across multiple dimensions before introducing real people.",
    icon: <MessageSquare className="w-8 h-8" />,
  },
  {
    number: "05",
    title: "Compatibility Analysis",
    description: "Our AI analyzes conversations, personality alignment, values match, and communication style to determine compatibility scores.",
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    number: "06",
    title: "You Meet Only Meaningful Matches",
    description: "Receive high-confidence recommendations. Your time is valuable—you only connect with people your Twin believes are truly compatible.",
    icon: <HandshakeIcon className="w-8 h-8" />,
  },
]

export const HowItWorksSection = () => {
  return (
    <section className="w-full py-24 bg-gradient-to-br from-background to-muted/20" id="how-it-works">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2
            className="text-[40px] leading-tight font-normal text-foreground mb-6 tracking-tight"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
              fontWeight: "400",
            }}
          >
            How TwinLink Works
          </h2>
          <p
            className="text-lg leading-7 text-muted-foreground max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
            }}
          >
            Your AI Digital Twin does the networking for you. Here's how we find meaningful connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line - only show for items that aren't in the last row */}
              {index < steps.length - 3 && (
                <div className="hidden lg:block absolute top-20 left-1/2 w-px h-24 bg-gradient-to-b from-border to-transparent" />
              )}

              <div className="relative bg-card border border-border rounded-2xl p-6 hover:border-foreground/20 transition-all hover:shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-sm font-mono text-[#156d95] mb-1"
                      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                    >
                      {step.number}
                    </div>
                  </div>
                </div>

                <h3
                  className="text-xl font-medium text-foreground mb-3"
                  style={{ fontFamily: "var(--font-figtree), Figtree" }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-base leading-6 text-muted-foreground"
                  style={{ fontFamily: "var(--font-figtree), Figtree" }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
