"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, Send, Paperclip, Smile, Mic, Image as ImageIcon, Phone, Video,
  MoreVertical, ArrowLeft, Info, Star, Heart, MapPin, Briefcase, Check, CheckCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Message {
  id: number
  sender: "user" | "match"
  content: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

// Mock data
const matchData = {
  id: "1",
  name: "Sarah Chen",
  age: 27,
  location: "San Francisco, CA",
  profession: "AI Product Manager",
  compatibility: 94,
  online: true,
  typing: false,
  sharedInterests: ["Technology", "AI", "Travel", "Books", "Fitness"],
  bio: "Building the future of AI products. Love meaningful conversations and exploring new technologies.",
}

const aiCompatibilitySummary = {
  overall: 94,
  categories: [
    { name: "Communication Style", score: 92, color: "from-blue-500 to-cyan-500" },
    { name: "Shared Values", score: 96, color: "from-purple-500 to-pink-500" },
    { name: "Lifestyle", score: 91, color: "from-green-500 to-emerald-500" },
    { name: "Goals", score: 95, color: "from-yellow-500 to-orange-500" },
  ]
}

const initialMessages: Message[] = [
  { id: 1, sender: "match", content: "Hey! Your Twin told me you're into AI and startups. That's awesome!", timestamp: new Date(Date.now() - 3600000), status: "read" },
  { id: 2, sender: "user", content: "Hi Sarah! Yes, absolutely. I saw you're a Product Manager at an AI company. What products are you working on?", timestamp: new Date(Date.now() - 3500000), status: "read" },
  { id: 3, sender: "match", content: "I'm leading a team building conversational AI for customer service. It's challenging but incredibly rewarding.", timestamp: new Date(Date.now() - 3400000), status: "read" },
  { id: 4, sender: "user", content: "That sounds fascinating! How do you approach the balance between AI automation and human empathy?", timestamp: new Date(Date.now() - 3300000), status: "read" },
  { id: 5, sender: "match", content: "Great question! We use a hybrid approach where AI handles routine queries but seamlessly escalates complex emotional situations to humans.", timestamp: new Date(Date.now() - 3200000), status: "read" },
]

export default function ChatPage({ params }: { params: { matchId: string } }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [showInfo, setShowInfo] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        content: inputValue,
        timestamp: new Date(),
        status: "sent"
      }
      setMessages([...messages, newMessage])
      setInputValue("")
      
      // Simulate read status
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        ))
      }, 500)
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        ))
      }, 1000)

      // Simulate typing indicator
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
      }, 2000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/recommendations">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-border">
                  <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white">
                    {matchData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {matchData.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                )}
              </div>

              <div>
                <h2 className="font-semibold text-foreground">{matchData.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {matchData.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-[#156d95]/10 text-[#156d95] border-[#156d95]/20 hidden sm:flex">
              <Heart className="w-3 h-3 mr-1" />
              {matchData.compatibility}% Match
            </Badge>
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowInfo(!showInfo)}>
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* AI Compatibility Banner */}
          <AICompatibilityBanner />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.reduce((acc: any[], message, index) => {
                const currentDate = formatDate(message.timestamp)
                const prevDate = index > 0 ? formatDate(messages[index - 1].timestamp) : null
                
                if (currentDate !== prevDate) {
                  acc.push(
                    <DateSeparator key={`date-${index}`} date={currentDate} />
                  )
                }
                
                acc.push(
                  <MessageBubble key={message.id} message={message} formatTime={formatTime} />
                )
                
                return acc
              }, [])}
              
              {isTyping && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-card px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="pr-10 resize-none rounded-2xl"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>

                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Mic className="w-5 h-5" />
                </Button>

                <Button 
                  onClick={handleSend}
                  className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90 rounded-full px-6"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <AnimatePresence>
          {showInfo && <InfoSidebar match={matchData} onClose={() => setShowInfo(false)} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// AI Compatibility Banner Component
function AICompatibilityBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border bg-gradient-to-r from-[#156d95]/5 via-purple-500/5 to-pink-500/5 px-4 py-3"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm text-foreground">AI Compatibility: {aiCompatibilitySummary.overall}%</div>
              <div className="text-xs text-muted-foreground">Your Digital Twins had a great conversation!</div>
            </div>
          </div>
          <Link href="/twin-conversation">
            <Button variant="ghost" size="sm" className="text-[#156d95]">
              View Twin Chat
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// Date Separator Component
function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-4 py-1 rounded-full bg-muted text-xs text-muted-foreground font-medium">
        {date}
      </div>
    </div>
  )
}

// Message Bubble Component
function MessageBubble({ message, formatTime }: { message: Message; formatTime: (date: Date) => string }) {
  const isUser = message.sender === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-end gap-2 max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white text-xs">
              {matchData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white'
                : 'bg-muted text-foreground'
            } ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>

          <div className="flex items-center gap-1 mt-1 px-2">
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
            {isUser && (
              <span className="text-xs">
                {message.status === "sent" && <Check className="w-3 h-3 text-muted-foreground" />}
                {message.status === "delivered" && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
                {message.status === "read" && <CheckCheck className="w-3 h-3 text-[#156d95]" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Typing Indicator Component
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-end gap-2 max-w-[70%]">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white text-xs">
            {matchData.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="px-6 py-3 rounded-2xl rounded-bl-sm bg-muted">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-muted-foreground"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Info Sidebar Component
function InfoSidebar({ match, onClose }: { match: typeof matchData; onClose: () => void }) {
  return (
    <motion.aside
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: "spring", damping: 25 }}
      className="w-80 border-l border-border bg-card overflow-y-auto flex-shrink-0"
    >
      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <div className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-border">
            <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white text-2xl">
              {match.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <h3 className="text-xl font-bold text-foreground mb-1">{match.name}, {match.age}</h3>
          
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {match.location}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {match.profession}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {match.bio}
          </p>
        </div>

        {/* AI Compatibility Breakdown */}
        <div>
          <h4 className="font-semibold text-foreground mb-4">AI Compatibility Breakdown</h4>
          <div className="space-y-4">
            {aiCompatibilitySummary.categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{category.name}</span>
                  <span className="font-semibold text-foreground">{category.score}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.score}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full bg-gradient-to-r ${category.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Interests */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Shared Interests</h4>
          <div className="flex flex-wrap gap-2">
            {match.sharedInterests.map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Link href={`/profile/${match.id}`}>
            <Button variant="outline" className="w-full justify-start">
              <Info className="w-4 h-4 mr-2" />
              View Full Profile
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start text-yellow-600 hover:text-yellow-600">
            <Star className="w-4 h-4 mr-2" />
            Add to Favorites
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}
