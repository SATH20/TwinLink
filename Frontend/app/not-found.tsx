"use client"

import { motion } from "framer-motion"
import { Bot, Home, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Animated Twin Icon */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative mx-auto w-40 h-40"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 blur-3xl" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#156d95] to-[#8b5cf6] flex items-center justify-center">
              <Bot className="w-20 h-20 text-white" />
            </div>

            {/* Orbiting elements */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >
                <div 
                  className="w-3 h-3 rounded-full bg-[#156d95] absolute top-0 left-1/2 -translate-x-1/2"
                  style={{
                    transform: `translateX(-50%) rotate(${i * 120}deg) translateY(-80px)`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Error Message */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-8xl font-bold bg-gradient-to-r from-[#156d95] to-[#8b5cf6] bg-clip-text text-transparent"
              style={{ fontFamily: "Figtree" }}
            >
              404
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-foreground"
              style={{ fontFamily: "Figtree" }}
            >
              This Digital Twin couldn't be found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-md mx-auto"
            >
              The page you're looking for doesn't exist or has been moved to another dimension.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90 px-8">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>

            <Link href="/discover">
              <Button variant="outline" className="px-8">
                <Search className="w-4 h-4 mr-2" />
                Discover Matches
              </Button>
            </Link>
          </motion.div>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => window.history.back()}
              className="text-sm text-muted-foreground hover:text-[#156d95] transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to previous page
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
