"use client"

import { motion } from "framer-motion"
import { 
  Bot, Search, Filter, MapPin, Briefcase, Heart, Eye, Sparkles,
  TrendingUp, Clock, Users, ArrowLeft, Bell, SlidersHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import Link from "next/link"

const mockProfiles = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 27,
    location: "San Francisco, CA",
    profession: "AI Product Manager",
    intent: "Long-term Relationship",
    interests: ["Technology", "AI", "Travel"],
    compatibility: 94,
    trending: true,
  },
  {
    id: 2,
    name: "Michael Park",
    age: 30,
    location: "Seattle, WA",
    profession: "Data Scientist",
    intent: "Startup Co-founder",
    interests: ["AI", "Gaming", "Fitness"],
    compatibility: 86,
    trending: false,
  },
  {
    id: 3,
    name: "Emma Wilson",
    age: 26,
    location: "Austin, TX",
    profession: "UX Designer",
    intent: "Dating",
    interests: ["Travel", "Books", "Photography"],
    compatibility: 88,
    trending: true,
  },
  {
    id: 4,
    name: "Alex Kumar",
    age: 29,
    location: "New York, NY",
    profession: "Software Engineer",
    intent: "Professional Networking",
    interests: ["Technology", "Movies", "Books"],
    compatibility: 91,
    trending: false,
  },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                  Discover
                </h1>
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by interests, profession, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12"
              />
            </div>

            <Button variant="outline" className="h-12">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {["all", "trending", "high-compatibility", "recently-active", "ai-suggested"].map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={selectedFilter === filter ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter)}
                className={selectedFilter === filter ? "bg-[#156d95]" : ""}
              >
                {filter === "all" && "All"}
                {filter === "trending" && <><TrendingUp className="w-3 h-3 mr-1" /> Trending</>}
                {filter === "high-compatibility" && <><Heart className="w-3 h-3 mr-1" /> High Match</>}
                {filter === "recently-active" && <><Clock className="w-3 h-3 mr-1" /> Active</>}
                {filter === "ai-suggested" && <><Sparkles className="w-3 h-3 mr-1" /> AI Suggested</>}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProfiles.map((profile, index) => (
            <ProfileCard key={profile.id} profile={profile} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileCard({ profile, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="rounded-2xl bg-card border border-border hover:border-[#156d95]/30 hover:shadow-xl transition-all overflow-hidden group"
    >
      {/* Header with Avatar */}
      <div className="relative h-48 bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center">
        <Avatar className="w-32 h-32 border-4 border-card">
          <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#8b5cf6] text-white text-3xl">
            {profile.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        {profile.trending && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}

        {/* Compatibility Badge */}
        <Badge className="absolute bottom-4 right-4 bg-green-500 text-white border-0 text-lg px-3 py-1">
          {profile.compatibility}%
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {profile.name}, {profile.age}
          </h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {profile.location}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {profile.profession}
            </div>
          </div>
        </div>

        <Badge variant="secondary" className="text-xs">
          {profile.intent}
        </Badge>

        {/* Interests */}
        <div className="flex flex-wrap gap-1">
          {profile.interests.map((interest: string) => (
            <Badge key={interest} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/profile/${profile.id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90">
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
