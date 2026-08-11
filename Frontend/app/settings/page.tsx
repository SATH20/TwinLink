"use client"

import { motion } from "framer-motion"
import {
  Bot, Bell, Lock, Palette, Shield, Link as LinkIcon, Trash2,
  User, Settings as SettingsIcon, Moon, Sun, Monitor, ChevronRight,
  ArrowLeft, Save, Loader2, LogOut, AlertCircle, Mail, ExternalLink,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useUser, useAuth, useClerk } from "@clerk/nextjs"
import { toast } from "sonner"
import {
  getMyAccount,
  updateMyAccount,
  deleteMyAccount,
  getMyProfile,
  updateProfile,
  updateSettings,
  getTwin,
  updateTwin,
  getFriendlyErrorMessage,
  type AccountUser,
  type ProfileResponse,
  type TwinResponse,
} from "@/lib/api-client"

// This page is authenticated and manages the current user's own settings.
export const dynamic = "force-dynamic"

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
  const { getToken } = useAuth()
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [account, setAccount] = useState<AccountUser | null>(null)
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [twin, setTwin] = useState<TwinResponse | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")

      const [acc, prof, tw] = await Promise.allSettled([
        getMyAccount(token),
        getMyProfile(token),
        getTwin(token),
      ])

      if (acc.status === "fulfilled") setAccount(acc.value)
      else throw new Error(getFriendlyErrorMessage(acc.reason))

      if (prof.status === "fulfilled") setProfile(prof.value)
      setTwin(tw.status === "fulfilled" ? tw.value : null)
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    loadData()
  }, [loadData])

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

            <Badge variant="secondary" className="hidden sm:flex">
              Changes save per section
            </Badge>
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
            {loading || !clerkLoaded ? (
              <div className="rounded-2xl bg-card border border-border p-8 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#156d95]" />
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-card border border-border p-8 text-center min-h-[40vh] flex flex-col items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                <h2 className="text-xl font-bold mb-2">Couldn&apos;t load your settings</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={loadData}>Try Again</Button>
              </div>
            ) : (
              <>
                {activeSection === "account" && (
                  <AccountSection
                    account={account}
                    clerkUser={clerkUser}
                    getToken={getToken}
                    onSaved={setAccount}
                  />
                )}
                {activeSection === "profile" && (
                  <ProfileSection
                    profile={profile}
                    account={account}
                    getToken={getToken}
                    onProfileSaved={setProfile}
                    onAccountSaved={setAccount}
                  />
                )}
                {activeSection === "twin" && (
                  <TwinSection
                    twin={twin}
                    profile={profile}
                    getToken={getToken}
                    onTwinSaved={setTwin}
                    onProfileSaved={setProfile}
                  />
                )}
                {activeSection === "privacy" && (
                  <PrivacySection profile={profile} getToken={getToken} onSaved={setProfile} />
                )}
                {activeSection === "notifications" && (
                  <NotificationsSection profile={profile} getToken={getToken} onSaved={setProfile} />
                )}
                {activeSection === "appearance" && <AppearanceSection />}
                {activeSection === "security" && <SecuritySection />}
                {activeSection === "connected" && <ConnectedAccountsSection clerkUser={clerkUser} />}
                {activeSection === "danger" && <DangerZoneSection getToken={getToken} />}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// ── Reusable save button with loading/success states ──
function SaveButton({
  onClick,
  saving,
  disabled,
  label = "Save Changes",
}: {
  onClick: () => void
  saving: boolean
  disabled?: boolean
  label?: string
}) {
  return (
    <Button
      onClick={onClick}
      disabled={saving || disabled}
      className="bg-gradient-to-r from-[#156d95] to-[#8b5cf6] text-white hover:opacity-90"
    >
      {saving ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" /> {label}
        </>
      )}
    </Button>
  )
}

function SectionCard({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-card border p-8 space-y-6 ${danger ? "border-red-500/20" : "border-border"}`}
    >
      {children}
    </motion.div>
  )
}

// ── Account Section ──
function AccountSection({
  account,
  clerkUser,
  getToken,
  onSaved,
}: {
  account: AccountUser | null
  clerkUser: any
  getToken: () => Promise<string | null>
  onSaved: (a: AccountUser) => void
}) {
  const [name, setName] = useState(account?.name ?? "")
  const [username, setUsername] = useState(account?.username ?? "")
  const [phone, setPhone] = useState(account?.phone ?? "")
  const [saving, setSaving] = useState(false)

  const email = clerkUser?.primaryEmailAddress?.emailAddress || account?.email || ""

  const dirty =
    name !== (account?.name ?? "") ||
    username !== (account?.username ?? "") ||
    phone !== (account?.phone ?? "")

  const handleSave = async () => {
    if (name.trim().length < 2) {
      toast.error("Please enter your full name (at least 2 characters).")
      return
    }
    if (username && !/^[a-zA-Z0-9_.]{3,30}$/.test(username.trim())) {
      toast.error("Username must be 3-30 characters: letters, numbers, _ or .")
      return
    }
    setSaving(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      const updated = await updateMyAccount(token, {
        name: name.trim(),
        username: username.trim() || undefined,
        phone: phone.trim(),
      })
      onSaved(updated)
      toast.success("Account updated.")
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err)
      toast.error(err?.status === 409 ? "That username is already taken." : msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Account Settings</h2>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={email} disabled readOnly />
          <p className="text-xs text-muted-foreground">
            Your email is managed by your sign-in provider. Manage it under Security.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a unique username"
          />
          <p className="text-xs text-muted-foreground">Your unique TwinLink username</p>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saving={saving} disabled={!dirty} />
      </div>
    </SectionCard>
  )
}

// ── Profile Section (public profile used across TwinLink) ──
function ProfileSection({
  profile,
  account,
  getToken,
  onProfileSaved,
  onAccountSaved,
}: {
  profile: ProfileResponse | null
  account: AccountUser | null
  getToken: () => Promise<string | null>
  onProfileSaved: (p: ProfileResponse) => void
  onAccountSaved: (a: AccountUser) => void
}) {
  const [name, setName] = useState(account?.name ?? "")
  const [bio, setBio] = useState(profile?.bio ?? "")
  const [age, setAge] = useState(profile?.age ? String(profile.age) : "")
  const [city, setCity] = useState(profile?.location?.city ?? "")
  const [country, setCountry] = useState(profile?.location?.country ?? "")
  const [profession, setProfession] = useState(profile?.profession?.title ?? "")
  const [interests, setInterests] = useState((profile?.interests ?? []).join(", "))
  const [values, setValues] = useState((profile?.values ?? []).join(", "))
  const [relationship, setRelationship] = useState(profile?.goals?.relationship ?? "")
  const [personalGoals, setPersonalGoals] = useState((profile?.goals?.personal ?? []).join(", "))
  const [socialLevel, setSocialLevel] = useState(profile?.lifestyle?.socialLevel ?? "")
  const [exercise, setExercise] = useState(profile?.lifestyle?.exercise ?? "")
  const [diet, setDiet] = useState(profile?.lifestyle?.diet ?? "")
  const [saving, setSaving] = useState(false)

  const splitList = (s: string) =>
    s.split(",").map((x) => x.trim()).filter(Boolean)

  const handleSave = async () => {
    if (age && (Number(age) < 18 || Number(age) > 120)) {
      toast.error("Age must be between 18 and 120.")
      return
    }
    setSaving(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")

      // Build a profile payload that keeps nested required fields intact by
      // merging edits over the existing profile values.
      const payload: any = {
        bio,
        interests: splitList(interests),
        values: splitList(values),
      }
      if (age) payload.age = Number(age)

      if (city.trim() && country.trim()) {
        payload.location = {
          city: city.trim(),
          country: country.trim(),
          ...(profile?.location?.state ? { state: profile.location.state } : {}),
          ...(profile?.location?.coordinates ? { coordinates: profile.location.coordinates } : {}),
        }
      }

      if (profession.trim()) {
        payload.profession = {
          title: profession.trim(),
          ...(profile?.profession?.industry ? { industry: profile.profession.industry } : {}),
          ...(profile?.profession?.company ? { company: profile.profession.company } : {}),
        }
      }

      const rel = relationship.trim() || profile?.goals?.relationship
      if (rel) {
        payload.goals = {
          relationship: rel,
          personal: splitList(personalGoals),
          ...(profile?.goals?.timeline ? { timeline: profile.goals.timeline } : {}),
        }
      }

      const social = socialLevel.trim() || profile?.lifestyle?.socialLevel
      const ex = exercise.trim() || profile?.lifestyle?.exercise
      if (social && ex) {
        payload.lifestyle = {
          schedule: profile?.lifestyle?.schedule || "flexible",
          socialLevel: social,
          exercise: ex,
          ...(diet.trim() ? { diet: diet.trim() } : profile?.lifestyle?.diet ? { diet: profile.lifestyle.diet } : {}),
          ...(profile?.lifestyle?.smoking ? { smoking: profile.lifestyle.smoking } : {}),
          ...(profile?.lifestyle?.drinking ? { drinking: profile.lifestyle.drinking } : {}),
        }
      }

      // Name lives on the user record (shown across TwinLink), not the profile.
      const tasks: Promise<any>[] = [updateProfile(token, payload)]
      const nameChanged = name.trim() && name.trim() !== (account?.name ?? "")
      if (nameChanged) tasks.push(updateMyAccount(token, { name: name.trim() }))

      const [updatedProfile, updatedAccount] = await Promise.all(tasks)
      onProfileSaved(updatedProfile)
      if (updatedAccount) onAccountSaved(updatedAccount)
      toast.success("Profile updated.")
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err) || "Could not save your profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Public Profile</h2>
        <p className="text-muted-foreground">
          Information visible to other users and their Twins across recommendations and connections
        </p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="p-name">Name</Label>
          <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="p-age">Age</Label>
            <Input id="p-age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-profession">Profession</Label>
            <Input id="p-profession" value={profession} onChange={(e) => setProfession(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="p-city">City</Label>
            <Input id="p-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-country">Country</Label>
            <Input id="p-country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="p-bio">Bio</Label>
          <Textarea id="p-bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell others about yourself" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="p-interests">Interests</Label>
          <Input id="p-interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Comma separated, e.g. Travel, Music, AI" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="p-values">Values</Label>
          <Input id="p-values" value={values} onChange={(e) => setValues(e.target.value)} placeholder="Comma separated, e.g. Honesty, Growth" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="p-rel">Relationship Goal</Label>
            <Input id="p-rel" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="e.g. Long-term Relationship" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-personal">Personal Goals</Label>
            <Input id="p-personal" value={personalGoals} onChange={(e) => setPersonalGoals(e.target.value)} placeholder="Comma separated" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4">Lifestyle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="p-social">Social Level</Label>
              <Input id="p-social" value={socialLevel} onChange={(e) => setSocialLevel(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-exercise">Exercise</Label>
              <Input id="p-exercise" value={exercise} onChange={(e) => setExercise(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-diet">Diet</Label>
              <Input id="p-diet" value={diet} onChange={(e) => setDiet(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saving={saving} />
      </div>
    </SectionCard>
  )
}

// ── Digital Twin Section ──
function TwinSection({
  twin,
  profile,
  getToken,
  onTwinSaved,
  onProfileSaved,
}: {
  twin: TwinResponse | null
  profile: ProfileResponse | null
  getToken: () => Promise<string | null>
  onTwinSaved: (t: TwinResponse) => void
  onProfileSaved: (p: ProfileResponse) => void
}) {
  const [instructions, setInstructions] = useState("")
  const [savingTwin, setSavingTwin] = useState(false)
  const [includeInMatching, setIncludeInMatching] = useState(
    profile?.privacy?.includeInMatching !== false
  )
  const [savingMatch, setSavingMatch] = useState(false)

  const handleMatchingToggle = async (value: boolean) => {
    setIncludeInMatching(value)
    setSavingMatch(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      const updated = await updateSettings(token, { privacy: { includeInMatching: value } })
      onProfileSaved(updated)
      toast.success(value ? "Your Twin will appear in recommendations." : "Your Twin is now hidden from recommendations.")
    } catch (err) {
      setIncludeInMatching(!value)
      toast.error(getFriendlyErrorMessage(err) || "Could not update matching setting.")
    } finally {
      setSavingMatch(false)
    }
  }

  const handleSaveInstructions = async () => {
    if (!twin) return
    setSavingTwin(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      const updated = await updateTwin(token, { customPromptAdditions: instructions.trim() })
      onTwinSaved(updated)
      setInstructions("")
      toast.success("Twin instructions saved.")
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err) || "Could not update your Twin.")
    } finally {
      setSavingTwin(false)
    }
  }

  const personality = profile?.personality || {}
  const personalityLabels: string[] = []
  if (typeof personality.openness === "number" && personality.openness >= (personality.openness > 1 ? 60 : 0.6)) personalityLabels.push("Open-minded")
  if (typeof personality.conscientiousness === "number" && personality.conscientiousness >= (personality.conscientiousness > 1 ? 60 : 0.6)) personalityLabels.push("Conscientious")
  if (typeof personality.extraversion === "number" && personality.extraversion >= (personality.extraversion > 1 ? 60 : 0.6)) personalityLabels.push("Extraverted")

  return (
    <SectionCard>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Digital Twin Settings</h2>
        <p className="text-muted-foreground">Configure how your AI Twin behaves and participates in the network</p>
      </div>

      <Separator />

      {!twin ? (
        <div className="p-6 rounded-xl border border-border bg-muted/30 text-center">
          <Bot className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-60" />
          <p className="text-muted-foreground mb-4">
            You don&apos;t have a Digital Twin yet. Complete your profile to generate one.
          </p>
          <Link href="/onboarding">
            <Button variant="outline">Go to Onboarding</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Twin snapshot (read-only, from the real Twin/Profile records) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoTile label="Learning Status" value={twin.status} />
            <InfoTile label="Twin Version" value={`v${twin.version}`} />
            <InfoTile label="Communication Style" value={profile?.communicationStyle || "Not set"} />
            <InfoTile label="Current Mission" value={profile?.goals?.relationship || "Finding compatible connections"} />
          </div>

          {personalityLabels.length > 0 && (
            <div>
              <Label className="mb-2 block">Personality</Label>
              <div className="flex flex-wrap gap-2">
                {personalityLabels.map((p) => (
                  <Badge key={p} variant="secondary">{p}</Badge>
                ))}
              </div>
            </div>
          )}

          {(profile?.interests?.length ?? 0) > 0 && (
            <div>
              <Label className="mb-2 block">Interests</Label>
              <div className="flex flex-wrap gap-2">
                {profile!.interests!.slice(0, 10).map((i) => (
                  <Badge key={i} variant="secondary">{i}</Badge>
                ))}
              </div>
            </div>
          )}

          {(profile?.values?.length ?? 0) > 0 && (
            <div>
              <Label className="mb-2 block">Values</Label>
              <div className="flex flex-wrap gap-2">
                {profile!.values!.slice(0, 10).map((v) => (
                  <Badge key={v} variant="secondary">{v}</Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <SettingRow
            label="Participate in matching"
            description="Allow your Twin to be included in other users' recommendations"
            checked={includeInMatching}
            onCheckedChange={handleMatchingToggle}
            disabled={savingMatch}
          />

          {/* Honest "unavailable" state — the backend has no autonomous twin-initiated conversations */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border opacity-70">
            <div className="flex-1">
              <div className="font-semibold text-foreground">Let Twin start AI conversations automatically</div>
              <div className="text-sm text-muted-foreground">
                Not available yet — AI conversations are started by you from Recommendations.
              </div>
            </div>
            <Badge variant="outline">Unavailable</Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="twin-instructions">Custom Twin Instructions</Label>
            <Textarea
              id="twin-instructions"
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add extra guidance for how your Twin should represent you..."
            />
            <p className="text-xs text-muted-foreground">
              These instructions are appended to your Twin&apos;s system prompt.
            </p>
            <div className="flex justify-end">
              <SaveButton onClick={handleSaveInstructions} saving={savingTwin} disabled={!instructions.trim()} label="Save Instructions" />
            </div>
          </div>
        </>
      )}
    </SectionCard>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-muted/20">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="font-semibold text-foreground capitalize">{value}</div>
    </div>
  )
}

// ── Privacy Section ──
function PrivacySection({
  profile,
  getToken,
  onSaved,
}: {
  profile: ProfileResponse | null
  getToken: () => Promise<string | null>
  onSaved: (p: ProfileResponse) => void
}) {
  const [visibility, setVisibility] = useState<"public" | "connections">(
    profile?.privacy?.profileVisibility ?? "public"
  )
  const [includeInMatching, setIncludeInMatching] = useState(
    profile?.privacy?.includeInMatching !== false
  )
  const [saving, setSaving] = useState(false)

  const dirty =
    visibility !== (profile?.privacy?.profileVisibility ?? "public") ||
    includeInMatching !== (profile?.privacy?.includeInMatching !== false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      const updated = await updateSettings(token, {
        privacy: { profileVisibility: visibility, includeInMatching },
      })
      onSaved(updated)
      toast.success("Privacy settings saved.")
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err) || "Could not save privacy settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Privacy Settings</h2>
        <p className="text-muted-foreground">Control who can see your information</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div>
          <Label className="mb-3 block">Profile Visibility</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <VisibilityOption
              title="Public"
              description="Anyone on TwinLink can view your profile details."
              active={visibility === "public"}
              onClick={() => setVisibility("public")}
            />
            <VisibilityOption
              title="Connections only"
              description="Only accepted connections can see your full profile."
              active={visibility === "connections"}
              onClick={() => setVisibility("connections")}
            />
          </div>
        </div>

        <SettingRow
          label="Include me in recommendations"
          description="Allow your Twin to appear in other users' match recommendations"
          checked={includeInMatching}
          onCheckedChange={setIncludeInMatching}
        />

        <p className="text-xs text-muted-foreground">
          Your email and phone number are never shown to other users.
        </p>
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saving={saving} disabled={!dirty} />
      </div>
    </SectionCard>
  )
}

function VisibilityOption({
  title,
  description,
  active,
  onClick,
}: {
  title: string
  description: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border-2 transition-all ${
        active ? "border-[#156d95] bg-[#156d95]/10" : "border-border hover:border-[#156d95]/50"
      }`}
    >
      <div className={`font-semibold mb-1 ${active ? "text-[#156d95]" : "text-foreground"}`}>{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </button>
  )
}

// ── Notifications Section ──
function NotificationsSection({
  profile,
  getToken,
  onSaved,
}: {
  profile: ProfileResponse | null
  getToken: () => Promise<string | null>
  onSaved: (p: ProfileResponse) => void
}) {
  const prefs = profile?.notificationPreferences
  const [connectionRequests, setConnectionRequests] = useState(prefs?.connectionRequests !== false)
  const [connectionAccepted, setConnectionAccepted] = useState(prefs?.connectionAccepted !== false)
  const [newMessages, setNewMessages] = useState(prefs?.newMessages !== false)
  const [twinUpdates, setTwinUpdates] = useState(prefs?.twinUpdates !== false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      const updated = await updateSettings(token, {
        notificationPreferences: {
          connectionRequests,
          connectionAccepted,
          newMessages,
          twinUpdates,
        },
      })
      onSaved(updated)
      toast.success("Notification preferences saved.")
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err) || "Could not save notification preferences.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Notification Preferences</h2>
        <p className="text-muted-foreground">Choose which notifications you receive</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <SettingRow
          label="Connection requests"
          description="When someone wants to connect with you"
          checked={connectionRequests}
          onCheckedChange={setConnectionRequests}
        />
        <SettingRow
          label="Connection accepted"
          description="When someone accepts your connection request"
          checked={connectionAccepted}
          onCheckedChange={setConnectionAccepted}
        />
        <SettingRow
          label="New messages"
          description="When you receive a new human chat message"
          checked={newMessages}
          onCheckedChange={setNewMessages}
        />
        <SettingRow
          label="AI / Twin updates"
          description="When your Digital Twin learns or updates"
          checked={twinUpdates}
          onCheckedChange={setTwinUpdates}
        />
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saving={saving} />
      </div>
    </SectionCard>
  )
}

