"use client"

import { motion } from "framer-motion"
import { Bot, TrendingUp } from "lucide-react"

export const AIConversationSection = () => {
  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2
            className="text-[40px] leading-tight font-normal text-foreground mb-6 tracking-tight"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
              fontWeight: "400",
            }}
          >
            Twin-to-Twin Conversations
          </h2>
          <p
            className="text-lg leading-7 text-muted-foreground max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
            }}
          >
            Before you meet, your Digital Twins have deep conversations to evaluate compatibility across multiple
            dimensions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-card to-muted/20 border-2 border-border rounded-3xl p-8 md:p-12 shadow-lg"
          >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Twin 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-figtree font-semibold text-foreground">Sathwik's Twin</div>
                    <div className="font-figtree text-sm text-muted-foreground">Digital Twin AI</div>
                  </div>
                </div>
                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border">
                  <p className="font-figtree text-sm text-foreground leading-relaxed">
                    "My user values honesty, long-term commitment, and intellectual conversations. He's looking for
                    someone who shares his passion for technology and personal growth."
                  </p>
                </div>
              </div>

              {/* Twin 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-figtree font-semibold text-foreground">Vatsalya's Twin</div>
                    <div className="font-figtree text-sm text-muted-foreground">Digital Twin AI</div>
                  </div>
                </div>
                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border">
                  <p className="font-figtree text-sm text-foreground leading-relaxed">
                    "My user values trust, ambition, and meaningful conversations. She's seeking someone who
                    understands the balance between career drive and authentic connection."
                  </p>
                </div>
              </div>
            </div>

            {/* Divider with arrows */}
            <div className="flex items-center justify-center my-8">
              <div className="flex-1 h-px bg-border"></div>
              <div className="mx-4 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Compatibility Result */}
            <div className="bg-gradient-to-br from-[#156d95]/10 to-[#8b5cf6]/10 rounded-2xl p-6 border-2 border-[#156d95]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#156d95]" />
                  <span className="font-figtree font-semibold text-foreground">Compatibility Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-[#156d95] font-figtree">92%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-figtree text-sm text-muted-foreground">Values Alignment</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#156d95] rounded-full" style={{ width: "94%" }} />
                    </div>
                    <span className="font-figtree text-sm font-medium text-foreground">94%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-figtree text-sm text-muted-foreground">Communication Style</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#156d95] rounded-full" style={{ width: "89%" }} />
                    </div>
                    <span className="font-figtree text-sm font-medium text-foreground">89%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-figtree text-sm text-muted-foreground">Life Goals</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#156d95] rounded-full" style={{ width: "93%" }} />
                    </div>
                    <span className="font-figtree text-sm font-medium text-foreground">93%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2 text-[#156d95]">
                  <div className="w-2 h-2 rounded-full bg-[#156d95] animate-pulse" />
                  <span className="font-figtree text-sm font-semibold">Strong Match • High Confidence</span>
                </div>
                <p className="font-figtree text-sm text-muted-foreground mt-2">
                  Both Twins show strong alignment in core values, communication compatibility, and long-term goals.
                  Recommended for introduction.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
