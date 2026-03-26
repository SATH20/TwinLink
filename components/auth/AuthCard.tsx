'use client';

import { useState } from 'react';
import { SignIn, SignUp } from '@clerk/nextjs';

export default function AuthCard() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8 lg:p-10 transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors duration-300">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
            {isSignUp ? 'Start building your digital twin' : 'Sign in to your account'}
          </p>
        </div>

        {/* Clerk Auth Component */}
        <div className="flex justify-center">
          {isSignUp ? (
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600",
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                  footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                }
              }}
              routing="hash"
              signInUrl="/auth"
              afterSignUpUrl="/onboarding"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600",
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                  footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                }
              }}
              routing="hash"
              signUpUrl="/auth"
              afterSignInUrl="/dashboard"
            />
          )}
        </div>

        {/* Toggle Sign In/Up */}
        <div className="text-center mt-6">
          <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-300"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
