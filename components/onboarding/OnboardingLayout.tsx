'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import ProgressBar from './ProgressBar';
import OptionCard from './OptionCard';
import ChipSelector from './ChipSelector';
import PersonalitySlider from './PersonalitySlider';
import { createTwin } from '@/lib/api';

interface OnboardingData {
  role: string;
  interests: string[];
  conversationStyle: string;
  lookingFor: string;
  personality: {
    introvertExtrovert: number;
    analyticalCreative: number;
    seriousPlayful: number;
  };
}

export default function OnboardingLayout() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OnboardingData>({
    role: '',
    interests: [],
    conversationStyle: '',
    lookingFor: '',
    personality: {
      introvertExtrovert: 50,
      analyticalCreative: 50,
      seriousPlayful: 50,
    },
  });

  const totalSteps = 5;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding - submit to backend
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!isLoaded || !user) {
      setError('User not authenticated. Please sign in.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        interests: data.interests,
        communicationStyle: data.conversationStyle,
        goals: data.lookingFor,
        personality: data.personality,
        category: data.lookingFor, // Using lookingFor as category
      };

      console.log('Submitting twin data:', payload);

      const response = await createTwin(payload);

      if (response.error) {
        throw new Error(response.error);
      }

      console.log('Twin created successfully:', response);

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      console.error('Error creating twin:', err);
      setError(err instanceof Error ? err.message : 'Failed to create twin. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.role !== '';
      case 2:
        return data.interests.length > 0;
      case 3:
        return data.conversationStyle !== '';
      case 4:
        return data.lookingFor !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors duration-300">
                What best describes you?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                Help us understand your background
              </p>
            </div>
            <div className="grid gap-4">
              {['Student', 'Developer', 'Entrepreneur', 'Designer', 'Other'].map((role) => (
                <OptionCard
                  key={role}
                  label={role}
                  icon={getIconForRole(role)}
                  selected={data.role === role}
                  onClick={() => setData({ ...data, role })}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors duration-300">
                What are your interests?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                Select all that apply
              </p>
            </div>
            <ChipSelector
              options={['Gaming', 'Technology', 'AI', 'Movies', 'Music', 'Sports', 'Reading', 'Travel']}
              selected={data.interests}
              onChange={(interests) => setData({ ...data, interests })}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors duration-300">
                How do you like conversations?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                Choose your preferred style
              </p>
            </div>
            <div className="grid gap-4">
              {[
                'Deep discussions',
                'Casual chats',
                'Collaborative problem solving',
                'Humorous conversations',
              ].map((style) => (
                <OptionCard
                  key={style}
                  label={style}
                  selected={data.conversationStyle === style}
                  onClick={() => setData({ ...data, conversationStyle: style })}
                />
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors duration-300">
                What are you looking for?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                Select your primary goal
              </p>
            </div>
            <div className="grid gap-4">
              {['Friends', 'Networking', 'Tech partners', 'Gaming buddies', 'Dating'].map((goal) => (
                <OptionCard
                  key={goal}
                  label={goal}
                  selected={data.lookingFor === goal}
                  onClick={() => setData({ ...data, lookingFor: goal })}
                />
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors duration-300">
                Tell us about your personality
              </h2>
              <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                Adjust the sliders to match your traits
              </p>
            </div>
            <div className="space-y-8">
              <PersonalitySlider
                leftLabel="Introvert"
                rightLabel="Extrovert"
                value={data.personality.introvertExtrovert}
                onChange={(value) =>
                  setData({
                    ...data,
                    personality: { ...data.personality, introvertExtrovert: value },
                  })
                }
              />
              <PersonalitySlider
                leftLabel="Analytical"
                rightLabel="Creative"
                value={data.personality.analyticalCreative}
                onChange={(value) =>
                  setData({
                    ...data,
                    personality: { ...data.personality, analyticalCreative: value },
                  })
                }
              />
              <PersonalitySlider
                leftLabel="Serious"
                rightLabel="Playful"
                value={data.personality.seriousPlayful}
                onChange={(value) =>
                  setData({
                    ...data,
                    personality: { ...data.personality, seriousPlayful: value },
                  })
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getIconForRole = (role: string) => {
    const icons: { [key: string]: string } = {
      Student: '🎓',
      Developer: '💻',
      Entrepreneur: '🚀',
      Designer: '🎨',
      Other: '✨',
    };
    return icons[role] || '✨';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-lg">TwinLink</span>
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Creating your digital twin
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              canProceed() && !isSubmitting
                ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Twin...
              </>
            ) : (
              <>
                {currentStep === totalSteps ? 'Complete' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}