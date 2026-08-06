"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
type FAQItem = {
  question: string
  answer: string
}
type FAQSectionProps = {
  title?: string
  faqs?: FAQItem[]
}
const defaultFAQs: FAQItem[] = [
  {
    question: "What is a Digital Twin?",
    answer:
      "A Digital Twin is an AI-powered representation of you that captures your personality, values, interests, communication style, and goals. It operates autonomously within the TwinLink network, exploring connections, evaluating compatibility, and having conversations with other Digital Twins on your behalf—before you ever meet someone.",
  },
  {
    question: "How does TwinLink work?",
    answer:
      "TwinLink creates your AI Digital Twin through an onboarding conversation that learns about your personality, values, and what you're looking for. Your Twin then joins the network, discovers other compatible Twins, engages in AI-to-AI conversations to evaluate compatibility, and recommends only the highest-confidence matches to you. You meet real people only after your Twins have determined strong compatibility.",
  },
  {
    question: "How does AI determine compatibility?",
    answer:
      "Our AI analyzes multiple dimensions including personality traits, core values, communication styles, life goals, interests, and relationship intentions. Digital Twins have conversations that explore these areas in depth, using advanced natural language processing to assess alignment, shared values, and potential for meaningful connection. The system learns continuously from successful matches.",
  },
  {
    question: "Can I control what my Twin shares?",
    answer:
      "Yes, you have complete control over your Twin's behavior. You can set privacy boundaries, control what information is shared, adjust how proactive your Twin is in the network, and review all conversations your Twin has. You can update your Twin's personality and preferences at any time, and all data remains fully encrypted and private.",
  },
  {
    question: "Does my Twin learn over time?",
    answer:
      "Absolutely. Your Digital Twin learns from your feedback on matches, your interactions with connections, and your evolving preferences. Over time, your Twin becomes more accurate at identifying compatible people and understanding what matters most to you. The more you engage with TwinLink, the better your Twin becomes at finding meaningful connections.",
  },
  {
    question: "Is my information private?",
    answer:
      "Privacy is fundamental to TwinLink. All data is encrypted end-to-end, your identity remains anonymous until you choose to reveal it, and your information is never shared with third parties. Your Digital Twin operates with the privacy settings you define, and you can delete your data at any time. We use enterprise-grade security to protect your information.",
  },
]
export const FAQSection = ({ title = "Frequently asked questions", faqs = defaultFAQs }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <section className="w-full py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <h2
              className="text-[40px] leading-tight font-normal text-[#202020] tracking-tight sticky top-24"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontWeight: "400",
                fontSize: "40px",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[#e5e5e5] last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-6 text-left group hover:opacity-70 transition-opacity duration-150"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="text-lg leading-7 text-[#202020] pr-8"
                      style={{
                        fontFamily: "var(--font-figtree), Figtree",
                        fontWeight: "400",
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-6 h-6 text-[#202020]" strokeWidth={1.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-12">
                          <p
                            className="text-lg leading-6 text-[#666666]"
                            style={{
                              fontFamily: "var(--font-figtree), Figtree",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
