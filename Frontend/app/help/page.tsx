"use client"

import { motion } from "framer-motion"
import { 
  Bot, HelpCircle, MessageSquare, Mail, Send, ChevronRight, Search,
  Book, Lightbulb, AlertCircle, CheckCircle, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"

const faqs = [
  {
    category: "Getting Started",
    questions: [
      { q: "How does TwinLink work?", a: "TwinLink creates an AI Digital Twin that represents you and communicates with other AI Twins to find meaningful connections before introducing real people." },
      { q: "How do I create my Digital Twin?", a: "Complete the onboarding process by answering questions about your personality, values, interests, and goals. Your Twin learns and improves over time." },
      { q: "Is TwinLink safe?", a: "Yes, we use advanced encryption and never share your personal data without consent. Your Twin only shares what you authorize." },
    ]
  },
  {
    category: "Digital Twin",
    questions: [
      { q: "How does my Twin learn?", a: "Your Twin continuously learns from your interactions, feedback, and preferences to better represent you." },
      { q: "Can I update my Twin?", a: "Yes, you can update your Twin's profile, preferences, and behaviors anytime in the Twin Settings." },
      { q: "How accurate is my Twin?", a: "Your Twin's confidence score indicates accuracy. Most Twins reach 90%+ accuracy within a week of usage." },
    ]
  },
  {
    category: "Matching",
    questions: [
      { q: "How are matches calculated?", a: "AI Twins have conversations to assess compatibility across personality, values, goals, communication style, and interests." },
      { q: "When can I chat with a match?", a: "After both Twins recommend a match and both users accept the introduction." },
      { q: "What is compatibility score?", a: "A percentage indicating how well you align with another person based on multiple factors analyzed by AI." },
    ]
  },
  {
    category: "Privacy & Security",
    questions: [
      { q: "Who can see my profile?", a: "Only people whose Twins had successful conversations with your Twin. You control visibility settings." },
      { q: "Can I block someone?", a: "Yes, you can block users anytime, and their Twin will not interact with yours." },
      { q: "How is my data used?", a: "Your data is only used to improve your Twin and find matches. We never sell your information." },
    ]
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      !searchQuery || 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                  Help & Support
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "Figtree" }}>
            How can we help you?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Search for answers or browse our FAQ
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <QuickLinkCard
            icon={Book}
            title="Documentation"
            description="Learn how to use TwinLink effectively"
            href="/docs"
          />
          <QuickLinkCard
            icon={Lightbulb}
            title="AI Usage Guide"
            description="Understand how your Digital Twin works"
            href="/docs/twin-guide"
          />
          <QuickLinkCard
            icon={MessageSquare}
            title="Contact Support"
            description="Get help from our support team"
            href="#contact"
          />
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h3>

          {filteredFaqs.map((category, catIndex) => (
            <div key={category.category} className="space-y-4">
              <h4 className="text-lg font-semibold text-[#156d95] flex items-center gap-2">
                <div className="w-1 h-6 bg-[#156d95] rounded-full" />
                {category.category}
              </h4>

              <div className="space-y-2">
                {category.questions.map((faq, qIndex) => (
                  <FAQItem
                    key={qIndex}
                    question={faq.q}
                    answer={faq.a}
                    isExpanded={expandedQuestion === `${catIndex}-${qIndex}`}
                    onClick={() => setExpandedQuestion(
                      expandedQuestion === `${catIndex}-${qIndex}` ? null : `${catIndex}-${qIndex}`
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-card border border-border p-8"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-8">Send us a message and we'll get back to you soon</p>

            <form className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this about?" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Describe your issue or question..."
                  rows={6}
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function QuickLinkCard({ icon: Icon, title, description, href }: any) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4 }}
        className="rounded-xl bg-card border border-border p-6 hover:border-[#156d95]/30 hover:shadow-lg transition-all cursor-pointer h-full"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-[#156d95]" />
        </div>
        <h3 className="font-semibold text-foreground mb-2 flex items-center justify-between">
          {title}
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </motion.div>
    </Link>
  )
}

function FAQItem({ question, answer, isExpanded, onClick }: any) {
  return (
    <motion.div
      className="rounded-xl border border-border bg-card hover:border-[#156d95]/30 transition-colors overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h5 className="font-semibold text-foreground mb-1">{question}</h5>
          {isExpanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-muted-foreground mt-2 leading-relaxed"
            >
              {answer}
            </motion.p>
          )}
        </div>
        <ChevronRight 
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`} 
        />
      </div>
    </motion.div>
  )
}
