"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Cpu, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ConversationMessage as ApiConversationMessage } from "@/lib/types/conversation"

// TypeScript interface for message structure
interface ConversationMessage {
  id: number
  twin: "twin_a" | "twin_b"
  twinName: string
  content: string
  timestamp: string
}

interface ConversationTimelineProps {
  messages: ApiConversationMessage[]
  userATwinName: string
  userBTwinName: string
}

export function ConversationTimeline({ 
  messages: apiMessages, 
  userATwinName, 
  userBTwinName,
}: ConversationTimelineProps) {
  const [visibleMessages, setVisibleMessages] = useState<ConversationMessage[]>([])
  const [isTyping, setIsTyping] = useState(true)
  const currentIndexRef = useRef(0)
  const messagesRef = useRef<ConversationMessage[]>([])

  // Convert API messages to display format
  useEffect(() => {
    const safeMessages = Array.isArray(apiMessages) ? apiMessages : []

    if (safeMessages.length === 0) {
      messagesRef.current = []
      setVisibleMessages([])
      setIsTyping(false)
      return
    }

    const formattedMessages = safeMessages.map((msg, idx) => ({
      id: idx + 1,
      twin: msg.role,
      twinName: msg.role === 'twin_a' ? userATwinName : userBTwinName,
      content: msg.content,
      timestamp: msg.timestamp,
    }))

    messagesRef.current = formattedMessages
    currentIndexRef.current = 0
    setVisibleMessages([])
    setIsTyping(true)
  }, [apiMessages, userATwinName, userBTwinName])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const processNextMessage = () => {
      const MESSAGES = messagesRef.current
      
      if (currentIndexRef.current < MESSAGES.length) {
        setIsTyping(true)
        
        timeout = setTimeout(() => {
          const messageToAdd = MESSAGES[currentIndexRef.current]
          
          // Defensive check: only add if message exists and has required properties
          if (messageToAdd && messageToAdd.twin && messageToAdd.twinName) {
            setVisibleMessages((prev) => [...prev, messageToAdd])
          }
          
          setIsTyping(false)
          currentIndexRef.current += 1
          
          if (currentIndexRef.current < MESSAGES.length) {
            timeout = setTimeout(processNextMessage, 500) // Small gap before next typing starts
          }
        }, 1500)
      } else {
        setIsTyping(false)
      }
    }

    if (messagesRef.current.length > 0) {
      processNextMessage()
    }

    return () => clearTimeout(timeout)
  }, [apiMessages])

  return (
    <div className="w-full relative">
      <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-border/50">
        <div className="p-3 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 ring-1 ring-[#156d95]/30">
          <Brain className="w-6 h-6 text-[#156d95]" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "Figtree" }}>
            AI Conversation
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Cpu className="w-3.5 h-3.5" />
            {messagesRef.current.length > 0
              ? `${messagesRef.current.length} messages exchanged`
              : "No conversation yet"}
          </p>
        </div>
      </div>

      {messagesRef.current.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-muted/30 mb-4">
            <Brain className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No conversation transcript available</p>
        </div>
      )}

      {messagesRef.current.length > 0 && (
        <div className="relative py-4">
          {/* Central neural line background */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[#156d95]/10 via-[#8b5cf6]/20 to-transparent pointer-events-none" />

          <div className="flex flex-col gap-0 items-center w-full">
            <AnimatePresence>
              {visibleMessages
                .filter((msg): msg is ConversationMessage => 
                  msg != null && 
                  typeof msg.twin === 'string' && 
                  typeof msg.twinName === 'string'
                )
                .map((msg, idx) => {
                  const isTwinA = msg.twin === "twin_a"
                  const twinColor = isTwinA ? "#156d95" : "#8b5cf6"
                  const twinBgColor = isTwinA ? "bg-[#156d95]" : "bg-[#8b5cf6]"
                
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-full flex flex-col items-center"
                    >
                      {/* Thought Node */}
                      <div 
                        className="relative w-full max-w-2xl bg-card/60 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-sm overflow-hidden"
                        style={{
                          borderLeftWidth: "4px",
                          borderLeftColor: twinColor
                        }}
                      >
                        <div 
                          className="absolute inset-0 opacity-[0.03] pointer-events-none"
                          style={{ backgroundColor: twinColor }}
                        />
                      
                        <div className="relative flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2.5 h-2.5 rounded-full", twinBgColor)} />
                            <span 
                              className="text-sm font-semibold tracking-wide"
                              style={{ color: twinColor }}
                            >
                              {msg.twinName}
                            </span>
                          </div>
                          <div className="flex items-center text-xs font-mono text-muted-foreground">
                            {msg.timestamp}
                          </div>
                        </div>
                      
                        <p className="relative text-base text-foreground leading-relaxed">
                          {msg.content}
                        </p>
                      </div>

                      {/* Neural Connector below the message */}
                      {(idx < visibleMessages.length - 1 || isTyping) && (
                        <div className="h-12 w-0.5 bg-border/40 relative flex justify-center overflow-hidden">
                          <motion.div
                            className={cn("absolute w-2 h-4 rounded-full", twinBgColor, "opacity-60 blur-[1px]")}
                            animate={{ y: [-16, 48, -16] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="w-full max-w-2xl"
                >
                  <div className="mx-auto w-max px-6 py-3 bg-card/50 backdrop-blur-md rounded-full border border-border flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-500" /> Twin is processing...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
