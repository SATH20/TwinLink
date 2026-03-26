import { SignIn } from '@clerk/nextjs';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="flex min-h-screen">
        {/* Left Section - Brand Area */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-emerald-500"></div>
          
          {/* Gradient Orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-glow"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white p-12">
            <div className="max-w-lg space-y-8">
              {/* Logo */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className="text-3xl font-bold">TwinLink</span>
              </div>

              {/* Main Message */}
              <div className="space-y-6 text-center">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Welcome back to TwinLink
                </h1>
                <p className="text-lg text-blue-100 leading-relaxed max-w-md mx-auto">
                  Sign in to continue your journey and discover meaningful connections.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Sign In */}
        <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold cobalt-gradient-text">TwinLink</span>
            </div>

            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700",
                  headerTitle: "text-slate-900 dark:text-slate-100",
                  headerSubtitle: "text-slate-600 dark:text-slate-400",
                  socialButtonsBlockButton: "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600",
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                  footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                  formFieldInput: "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                }
              }}
              afterSignInUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
