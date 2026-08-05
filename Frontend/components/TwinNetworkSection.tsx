"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface NetworkNode {
  id: number
  x: number
  y: number
  size: number
  delay: number
  pulseDelay: number
}

const generateNodes = (): NetworkNode[] => {
  const nodes: NetworkNode[] = []
  const gridSize = 8
  const spacing = 100

  for (let i = 0; i < 40; i++) {
    const row = Math.floor(i / gridSize)
    const col = i % gridSize
    nodes.push({
      id: i,
      x: col * spacing + (row % 2) * 50,
      y: row * spacing,
      size: Math.random() * 8 + 6,
      delay: Math.random() * 2,
      pulseDelay: Math.random() * 3,
    })
  }
  return nodes
}

export const TwinNetworkSection = () => {
  const [nodes] = useState<NetworkNode[]>(generateNodes())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="w-full py-24 bg-gradient-to-br from-background via-muted/10 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2
            className="text-[40px] leading-tight font-normal text-foreground mb-6 tracking-tight"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
              fontWeight: "400",
            }}
          >
            Millions of Digital Twins. Networking Continuously.
          </h2>
          <p
            className="text-lg leading-7 text-muted-foreground max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
            }}
          >
            The TwinLink network operates 24/7. While you sleep, work, or live your life, your Digital Twin is
            discovering, conversing, and evaluating connections on your behalf.
          </p>
        </motion.div>

        {/* Network Visualization */}
        <div className="relative w-full h-[400px] bg-gradient-to-br from-muted/5 to-muted/20 rounded-3xl overflow-hidden border border-border">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
              {/* Connection Lines */}
              <g opacity="0.15">
                {nodes.map((node, i) => {
                  const nearbyNodes = nodes.filter(
                    (n, j) => j > i && Math.hypot(n.x - node.x, n.y - node.y) < 150
                  )
                  return nearbyNodes.map((nearNode) => (
                    <motion.line
                      key={`${node.id}-${nearNode.id}`}
                      x1={node.x + 50}
                      y1={node.y + 50}
                      x2={nearNode.x + 50}
                      y2={nearNode.y + 50}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-[#156d95]"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isVisible ? { pathLength: 1, opacity: 0.3 } : {}}
                      transition={{ duration: 1.5, delay: node.delay }}
                    />
                  ))
                })}
              </g>

              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  {/* Pulse Ring */}
                  <motion.circle
                    cx={node.x + 50}
                    cy={node.y + 50}
                    r={node.size}
                    fill="none"
                    stroke="#156d95"
                    strokeWidth="2"
                    opacity="0"
                    animate={{
                      r: [node.size, node.size + 20],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: node.pulseDelay,
                      ease: "easeOut",
                    }}
                  />

                  {/* Main Node */}
                  <motion.circle
                    cx={node.x + 50}
                    cy={node.y + 50}
                    r={node.size}
                    fill="#156d95"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isVisible ? { scale: 1, opacity: 0.8 } : {}}
                    transition={{ duration: 0.5, delay: node.delay }}
                  />

                  {/* Inner Glow */}
                  <motion.circle
                    cx={node.x + 50}
                    cy={node.y + 50}
                    r={node.size * 0.5}
                    fill="#fff"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isVisible ? { scale: 1, opacity: 0.8 } : {}}
                    transition={{ duration: 0.5, delay: node.delay + 0.1 }}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Overlay Stats */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-background/95 backdrop-blur-sm border border-border rounded-xl px-6 py-4"
            >
              <div className="text-sm text-muted-foreground mb-1 font-figtree">Active Twins</div>
              <div className="text-3xl font-semibold text-[#156d95] font-figtree">1,430,992</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-background/95 backdrop-blur-sm border border-border rounded-xl px-6 py-4"
            >
              <div className="text-sm text-muted-foreground mb-1 font-figtree">Conversations Today</div>
              <div className="text-3xl font-semibold text-[#156d95] font-figtree">847,293</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-background/95 backdrop-blur-sm border border-border rounded-xl px-6 py-4"
            >
              <div className="text-sm text-muted-foreground mb-1 font-figtree">Matches Found</div>
              <div className="text-3xl font-semibold text-[#156d95] font-figtree">124,847</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