// ── Appearance Section (theme via next-themes, persisted) ──
function AppearanceSection() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const active = mounted ? theme : undefined

  return (
    <SectionCard>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Appearance</h2>
        <p className="text-muted-foreground">Customize how TwinLink looks. Your choice is saved on this device.</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div>
          <Label className="mb-4 block">Theme</Label>
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption icon={Sun} label="Light" active={active === "light"} onClick={() => setTheme("light")} />
            <ThemeOption icon={Moon} label="Dark" active={active === "dark"} onClick={() => setTheme("dark")} />
            <ThemeOption icon={Monitor} label="System" active={active === "system"} onClick={() => setTheme("system")} />
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

// ── Security Section (Clerk-managed) ──
function SecuritySection() {
  const { openUserProfile, signOut } = useClerk()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push("/")
    } catch {
      setSigningOut(false)
      toast.error("Could not sign out. Please try again.")
    }
  }

  return (
    <SectionCard>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Security</h2>
        <p className="text-muted-foreground">Your authentication is managed securely by Clerk</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#156d95]" />
            <div>
              <div className="font-semibold text-foreground">Password &amp; Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">Manage your password, 2FA and active sessions</div>
            </div>
          </div>
          <Button variant="outline" onClick={() => openUserProfile()}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="font-semibold text-foreground">Sign out of this device</div>
              <div className="text-sm text-muted-foreground">End your current session on this browser</div>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
            Sign Out
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          To sign out of other sessions, open “Manage” above and use the Security tab.
        </p>
      </div>
    </SectionCard>
  )
}

