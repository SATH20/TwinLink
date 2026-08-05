"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Bot, Mail, Lock, ArrowRight, Check, Shield, Sparkles, Network, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useSignUp } from "@clerk/nextjs/legacy"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const { signUp, isLoaded } = useSignUp()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) newErrors.fullName = "Full name is required"
    if (!email.includes("@")) newErrors.email = "Valid email is required"
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    if (!agreeToTerms) newErrors.terms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (!isLoaded || !signUp) {
      setErrors({ submit: "Authentication is still loading. Please refresh the page if this message stays visible." })
      return
    }

    setIsLoading(true)

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" ") || undefined,
      })

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      setIsSuccess(true)
      setTimeout(() => {
        router.push("/onboarding")
      }, 1500)
    } catch (err: any) {
      console.error("Signup error:", err)
      const errorMessage = err.errors?.[0]?.message || "Failed to create account. Please try again."
      setErrors({ submit: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: "oauth_google" | "oauth_github") => {
    if (!isLoaded || !signUp) {
      setErrors({ submit: "Authentication is still loading. Please refresh the page if this message stays visible." })
      return
    }

    setSocialLoading(provider)
    setErrors({})

    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding",
      })
    } catch (err: any) {
      console.error(`${provider} signup error:`, err)
      setErrors({ submit: err.errors?.[0]?.message || `Failed to connect with ${provider}. Please try again.` })
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "Figtree" }}>
                TwinLink
              </span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <h1
              className="text-4xl font-bold text-foreground mb-3 tracking-tight"
              style={{ fontFamily: "Figtree", fontWeight: "700", letterSpacing: "-0.02em" }}
            >
              Create Your Digital Twin
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "Figtree" }}>
              Your Twin will represent your personality, values, and goals—discovering meaningful connections through AI.
            </p>
          </motion.div>

          {/* Premium Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#156d95]/5 via-[#8b5cf6]/5 to-[#0ea5e9]/5 border border-[#156d95]/10 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4 mb-4">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#156d95] to-[#0e5a7a] flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Bot className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1" style={{ fontFamily: "Figtree" }}>
                  🤖 AI Digital Twin
                </h3>
              </div>
            </div>
            <ul className="space-y-2">
              {[
                "Represents your personality",
                "Learns your preferences",
                "Protects your privacy",
                "Finds meaningful connections",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  style={{ fontFamily: "Figtree" }}
                >
                  <div className="w-1 h-1 rounded-full bg-[#156d95]" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3 mb-6"
          >
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-medium hover:shadow-md transition-all border-2 hover:bg-gray-50 dark:hover:bg-gray-900 text-foreground"
                onClick={() => handleSocialSignup("oauth_google")}
                disabled={socialLoading !== null}
              >
                {socialLoading === "oauth_google" ? (
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-medium hover:shadow-md transition-all border-2 hover:bg-gray-50 dark:hover:bg-gray-900 text-foreground"
                onClick={() => handleSocialSignup("oauth_github")}
                disabled={socialLoading !== null}
              >
                {socialLoading === "oauth_github" ? (
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span>Continue with GitHub</span>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4 my-6"
          >
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground" style={{ fontFamily: "Figtree" }}>
              or
            </span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Form - Email/Password signup */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2.5" style={{ fontFamily: "Figtree" }}>
                Full Name
              </label>
              <div className="relative group">
                <motion.div
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  animate={{
                    scale: focusedField === "fullName" ? 1.1 : 1,
                  }}
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                </motion.div>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    setErrors({ ...errors, fullName: "" })
                  }}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 h-11 rounded-xl transition-all duration-200"
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-destructive mt-1.5">{errors.fullName}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.65 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2.5" style={{ fontFamily: "Figtree" }}>
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors({ ...errors, email: "" })
                  }}
                  className="pl-10 h-11 rounded-xl transition-all duration-200"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1.5">{errors.email}</p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2.5" style={{ fontFamily: "Figtree" }}>
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors({ ...errors, password: "" })
                  }}
                  className="pl-10 h-11 rounded-xl transition-all duration-200"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1.5">{errors.password}</p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.75 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2.5" style={{ fontFamily: "Figtree" }}>
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrors({ ...errors, confirmPassword: "" })
                  }}
                  className="pl-10 h-11 rounded-xl transition-all duration-200"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1.5">{errors.confirmPassword}</p>
              )}
            </motion.div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => {
                    setAgreeToTerms(!!checked)
                    setErrors({ ...errors, terms: "" })
                  }}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-foreground cursor-pointer" style={{ fontFamily: "Figtree" }}>
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#156d95] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#156d95] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && <p className="text-xs text-destructive mt-1">{errors.terms}</p>}
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.85 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#156d95] to-[#0e5a7a] hover:from-[#0e5a7a] hover:to-[#156d95] text-white h-12 rounded-xl text-base font-semibold transition-all shadow-lg"
                disabled={isLoading || isSuccess}
              >
                {isSuccess ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Twin Created!
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating your Twin...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create My Twin
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "Figtree" }}>
              Already have a Digital Twin?{" "}
              <Link href="/login" className="text-[#156d95] hover:underline font-medium">
                Sign in →
              </Link>
            </p>
          </motion.div>

          {/* Why TwinLink Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <h3 className="text-sm font-semibold text-foreground mb-6 text-center" style={{ fontFamily: "Figtree" }}>
              Why TwinLink?
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Sparkles, title: "AI-First", description: "Powered by advanced AI" },
                { icon: Shield, title: "Privacy", description: "Your data is secure" },
                { icon: Network, title: "Meaningful", description: "Real connections" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#156d95]/20 to-[#8b5cf6]/20 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-[#156d95]" />
                  </div>
                  <h4 className="text-xs font-semibold text-foreground mb-1" style={{ fontFamily: "Figtree" }}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "Figtree" }}>
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#156d95]/10 via-[#8b5cf6]/10 to-[#0ea5e9]/10 items-center justify-center p-12 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg text-center"
        >
          <h2 className="text-3xl font-semibold text-foreground mb-4" style={{ fontFamily: "Figtree" }}>
            Welcome to TwinLink
          </h2>
          <p className="text-lg text-muted-foreground" style={{ fontFamily: "Figtree" }}>
            Start your journey in the world's first AI Digital Twin Network. Your twin awaits.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
