"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, User, Download, Share2, Loader2, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions({
  canAccept = false,
  accepting = false,
  requestPending = false,
  connected = false,
  onAccept,
}: {
  canAccept?: boolean
  accepting?: boolean
  requestPending?: boolean
  connected?: boolean
  onAccept?: () => void
}) {
  return (
    <div className="rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1 text-foreground" style={{ fontFamily: "Figtree" }}>
          Quick Actions
        </h2>
        <p className="text-muted-foreground">What would you like to do next?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Accept Introduction */}
        <motion.div
          whileHover={canAccept && !requestPending && !connected ? { y: -4, scale: 1.02 } : undefined}
          className="h-full"
        >
          <Button
            onClick={onAccept}
            disabled={!canAccept || accepting || requestPending || connected}
            className="w-full h-full min-h-[120px] p-6 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg hover:shadow-xl hover:shadow-green-500/25 border-none transition-all relative overflow-hidden disabled:opacity-50"
          >
            {canAccept && !requestPending && !connected && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div className="p-3 bg-white/20 rounded-full relative z-10">
              {accepting ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : connected ? (
                <Check className="w-8 h-8 text-white" />
              ) : requestPending ? (
                <Clock className="w-8 h-8 text-white" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="text-center relative z-10">
              <div className="font-bold text-lg">
                {accepting 
                  ? "Sending..." 
                  : connected 
                  ? "Connected" 
                  : requestPending 
                  ? "Request Pending" 
                  : "Accept Introduction"}
              </div>
              <div className="text-xs text-white/80 font-normal">
                {connected 
                  ? "You're connected!" 
                  : requestPending 
                  ? "Waiting for response" 
                  : "Connect with this user"}
              </div>
            </div>
          </Button>
        </motion.div>

        {/* View Match Profile */}
        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="h-full">
          <Button
            variant="outline"
            className="w-full h-full min-h-[120px] p-4 flex flex-col items-center justify-center gap-3 border border-border/50 bg-card hover:border-[#0ea5e9]/50 hover:bg-[#0ea5e9]/5 transition-all group"
          >
            <div className="p-2 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#0ea5e9]/20 group-hover:from-[#156d95]/30 group-hover:to-[#0ea5e9]/30 transition-colors">
              <User className="w-6 h-6 text-[#0ea5e9]" />
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground">View Match Profile</div>
              <div className="text-xs text-muted-foreground font-normal">See detailed information</div>
            </div>
          </Button>
        </motion.div>

        {/* Save Report */}
        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="h-full">
          <Button
            variant="outline"
            className="w-full h-full min-h-[120px] p-4 flex flex-col items-center justify-center gap-3 border border-border/50 bg-card hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/5 transition-all group"
          >
            <div className="p-2 rounded-full bg-gradient-to-br from-[#8b5cf6]/20 to-[#6d28d9]/20 group-hover:from-[#8b5cf6]/30 group-hover:to-[#6d28d9]/30 transition-colors">
              <Download className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground">Save Report</div>
              <div className="text-xs text-muted-foreground font-normal">Download full analysis</div>
            </div>
          </Button>
        </motion.div>
      </div>

      <motion.div whileHover={{ y: -2 }}>
        <Button variant="ghost" className="w-full flex items-center justify-center gap-2 mb-4 hover:bg-muted/50 text-foreground">
          <Share2 className="w-4 h-4" />
          Share Conversation
        </Button>
      </motion.div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {connected
            ? "✅ You're connected! Navigate to the Connections page to start chatting."
            : requestPending 
            ? "💌 Your introduction request has been sent. You'll be notified when they respond."
            : "💡 Both users will be notified only after you accept the introduction. Your privacy is protected until then."
          }
        </p>
      </div>
    </div>
  )
}
