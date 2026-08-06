"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  backHref = "/dashboard",
  backLabel = "Back",
  children,
  className,
}: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/40",
        className
      )}
    >
      <div className="container mx-auto px-4 py-5 max-w-[1800px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={backHref}>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1
                className="text-2xl font-bold text-foreground tracking-tight"
                style={{ fontFamily: "Figtree" }}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </div>
    </motion.header>
  )
}
