"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Bot, Users, Clock, CheckCircle2, XCircle, MessageSquare, 
  User, MapPin, Briefcase, Heart, TrendingUp, Bell, ChevronDown,
  Loader2, Eye
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useConnections } from "@/lib/hooks/use-connections"
import { toast } from "sonner"
import type { ConnectionWithProfile } from "@/lib/types/api.types"

export default function ConnectionsPage() {
  const { user: clerkUser } = useUser()
  const { connections, loading, accepting, declining, acceptConnection, declineConnection } = useConnections()
  const [activeTab, setActiveTab] = useState("all")

  const currentUserId = clerkUser?.id || ""

  // Filter connections by status
  const pendingConnections = connections.filter(c => c.status === "PENDING")
  const acceptedConnections = connections.filter(c => c.status === "ACCEPTED")
  const declinedConnections = connections.filter(c => c.status === "DECLINED")

  // Separate pending into received and sent
  const receivedPending = pendingConnections.filter(c => c.targetUserId === currentUserId)
  const sentPending = pendingConnections.filter(c => c.currentUserId === currentUserId)

  const handleAccept = async (connectionId: string) => {
    try {
      await acceptConnection(connectionId)
      toast.success("Connection accepted! You can now start chatting.")
    } catch (error) {
      toast.error("Failed to accept connection")
    }
  }

  const handleDecline = async (connectionId: string) => {
    try {
      await declineConnection(connectionId)
      toast.success("Connection declined")
    } catch (error) {
      toast.error("Failed to decline connection")
    }
  }

  const getOtherUser = (connection: ConnectionWithProfile) => {
    const isReceiver = connection.targetUserId === currentUserId
    return isReceiver ? connection.currentProfile : connection.targetProfile
  }

  if (loading && connections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#156d95]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#156d95]/5">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "Figtree" }}>
            My Connections
          </h1>
          <p className="text-muted-foreground">
            Manage your introduction requests and connected users
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Total Connections"
            value={acceptedConnections.length}
            color="#156d95"
          />
          <StatCard
            icon={Clock}
            label="Pending Requests"
            value={receivedPending.length}
            color="#f59e0b"
          />
          <StatCard
            icon={CheckCircle2}
            label="Accepted"
            value={acceptedConnections.length}
            color="#10b981"
          />
          <StatCard
            icon={MessageSquare}
            label="Active Chats"
            value={acceptedConnections.length}
            color="#8b5cf6"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all">All ({connections.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingConnections.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({acceptedConnections.length})</TabsTrigger>
            <TabsTrigger value="declined">Declined ({declinedConnections.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {connections.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {receivedPending.length > 0 && (
                  <Section title="Received Requests" badge={receivedPending.length}>
                    {receivedPending.map(conn => (
                      <ConnectionCard
                        key={conn.id}
                        connection={conn}
                        otherUser={getOtherUser(conn)}
                        currentUserId={currentUserId}
                        onAccept={() => handleAccept(conn.id)}
                        onDecline={() => handleDecline(conn.id)}
                        accepting={accepting === conn.id}
                        declining={declining === conn.id}
                      />
                    ))}
                  </Section>
                )}

                {sentPending.length > 0 && (
                  <Section title="Sent Requests" badge={sentPending.length}>
                    {sentPending.map(conn => (
                      <ConnectionCard
                        key={conn.id}
                        connection={conn}
                        otherUser={getOtherUser(conn)}
                        currentUserId={currentUserId}
                        isSender
                      />
                    ))}
                  </Section>
                )}

                {acceptedConnections.length > 0 && (
                  <Section title="Accepted Connections" badge={acceptedConnections.length}>
                    {acceptedConnections.map(conn => (
                      <ConnectionCard
                        key={conn.id}
                        connection={conn}
                        otherUser={getOtherUser(conn)}
                        currentUserId={currentUserId}
                      />
                    ))}
                  </Section>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingConnections.length === 0 ? (
              <EmptyState message="No pending connection requests" />
            ) : (
              <>
                {receivedPending.length > 0 && (
                  <Section title="Received Requests" badge={receivedPending.length}>
                    {receivedPending.map(conn => (
                      <ConnectionCard
                        key={conn.id}
                        connection={conn}
                        otherUser={getOtherUser(conn)}
                        currentUserId={currentUserId}
                        onAccept={() => handleAccept(conn.id)}
                        onDecline={() => handleDecline(conn.id)}
                        accepting={accepting === conn.id}
                        declining={declining === conn.id}
                      />
                    ))}
                  </Section>
                )}

                {sentPending.length > 0 && (
                  <Section title="Sent Requests" badge={sentPending.length}>
                    {sentPending.map(conn => (
                      <ConnectionCard
                        key={conn.id}
                        connection={conn}
                        otherUser={getOtherUser(conn)}
                        currentUserId={currentUserId}
                        isSender
                      />
                    ))}
                  </Section>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedConnections.length === 0 ? (
              <EmptyState message="No accepted connections yet" />
            ) : (
              acceptedConnections.map(conn => (
                <ConnectionCard
                  key={conn.id}
                  connection={conn}
                  otherUser={getOtherUser(conn)}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="declined" className="space-y-4">
            {declinedConnections.length === 0 ? (
              <EmptyState message="No declined connections" />
            ) : (
              declinedConnections.map(conn => (
                <ConnectionCard
                  key={conn.id}
                  connection={conn}
                  otherUser={getOtherUser(conn)}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground hidden sm:block" style={{ fontFamily: "Figtree" }}>
              TwinLink
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/notifications">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-6 rounded-2xl bg-card border border-border shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Section({ title, badge, children }: { title: string; badge?: number; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {badge !== undefined && (
          <Badge variant="secondary" className="rounded-full">
            {badge}
          </Badge>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function ConnectionCard({
  connection,
  otherUser,
  currentUserId,
  onAccept,
  onDecline,
  accepting,
  declining,
  isSender,
}: {
  connection: ConnectionWithProfile
  otherUser: any
  currentUserId: string
  onAccept?: () => void
  onDecline?: () => void
  accepting?: boolean
  declining?: boolean
  isSender?: boolean
}) {
  const isReceiver = connection.targetUserId === currentUserId
  const isPending = connection.status === "PENDING"
  const isAccepted = connection.status === "ACCEPTED"
  const isDeclined = connection.status === "DECLINED"

  const userName = otherUser?.name || "Anonymous User"
  const userAge = otherUser?.age
  const userLocation = otherUser?.location?.city && otherUser?.location?.country
    ? `${otherUser.location.city}, ${otherUser.location.country}`
    : null
  const userProfession = otherUser?.profession?.title

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-card border border-border hover:border-[#156d95]/30 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Avatar className="w-16 h-16">
            <AvatarImage src={otherUser?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-[#156d95] to-[#0e5a7a] text-white text-lg">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-foreground">{userName}</h3>
                {userAge && (
                  <span className="text-muted-foreground">• {userAge}</span>
                )}
                <StatusBadge status={connection.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {userLocation && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userLocation}</span>
                  </div>
                )}
                {userProfession && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{userProfession}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-[#156d95]" />
                <span className="font-semibold text-[#156d95]">
                  {connection.compatibilityScore}% Compatible
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{new Date(connection.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isPending && isReceiver && onAccept && onDecline && (
            <>
              <Button
                onClick={onAccept}
                disabled={accepting || declining}
                className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
              >
                {accepting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Accept
              </Button>
              <Button
                onClick={onDecline}
                disabled={accepting || declining}
                variant="outline"
              >
                {declining ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Decline
              </Button>
            </>
          )}

          {isPending && isSender && (
            <Badge variant="secondary" className="whitespace-nowrap">
              <Clock className="w-3 h-3 mr-1" />
              Waiting for response
            </Badge>
          )}

          {isAccepted && (
            <Link href={`/chat/${connection.id}`}>
              <Button className="bg-gradient-to-r from-[#156d95] to-[#0e5a7a]">
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Chat
              </Button>
            </Link>
          )}

          <Link href={`/twin-conversation?id=${connection.conversationId}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Report
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    PENDING: { label: "Pending", color: "#f59e0b", bg: "#f59e0b15" },
    ACCEPTED: { label: "Connected", color: "#10b981", bg: "#10b98115" },
    DECLINED: { label: "Declined", color: "#ef4444", bg: "#ef444415" },
  }

  const { label, color, bg } = config[status as keyof typeof config] || config.PENDING

  return (
    <Badge style={{ backgroundColor: bg, color }} className="border-0">
      {label}
    </Badge>
  )
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <Users className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {message || "You don't have any connections yet."}
      </h3>
      <p className="text-muted-foreground mb-6">
        Explore your recommendations and connect with compatible people.
      </p>
      <Link href="/recommendations">
        <Button>
          <Heart className="w-4 h-4 mr-2" />
          Find People
        </Button>
      </Link>
    </div>
  )
}
