"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export default function SSOCallback() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#156d95]/5 via-[#8b5cf6]/5 to-[#0ea5e9]/5">
      <AuthenticateWithRedirectCallback />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center mx-auto mb-6"
        >
          <Bot className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "Figtree" }}>
          Completing Your Sign In...
        </h1>
        <p className="text-muted-foreground" style={{ fontFamily: "Figtree" }}>
          Just a moment while we connect your account
        </p>
      </motion.div>
    </div>
  )
}
