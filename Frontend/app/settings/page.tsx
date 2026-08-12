"use client"

import { motion } from "framer-motion"
import { 
  Bot, Bell, Lock, Eye, Palette, Shield, Link as LinkIcon, Trash2,
  User, Settings as SettingsIcon, Moon, Sun, Monitor, ChevronRight,
  ArrowLeft, Save, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"

const settingsSections = [
  { id: "account", label: "Account", icon: User, description: "Manage your account details" },
  { id: "profile", label: "Profile", icon: User, description: "Edit your public profile" },
  { id: "twin", label: "Digital Twin", icon: Bot, description: "Configure your AI Twin" },
  { id: "privacy", label: "Privacy", icon: Shield, description: "Control who sees your information" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Manage notification preferences" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Customize your experience" },
  { id: "security", label: "Security", icon: Lock, description: "Password and authentication" },
  { id: "connected", label: "Connected Accounts", icon: LinkIcon, description: "Link external services" },
  { id: "danger", label: "Danger Zone", icon: Trash2, description: "Delete account and data" },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                  Settings
                </h1>
              </div>
            </div>

            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90"
              disabled={saved}
            >
              {saved ? (
                <><Check className="w-4 h-4 mr-2" /> Saved</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card border border-border p-4 sticky top-24"
            >
              {settingsSections.map((section) => {
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "secondary" : "ghost"}
                    className={`w-full justify-start mb-1 ${
                      activeSection === section.id 
                        ? "bg-[#156d95]/10 text-[#156d95] hover:bg-[#156d95]/20" 
                        : ""
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {section.label}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                )
              })}
            </motion.div>
          </aside>

          {/* Main Content */}
          <main>
            {activeSection === "account" && <AccountSection />}
            {activeSection === "profile" && <ProfileSection />}
            {activeSection === "twin" && <TwinSection />}
            {activeSection === "privacy" && <PrivacySection />}
            {activeSection === "notifications" && <NotificationsSection />}
            {activeSection === "appearance" && <AppearanceSection />}
            {activeSection === "security" && <SecuritySection />}
            {activeSection === "connected" && <ConnectedAccountsSection />}
            {activeSection === "danger" && <DangerZoneSection />}
          </main>
        </div>
      </div>
    </div>
  )
}

// Account Section
function AccountSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Account Settings</h2>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" defaultValue="Alex Johnson" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue="alex@example.com" />
          <p className="text-xs text-muted-foreground">Your email is verified</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="@alexj" />
          <p className="text-xs text-muted-foreground">Your unique TwinLink username</p>
        </div>
      </div>
    </motion.div>
  )
}

// Profile Section
function ProfileSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Public Profile</h2>
        <p className="text-muted-foreground">Information visible to other users and their Twins</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <Link href="/settings/edit-profile">
          <Button className="w-full sm:w-auto">Edit Full Profile</Button>
        </Link>
      </div>
    </motion.div>
  )
}

// Twin Section
function TwinSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Digital Twin Settings</h2>
        <p className="text-muted-foreground">Configure how your AI Twin behaves and learns</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <Link href="/settings/twin">
          <Button className="w-full sm:w-auto">Configure Twin</Button>
        </Link>
      </div>
    </motion.div>
  )
}

// Privacy Section
function PrivacySection() {
  const [profileVisible, setProfileVisible] = useState(true)
  const [twinVisible, setTwinVisible] = useState(true)
  const [showOnline, setShowOnline] = useState(true)
  const [showLastActive, setShowLastActive] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Privacy Settings</h2>
        <p className="text-muted-foreground">Control who can see your information</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <SettingRow
          label="Profile Visibility"
          description="Allow other users to view your profile"
          checked={profileVisible}
          onCheckedChange={setProfileVisible}
        />

        <SettingRow
          label="Twin Visibility"
          description="Allow your Twin to appear in the network"
          checked={twinVisible}
          onCheckedChange={setTwinVisible}
        />

        <SettingRow
          label="Show Online Status"
          description="Display when you're active on TwinLink"
          checked={showOnline}
          onCheckedChange={setShowOnline}
        />

        <SettingRow
          label="Show Last Active"
          description="Display the last time you were active"
          checked={showLastActive}
          onCheckedChange={setShowLastActive}
        />
      </div>
    </motion.div>
  )
}

// Notifications Section
function NotificationsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [matchNotifs, setMatchNotifs] = useState(true)
  const [messageNotifs, setMessageNotifs] = useState(true)
  const [twinNotifs, setTwinNotifs] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Notification Preferences</h2>
        <p className="text-muted-foreground">Choose how you want to be notified</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-4">Channels</h3>
          <div className="space-y-4">
            <SettingRow
              label="Email Notifications"
              description="Receive notifications via email"
              checked={emailNotifs}
              onCheckedChange={setEmailNotifs}
            />
            <SettingRow
              label="Push Notifications"
              description="Receive push notifications in browser"
              checked={pushNotifs}
              onCheckedChange={setPushNotifs}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-foreground mb-4">Types</h3>
          <div className="space-y-4">
            <SettingRow
              label="New Matches"
              description="Get notified when you have new high-compatibility matches"
              checked={matchNotifs}
              onCheckedChange={setMatchNotifs}
            />
            <SettingRow
              label="New Messages"
              description="Get notified when you receive new messages"
              checked={messageNotifs}
              onCheckedChange={setMessageNotifs}
            />
            <SettingRow
              label="Twin Updates"
              description="Get notified when your Twin learns or updates"
              checked={twinNotifs}
              onCheckedChange={setTwinNotifs}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Appearance Section
function AppearanceSection() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Appearance</h2>
        <p className="text-muted-foreground">Customize how TwinLink looks</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div>
          <Label className="mb-4 block">Theme</Label>
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption
              icon={Sun}
              label="Light"
              active={theme === "light"}
              onClick={() => setTheme("light")}
            />
            <ThemeOption
              icon={Moon}
              label="Dark"
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
            />
            <ThemeOption
              icon={Monitor}
              label="System"
              active={theme === "system"}
              onClick={() => setTheme("system")}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Security Section
function SecuritySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Security</h2>
        <p className="text-muted-foreground">Manage your password and authentication</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div>
          <Label className="mb-4 block">Change Password</Label>
          <div className="space-y-4 max-w-md">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-foreground mb-2">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </div>
    </motion.div>
  )
}

// Connected Accounts Section
function ConnectedAccountsSection() {
  const accounts = [
    { name: "Google", connected: true, icon: "🔵" },
    { name: "LinkedIn", connected: false, icon: "💼" },
    { name: "GitHub", connected: false, icon: "🐙" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Connected Accounts</h2>
        <p className="text-muted-foreground">Link external services to your TwinLink account</p>
      </div>

      <Separator />

      <div className="space-y-4">
        {accounts.map((account) => (
          <div key={account.name} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{account.icon}</div>
              <div>
                <div className="font-semibold text-foreground">{account.name}</div>
                <div className="text-xs text-muted-foreground">
                  {account.connected ? "Connected" : "Not connected"}
                </div>
              </div>
            </div>
            <Button variant={account.connected ? "outline" : "default"}>
              {account.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// Danger Zone Section
function DangerZoneSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-red-500/20 p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-muted-foreground">Irreversible and destructive actions</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <h3 className="font-semibold text-foreground mb-2">Deactivate Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Temporarily deactivate your account. You can reactivate it later.
          </p>
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
            Deactivate Account
          </Button>
        </div>

        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <h3 className="font-semibold text-foreground mb-2">Delete Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// Helper Components
function SettingRow({ label, description, checked, onCheckedChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="font-semibold text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

function ThemeOption({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all ${
        active 
          ? "border-[#156d95] bg-[#156d95]/10" 
          : "border-border hover:border-[#156d95]/50"
      }`}
    >
      <Icon className={`w-8 h-8 mx-auto mb-2 ${active ? "text-[#156d95]" : "text-muted-foreground"}`} />
      <div className={`text-sm font-medium ${active ? "text-[#156d95]" : "text-foreground"}`}>
        {label}
      </div>
    </button>
  )
}