// ── Connected Accounts Section (real Clerk data) ──
function ConnectedAccountsSection({ clerkUser }: { clerkUser: any }) {
  const { openUserProfile } = useClerk()

  const externalAccounts = (clerkUser?.externalAccounts ?? []) as any[]
  const emails = (clerkUser?.emailAddresses ?? []) as any[]
  const primaryEmail = clerkUser?.primaryEmailAddress?.emailAddress

  const providerLabel = (p: string) =>
    (p || "").replace(/^oauth_/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <SectionCard>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Connected Accounts</h2>
        <p className="text-muted-foreground">Sign-in methods linked to your account</p>
      </div>

      <Separator />

      <div className="space-y-4">
        {/* Email (always present) */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#156d95]" />
            <div>
              <div className="font-semibold text-foreground">Email</div>
              <div className="text-xs text-muted-foreground">{primaryEmail || emails[0]?.emailAddress || "—"}</div>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Connected</Badge>
        </div>

        {/* Real OAuth providers from Clerk */}
        {externalAccounts.map((acc, idx) => (
          <div key={acc.id || idx} className="flex items-center justify-between p-4 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-[#156d95]" />
              <div>
                <div className="font-semibold text-foreground">{providerLabel(acc.provider)}</div>
                <div className="text-xs text-muted-foreground">{acc.emailAddress || acc.username || "Connected"}</div>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Connected</Badge>
          </div>
        ))}

        {externalAccounts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No social accounts are linked yet.
          </p>
        )}

        <div className="pt-2">
          <Button variant="outline" onClick={() => openUserProfile()}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Manage connected accounts
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}

// ── Danger Zone Section ──
function DangerZoneSection({ getToken }: { getToken: () => Promise<string | null> }) {
  const { signOut } = useClerk()
  const router = useRouter()
  const [showDelete, setShowDelete] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push("/")
    } catch {
      setSigningOut(false)
      toast.error("Could not sign out.")
    }
  }

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return
    setDeleting(true)
    try {
      const token = await getToken()
      if (!token) throw new Error("Authentication required")
      await deleteMyAccount(token)
      toast.success("Your account has been deleted.")
      await signOut().catch(() => {})
      router.push("/")
    } catch (err) {
      setDeleting(false)
      toast.error(getFriendlyErrorMessage(err) || "Could not delete your account. Please try again.")
    }
  }

  return (
    <SectionCard danger>
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-muted-foreground">Irreversible and destructive actions</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-border bg-muted/20">
          <h3 className="font-semibold text-foreground mb-2">Sign Out</h3>
          <p className="text-sm text-muted-foreground mb-4">Sign out of your TwinLink account on this device.</p>
          <Button variant="outline" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
            Sign Out
          </Button>
        </div>

        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <h3 className="font-semibold text-foreground mb-2">Delete Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-500/10"
            onClick={() => {
              setConfirmText("")
              setShowDelete(true)
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !deleting && setShowDelete(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-card border border-border rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Delete your account?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This permanently removes your TwinLink account and associated data, including your
              profile, Digital Twin, connections and messages.
            </p>
            <Label htmlFor="confirm-delete" className="mb-2 block">
              Type <span className="font-bold">DELETE</span> to confirm
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mb-4"
              disabled={deleting}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDelete(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || deleting}
              >
                {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Delete Account
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </SectionCard>
  )
}

// ── Helper Components ──
function SettingRow({ label, description, checked, onCheckedChange, disabled }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="font-semibold text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  )
}

function ThemeOption({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all ${
        active ? "border-[#156d95] bg-[#156d95]/10" : "border-border hover:border-[#156d95]/50"
      }`}
    >
      <Icon className={`w-8 h-8 mx-auto mb-2 ${active ? "text-[#156d95]" : "text-muted-foreground"}`} />
      <div className={`text-sm font-medium ${active ? "text-[#156d95]" : "text-foreground"}`}>{label}</div>
    </button>
  )
}
