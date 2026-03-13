import { Metadata } from 'next';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';

export const metadata: Metadata = {
  title: 'Create Your Digital Twin - TwinLink',
  description: 'Build your AI-powered digital twin by answering a few questions about your personality and interests.',
};

export default function OnboardingPage() {
  return <OnboardingLayout />;
}