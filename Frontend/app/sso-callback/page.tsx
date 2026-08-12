"use client"

import { useEffect } from "react"
import { useClerk } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback()
      } catch (error) {
        console.error("SSO callback error:", error)
        // Redirect to login with error message
        window.location.href = "/login?error=authentication_failed"
      }
    }

    handleCallback()
  }, [handleRedirectCallback])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#156d95]/5 via-[#8b5cf6]/5 to-[#0ea5e9]/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center"
        >
          <Bot className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-foreground mb-2" style={{ fontFamily: "Figtree" }}>
          Completing Authentication
        </h2>
        <p className="text-muted-foreground" style={{ fontFamily: "Figtree" }}>
          Please wait while we set up your Digital Twin...
        </p>
        <motion.div
          className="mt-6 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#156d95] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
